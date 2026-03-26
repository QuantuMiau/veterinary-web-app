import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/// recordar cambiar a la nueba de ngrok
const API = 'https://0ed5-2806-268-9402-538-b828-b182-cfe7-fdfa.ngrok-free.app';
const WS_URL = 'wss://0ed5-2806-268-9402-538-b828-b182-cfe7-fdfa.ngrok-free.app/thermal';

const W_SENS = 32;
const H_SENS = 24;

@Injectable({
  providedIn: 'root'
})
export class IotService {
  private ws: WebSocket | null = null;
  private wsReconnectTimer: any = null;

  public wsConnected$ = new BehaviorSubject<boolean>(false);
  public thermalFrame$ = new Subject<number[]>();
  public dhtData$ = new Subject<{ temperature: number | null, humidity: number | null }>();

  constructor(private ngZone: NgZone) { }


  private customFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...options.headers,
      'ngrok-skip-browser-warning': '69420'
    };
    return fetch(url, { ...options, headers });
  }


  async fetchLiveTemp(): Promise<{ value: number | null }> {
    try {
      const r = await this.customFetch(`${API}/temperature/live`);
      return await r.json();
    } catch (e) {
      console.error('Error fetching live temp:', e);
      return { value: null };
    }
  }

  async getMonitoringStatus(): Promise<{ active: boolean }> {
    try {
      const r = await this.customFetch(`${API}/monitoring/status`);
      return await r.json();
    } catch (e) {
      console.error('Error fetching monitoring status:', e);
      return { active: false };
    }
  }

  async setMonitoring(state: boolean): Promise<void> {
    try {
      await this.customFetch(`${API}${state ? '/monitoring/on' : '/monitoring/off'}`, { method: 'POST' });
    } catch (e) {
      console.error('Error setting monitoring:', e);
    }
  }

  async buzzer(state: boolean): Promise<void> {
    try {
      await this.customFetch(`${API}${state ? '/buzzer/on' : '/buzzer/off'}`, { method: 'POST' });
    } catch (e) {
      console.error('Error triggering buzzer:', e);
    }
  }


  public connectWS(): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(WS_URL);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      this.wsConnected$.next(true);
      if (this.wsReconnectTimer) {
        clearTimeout(this.wsReconnectTimer);
        this.wsReconnectTimer = null;
      }
    };

    this.ws.onmessage = (msg) => {
      // datos en binario del mapa termico
      if (msg.data instanceof ArrayBuffer) {
        const floats = new Float32Array(msg.data);
        const clean = this.fixBadPixels(Array.from(floats));
        this.thermalFrame$.next(clean);
        return;
      }

      // json para el sensor dth11
      let data;
      try {
        data = JSON.parse(msg.data);
      } catch (e) {
        return;
      }

      if (data.type === 'dht11') {
        this.dhtData$.next({
          temperature: data.temperature !== undefined ? data.temperature : null,
          humidity: data.humidity !== undefined ? data.humidity : null
        });
      }
    };

    this.ws.onclose = () => {
      this.wsConnected$.next(false);
      this.wsReconnectTimer = setTimeout(() => this.connectWS(), 4000);
    };

    this.ws.onerror = (err) => {
      if (this.ws) this.ws.close();
    };
  }

  public disconnectWS(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.wsReconnectTimer) {
      clearTimeout(this.wsReconnectTimer);
      this.wsReconnectTimer = null;
    }
  }

  private fixBadPixels(frame: number[]): number[] {
    const fixed = [...frame];
    const avg = fixed.reduce((a, b) => a + b) / fixed.length;
    for (let i = 0; i < fixed.length; i++) {
      if (avg - fixed[i] > 10) {
        const x = i % W_SENS;
        const y = Math.floor(i / W_SENS);
        const neighbors = [];
        if (x > 0) neighbors.push(fixed[i - 1]);
        if (x < W_SENS - 1) neighbors.push(fixed[i + 1]);
        if (y > 0) neighbors.push(fixed[i - W_SENS]);
        if (y < H_SENS - 1) neighbors.push(fixed[i + W_SENS]);
        if (neighbors.length > 0) {
          fixed[i] = neighbors.reduce((a, b) => a + b) / neighbors.length;
        }
      }
    }
    return fixed;
  }
}
