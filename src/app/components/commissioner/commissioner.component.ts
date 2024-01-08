import { Component } from '@angular/core';
import { NgChartsModule} from 'ng2-charts';
import {ChartOptions} from 'chart.js';
import { BaseApiService } from '../../services/base-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commissioner',
  standalone: true,
  imports: [NgChartsModule, NgxLoadingModule, FormsModule],
  templateUrl: './commissioner.component.html',
  styleUrl: './commissioner.component.scss'
})
export class CommissionerComponent {
 // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels: any = [];
  public pieChartDatasets: any = [ {
    data: []
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public isElectionStarted: boolean = false;
  electionMetadata: any;
  loading: boolean = false;
  constituencies: any;
  selectedConstituencyId: string = '';
  constructor(private apiService: BaseApiService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    const token:any = sessionStorage.getItem('token');
    this.loading = true;
    this.apiService.get('api/v1/elections/started_election', token).subscribe({
      next: (data) => {
        this.electionMetadata = data;
        this.isElectionStarted = data.status === "started" ? true : false;
        this.loading = false;
      }
    })
    this.apiService.get('api/v1/constituencies').subscribe(data => {
      this.constituencies = data;
    })
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  
  startElection(): void {
    const token:any = sessionStorage.getItem('token');
    this.apiService.post('api/v1/elections/start_election', {}, token).subscribe({
      next: (res) => {
      this.isElectionStarted = true;
      this.electionMetadata = res;
      this.toastr.success('Election started successfully');
    },
    error: () => {
      this.toastr.error('Election to start elections');
    }
  })
  }

  getConstituencyDetail(): void {
    console.log(this.selectedConstituencyId);
    this.loading = true;
    const token:any = sessionStorage.getItem('token');
    this.apiService.get(`api/v1/constituencies/${this.selectedConstituencyId}`, token).subscribe({
      next: (res) => {
        res?.candidates?.forEach((candidate: any) => {
            this.pieChartLabels.push(candidate.name);
            this.pieChartDatasets?.data?.push(candidate.vote_count);
        });
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to get constitunecy client details');
      }
    })
  }
}