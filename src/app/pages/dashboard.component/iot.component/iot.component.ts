import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

import { IotService } from '../../../services/iot.service';
import { Subscription } from 'rxjs';

const TMIN = 20;
const TMAX = 42;
const W_SENS = 32;
const H_SENS = 24;

const COLORSCALES: Record<string, (t: number) => number[]> = {
  jet: (t) => {
    const r = t < 0.5 ? 0 : t < 0.75 ? (t - 0.5) / 0.25 : 1;
    const g = t < 0.25 ? t / 0.25 : t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
    const b = t < 0.25 ? 1 : t < 0.5 ? 1 - (t - 0.25) / 0.25 : 0;
    return [r, g, b];
  },
  hot: (t) => {
    const r = Math.min(1, t * 3);
    const g = Math.min(1, Math.max(0, t * 3 - 1));
    const b = Math.min(1, Math.max(0, t * 3 - 2));
    return [r, g, b];
  },
  viridis: (t) => {
    const r = Math.max(0, Math.min(1, 0.28 + t * (0.62 + t * (-0.52 + t * 0.59))));
    const g = Math.max(0, Math.min(1, 0.00 + t * (1.40 + t * (-0.95 + t * 0.42))));
    const b = Math.max(0, Math.min(1, 0.34 + t * (1.32 + t * (-2.10 + t * 0.87))));
    return [r, g, b];
  },
  inferno: (t) => {
    const r = Math.max(0, Math.min(1, t < 0.5 ? t * 2 * 0.85 : 0.85 + (t - 0.5) * 2 * 0.15));
    const g = Math.max(0, Math.min(1, t < 0.4 ? 0 : (t - 0.4) / 0.6));
    const b = Math.max(0, Math.min(1, t < 0.25 ? t * 4 * 0.55 : Math.max(0, 0.55 - (t - 0.25) * 0.55 / 0.75)));
    return [r, g, b];
  },
  plasma: (t) => {
    const r = Math.max(0, Math.min(1, 0.05 + t * (1.30 + t * (-0.60 + t * 0.25))));
    const g = Math.max(0, Math.min(1, 0.03 + t * (-0.25 + t * (1.38 + t * (-0.55)))));
    const b = Math.max(0, Math.min(1, 0.53 + t * (0.48 + t * (-1.80 + t * 0.90))));
    return [r, g, b];
  }
};

@Component({
  selector: 'app-iot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iot.component.html',
  styleUrl: './iot.component.css',
  providers: [DecimalPipe]
})
export class IotComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('thermalCanvas', { static: false }) thermalCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('colorbarCanvas', { static: false }) colorbarCanvasRef!: ElementRef<HTMLCanvasElement>;

  wsConnected: boolean = false;
  frameCount: number = 0;
  fpsDisplay: string = '--';
  lastFrameTime: string = '--';
  lastApiUpdate: string = '--';

  liveTempValue: number | null = null;
  ambientTempValue: number | null = null;
  humidityValue: number | null = null;
  monitorActive: boolean = false;

  private currentColorscale = "jet";
  private offscreen: HTMLCanvasElement;
  private octx: CanvasRenderingContext2D;

  private fpsFrames: number = 0;
  private fpsLastTime: number = performance.now();

  private liveTempInterval: any;
  private monitorInterval: any;

  private rootTemp!: am5.Root;
  private rootHum!: am5.Root;
  private seriesLiveTemp!: am5xy.LineSeries;
  private seriesAmbTemp!: am5xy.LineSeries;
  private seriesHum!: am5xy.LineSeries;

  private subs: Subscription = new Subscription();

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private iotService: IotService
  ) {
    this.offscreen = document.createElement("canvas");
    this.offscreen.width = W_SENS;
    this.offscreen.height = H_SENS;
    this.octx = this.offscreen.getContext("2d") as CanvasRenderingContext2D;
  }

  ngOnInit(): void {
    // Escuchar estado de WS
    this.subs.add(
      this.iotService.wsConnected$.subscribe(status => {
        this.wsConnected = status;
        this.cdr.detectChanges();
      })
    );

    // Escuchar frames del mapa termico
    this.subs.add(
      this.iotService.thermalFrame$.subscribe(frame => {
        this.ngZone.runOutsideAngular(() => {
          this.drawThermal(frame);
        });
        this.frameCount++;
        this.fpsFrames++;
        this.updateFPS();
        this.lastFrameTime = new Date().toLocaleTimeString();
        this.cdr.detectChanges();
      })
    );

    // Escuchar data de DHT11
    this.subs.add(
      this.iotService.dhtData$.subscribe(data => {
        if (data.temperature !== null) this.ambientTempValue = data.temperature;
        if (data.humidity !== null) this.humidityValue = data.humidity;
        this.cdr.detectChanges();

        this.ngZone.runOutsideAngular(() => {
          const t = new Date().getTime();
          if (data.temperature !== null && this.seriesAmbTemp) {
            this.seriesAmbTemp.data.push({ date: t, value2: data.temperature });
          }
          if (data.humidity !== null && this.seriesHum) {
            this.seriesHum.data.push({ date: t, value: data.humidity });
          }
        });
      })
    );

    // Iniciar conexion e intervalos de API
    this.iotService.connectWS();
    this.liveTempInterval = setInterval(() => this.updateLiveTemp(), 1000);
    this.monitorInterval = setInterval(() => this.updateMonitoringStatus(), 3000);

    // Ejecuciones iniciales
    this.updateLiveTemp();
    this.updateMonitoringStatus();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.drawColorbar();
      try {
        this.initCharts();
      } catch (err) {
        console.error("Error initializing charts:", err);
      }
    });
  }

  ngOnDestroy(): void {
    this.iotService.disconnectWS();
    this.subs.unsubscribe();

    if (this.liveTempInterval) clearInterval(this.liveTempInterval);
    if (this.monitorInterval) clearInterval(this.monitorInterval);

    this.ngZone.runOutsideAngular(() => {
      if (this.rootTemp) this.rootTemp.dispose();
      if (this.rootHum) this.rootHum.dispose();
    });
  }

  // =========================
  // ACTIONS / API VIA SERVICE
  // =========================
  async updateLiveTemp() {
    const res = await this.iotService.fetchLiveTemp();
    if (res.value !== null) {
      this.liveTempValue = res.value;
      this.lastApiUpdate = new Date().toLocaleTimeString();
      this.cdr.detectChanges();

      if (this.seriesLiveTemp) {
        this.ngZone.runOutsideAngular(() => {
          const roundedValue = Math.round(res.value! * 10) / 10;
          this.seriesLiveTemp.data.push({ date: new Date().getTime(), value1: roundedValue });
        });
      }
    }
  }

  async updateMonitoringStatus() {
    const res = await this.iotService.getMonitoringStatus();
    this.monitorActive = res.active;
    this.cdr.detectChanges();
  }

  async setMonitoring(state: boolean) {
    await this.iotService.setMonitoring(state);
  }

  async buzzer(state: boolean) {
    await this.iotService.buzzer(state);
  }

  // =========================
  // CHARTS INITIALIZATION
  // =========================
  private initCharts() {
    // Temperaturas Chart
    this.rootTemp = am5.Root.new("chartdivTemp");
    this.rootTemp.setThemes([am5themes_Animated.new(this.rootTemp)]);
    const chartTemp = this.rootTemp.container.children.push(am5xy.XYChart.new(this.rootTemp, {
      panX: true, panY: true, wheelX: "panX", wheelY: "zoomX", pinchZoomX: true
    }));

    const xAxisTemp = chartTemp.xAxes.push(am5xy.DateAxis.new(this.rootTemp, {
      maxDeviation: 0.2,
      baseInterval: { timeUnit: "second", count: 1 },
      renderer: am5xy.AxisRendererX.new(this.rootTemp, {}),
      tooltip: am5.Tooltip.new(this.rootTemp, {})
    }));
    const yAxisTemp = chartTemp.yAxes.push(am5xy.ValueAxis.new(this.rootTemp, {
      renderer: am5xy.AxisRendererY.new(this.rootTemp, {})
    }));

    this.seriesLiveTemp = chartTemp.series.push(am5xy.LineSeries.new(this.rootTemp, {
      name: "Paciente", xAxis: xAxisTemp, yAxis: yAxisTemp, valueYField: "value1", valueXField: "date",
      stroke: am5.color(0xef4444),
      fill: am5.color(0xef4444),
      tooltip: am5.Tooltip.new(this.rootTemp, { labelText: "{valueY}°C" })
    }));
    this.seriesLiveTemp.strokes.template.setAll({ strokeWidth: 3, stroke: am5.color(0xef4444) });

    this.seriesAmbTemp = chartTemp.series.push(am5xy.LineSeries.new(this.rootTemp, {
      name: "Temp Amb", xAxis: xAxisTemp, yAxis: yAxisTemp, valueYField: "value2", valueXField: "date",
      stroke: am5.color(0x10b981),
      fill: am5.color(0x10b981),
      tooltip: am5.Tooltip.new(this.rootTemp, { labelText: "{valueY}°C" })
    }));
    this.seriesAmbTemp.strokes.template.setAll({ strokeWidth: 3, stroke: am5.color(0x10b981) });

    const legendTemp = chartTemp.children.push(am5.Legend.new(this.rootTemp, { centerX: am5.p50, x: am5.p50 }));
    legendTemp.data.setAll(chartTemp.series.values);
    chartTemp.set("cursor", am5xy.XYCursor.new(this.rootTemp, { behavior: "none" }));

    // Humedad Chart
    this.rootHum = am5.Root.new("chartdivHum");
    this.rootHum.setThemes([am5themes_Animated.new(this.rootHum)]);
    const chartHum = this.rootHum.container.children.push(am5xy.XYChart.new(this.rootHum, {
      panX: true, panY: true, wheelX: "panX", wheelY: "zoomX", pinchZoomX: true
    }));

    const xAxisHum = chartHum.xAxes.push(am5xy.DateAxis.new(this.rootHum, {
      maxDeviation: 0.2,
      baseInterval: { timeUnit: "second", count: 1 },
      renderer: am5xy.AxisRendererX.new(this.rootHum, {}),
      tooltip: am5.Tooltip.new(this.rootHum, {})
    }));
    const yAxisHum = chartHum.yAxes.push(am5xy.ValueAxis.new(this.rootHum, {
      renderer: am5xy.AxisRendererY.new(this.rootHum, {})
    }));

    this.seriesHum = chartHum.series.push(am5xy.LineSeries.new(this.rootHum, {
      name: "Humedad", xAxis: xAxisHum, yAxis: yAxisHum, valueYField: "value", valueXField: "date",
      tooltip: am5.Tooltip.new(this.rootHum, { labelText: "{valueY}%" })
    }));
    this.seriesHum.strokes.template.setAll({ strokeWidth: 2, stroke: am5.color(0x14b8a6) });

    const legendHum = chartHum.children.push(am5.Legend.new(this.rootHum, { centerX: am5.p50, x: am5.p50 }));
    legendHum.data.setAll(chartHum.series.values);
    chartHum.set("cursor", am5xy.XYCursor.new(this.rootHum, { behavior: "none" }));
  }

  // =========================
  // CANVAS / THERMAL
  // =========================
  private toRGB(t: number): number[] {
    const [r, g, b] = COLORSCALES[this.currentColorscale](Math.min(1, Math.max(0, t)));
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private drawThermal(frame: number[]) {
    if (!this.thermalCanvasRef) return;
    const canvas = this.thermalCanvasRef.nativeElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const imgData = this.octx.createImageData(W_SENS, H_SENS);
    for (let i = 0; i < frame.length; i++) {
      const t = (frame[i] - TMIN) / (TMAX - TMIN);
      const [r, g, b] = this.toRGB(t);
      imgData.data[i * 4] = r;
      imgData.data[i * 4 + 1] = g;
      imgData.data[i * 4 + 2] = b;
      imgData.data[i * 4 + 3] = 255;
    }
    this.octx.putImageData(imgData, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.offscreen, 0, 0, canvas.width, canvas.height);
  }

  private drawColorbar() {
    if (!this.colorbarCanvasRef) return;
    const cbCanvas = this.colorbarCanvasRef.nativeElement;
    const cbCtx = cbCanvas.getContext("2d");
    if (!cbCtx) return;

    const h = cbCanvas.height;
    const imgData = cbCtx.createImageData(cbCanvas.width, h);
    for (let y = 0; y < h; y++) {
      const t = 1 - y / h;
      const [r, g, b] = this.toRGB(t);
      for (let x = 0; x < cbCanvas.width; x++) {
        const idx = (y * cbCanvas.width + x) * 4;
        imgData.data[idx] = r;
        imgData.data[idx + 1] = g;
        imgData.data[idx + 2] = b;
        imgData.data[idx + 3] = 255;
      }
    }
    cbCtx.putImageData(imgData, 0, 0);
  }

  changeColorscale(event: any) {
    this.currentColorscale = event.target.value;
    this.ngZone.runOutsideAngular(() => {
      this.drawColorbar();
    });
  }

  private updateFPS() {
    const now = performance.now();
    const elapsed = (now - this.fpsLastTime) / 1000;
    if (elapsed >= 1) {
      this.fpsDisplay = (this.fpsFrames / elapsed).toFixed(1);
      this.fpsFrames = 0;
      this.fpsLastTime = now;
    }
  }
}
