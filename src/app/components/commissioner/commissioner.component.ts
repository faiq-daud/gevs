import { Component } from '@angular/core';
import { NgChartsModule} from 'ng2-charts';
import {ChartOptions} from 'chart.js';

@Component({
  selector: 'app-commissioner',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './commissioner.component.html',
  styleUrl: './commissioner.component.scss'
})
export class CommissionerComponent {
 // Pie
 public pieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
};
public pieChartLabels = [ 'Shangri-la-Town', 'Northern-Kunlun-Mountain', 'Western-Shangri-la', 'Naboo-Vallery', 'New-Felucia' ];
public pieChartDatasets = [ {
  data: [ 300, 500, 100, 200, 50]
} ];
public pieChartLegend = true;
public pieChartPlugins = [];
}