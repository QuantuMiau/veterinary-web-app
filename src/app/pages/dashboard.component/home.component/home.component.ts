import { AfterViewInit, Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private roots: am5.Root[] = [];

  isLoading = true;
  stats: DashboardStats | null = null;

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // We wait for data to load before creating charts
  }

  ngOnDestroy(): void {
    this.roots.forEach(root => root.dispose());
  }

  loadStats() {
    this.isLoading = true;
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
        this.cdr.detectChanges();
        // Give time for the DOM to render the containers
        setTimeout(() => this.createAllCharts(), 100);
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createAllCharts() {
    if (!this.stats) return;

    // Dispose existing roots if any
    this.roots.forEach(root => root.dispose());
    this.roots = [];

    this.createSpeciesChart(this.stats.species);
    this.createVentasChart(this.stats.monthlySales, this.stats.sourceSales);
    this.createProductosChart(this.stats.topProducts);
  }

  private createSpeciesChart(data: any[]) {
    const root = am5.Root.new("chartdiv");
    this.roots.push(root);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
      })
    );

    series.slices.template.setAll({
      strokeOpacity: 0,
      templateField: "settings"
    });

    series.data.setAll(data);
    series.appear(1000, 100);
  }

  private createVentasChart(monthlyData: any[], sourceData: any[]) {
    const root = am5.Root.new("chartVentas");
    this.roots.push(root);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      })
    );

    // Outer Series (Monthly)
    const outerSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(100),
        innerRadius: am5.percent(70)
      })
    );

    outerSeries.data.setAll(monthlyData);

    // Inner Series (Source)
    const innerSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        radius: am5.percent(65),
        innerRadius: am5.percent(40)
      })
    );

    innerSeries.data.setAll(sourceData);
    
    chart.appear(1000, 100);
  }

  private createProductosChart(data: any[]) {
    const root = am5.Root.new("chartProductos");
    this.roots.push(root);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
      })
    );

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "product",
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    const series = chart.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: "Precios",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "close",
        openValueYField: "open",
        lowValueYField: "low",
        highValueYField: "high",
        categoryXField: "product",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Costo: {openValueY}\nPrecio: {valueY}"
        })
      })
    );

    series.data.setAll(data);
    series.appear(1000, 100);
    chart.appear(1000, 100);
  }
}