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

   /*createVentasChart() {
    let root = am5.Root.new("chartVentas");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {}));

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "month",
      renderer: am5xy.AxisRendererX.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Ventas",
      xAxis: xAxis,
      yAxis: yAxis,
      valueField: "value",
      categoryXField: "month"
    }));

    series.data.setAll([
      { month: "Ene", value: 10 },
      { month: "Feb", value: 15 },
      { month: "Mar", value: 8 },
      { month: "Abr", value: 20 }
    ]);
  }
*/

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
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {}));

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "product",
      renderer: am5xy.AxisRendererX.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Vendidos",
      xAxis: xAxis,
      yAxis: yAxis,
      valueField: "value",
      categoryXField: "product"
    }));

    series.data.setAll([
      { product: "Nextgard 5mg", value: 120 },
      { product: "Collar antipulgas", value: 80 },
      { product: "Vacuna triple felina", value: 60 }
    ]);
  }

}