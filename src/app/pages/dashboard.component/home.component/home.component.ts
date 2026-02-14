import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import am5index from "@amcharts/amcharts5/index";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

 /* ngOnInit(): void {
  this.createChart();
  this.createVentasChart();
  this.createProductosChart();
  }
*/
ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.createChart();
    this.createVentasChart();
    this.createProductosChart();
  }


  createChart() {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
      })
    );

    series.data.setAll([
      { category: "Gatos", value: 50 },
      { category: "Perros", value: 35 },
      { category: "Aves", value: 15 }
    ]);
  }


createVentasChart() {

  let root = am5.Root.new("chartVentas");
  //this.roots.push(root); // importante si estás usando dispose sino quitarlo

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout
    })
  );

  // 🔵 Serie externa (radio variable)
  let outerSeries = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category",
      radius: am5.percent(100),
      innerRadius: am5.percent(60)
    })
  );

  outerSeries.data.setAll([
    { category: "Enero", value: 10 },
    { category: "Febrero", value: 15 },
    { category: "Marzo", value: 8 },
    { category: "Abril", value: 20 }
  ]);

  // 🟣 Serie interna (segunda capa)
  let innerSeries = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category",
      radius: am5.percent(55),
      innerRadius: am5.percent(30)
    })
  );

  innerSeries.data.setAll([
    { category: "Online", value: 30 },
    { category: "Sucursal", value: 23 }
  ]);

}

  createProductosChart() {

  let root = am5.Root.new("chartProductos");
  //this.roots.push(root); // importante si usas dispose

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX"
    })
  );

  // EJE X (Categorías)
  let xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "product",
      renderer: am5xy.AxisRendererX.new(root, {})
    })
  );

  // EJE Y (Valores)
  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

  // 📊 Serie Candlestick
  let series = chart.series.push(
    am5xy.CandlestickSeries.new(root, {
      name: "Movimiento",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "close",
      openValueYField: "open",
      lowValueYField: "low",
      highValueYField: "high",
      categoryXField: "product"
    })
  );

  // Datos simulados
  let data = [
    { product: "Nextgard 5mg", open: 100, close: 120, low: 90, high: 130 },
    { product: "Collar antipulgas", open: 70, close: 80, low: 60, high: 95 },
    { product: "Vacuna triple felina", open: 50, close: 60, low: 45, high: 75 }
  ];

  xAxis.data.setAll(data);
  series.data.setAll(data);

}

}