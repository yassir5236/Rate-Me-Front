import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatisticsService } from '../services/statistics.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective; 

  statistics: { [key: string]: number } = {};

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Number of Places',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6',
        fill: true,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#e5e7eb' } },
    },
    plugins: { legend: { display: true, position: 'top' } },
  };

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.statisticsService.getStatistics().subscribe((data) => {
      console.log('Statistics:', data);
      this.statistics = data;
    });

    this.statisticsService.getPlacesGrowth().subscribe((growthData) => {
      console.log('Growth Data:', growthData);

      if (growthData && growthData.labels && growthData.data) {
        this.lineChartData.labels = growthData.labels;
        this.lineChartData.datasets[0].data = growthData.data;

        if (this.chart) {
          this.chart.update();
        }
      }
    });
  }
}
