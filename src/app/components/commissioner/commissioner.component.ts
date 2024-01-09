import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartOptions} from 'chart.js';
import { BaseApiService } from '../../services/base-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commissioner',
  standalone: true,
  imports: [NgChartsModule, NgxLoadingModule, FormsModule, CommonModule],
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
  currentElectionId: string = '';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  elections:any;
  constructor(private apiService: BaseApiService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    const token:any = sessionStorage.getItem('token');
    this.loading = true;
    this.apiService.get('api/v1/elections/started_election', token).subscribe({
      next: (data) => {
        this.electionMetadata = data;
        this.currentElectionId = data.id;
        this.isElectionStarted = data.status === "started" ? true : false;
        this.loading = false;
      }
    })

    this.apiService.get('api/v1/constituencies').subscribe(data => {
      this.constituencies = data;
    });
    
    this.getAllElections();
  }

  getAllElections():void {
    const token:any = sessionStorage.getItem('token');
    this.apiService.get('/api/v1/elections', token).subscribe(data => {
      this.elections = data;
    })
  }

  logout(): void {
    const token:any = sessionStorage.getItem('token');
    const payload = {
      client_id: this.apiService.getClientId(),
      client_secret: this.apiService.getClientSecret(),
    }
    this.apiService.post('oauth/revoke', payload, token).subscribe({
      next: (val) => {
        this.toastr.success('Logout was successfull');
        sessionStorage.clear();
        this.router.navigate(['']);
      }
    })
  }
  
  startElection(): void {
    const token:any = sessionStorage.getItem('token');
    this.apiService.post('api/v1/elections/start_election', {}, token).subscribe({
      next: (res) => {
      this.isElectionStarted = true;
      this.electionMetadata = res;
      this.currentElectionId = res?.election?.id;
      this.toastr.success('Election started successfully');
    },
    error: (err) => {
      this.toastr.error('Election to start elections');
    }
  })
  }

  getConstituencyDetail(): void {
    this.loading = true;
    this.pieChartLabels = [];
    this.pieChartDatasets = [ {
      data: []
    } ];
    const token:any = sessionStorage.getItem('token');
    this.apiService.get(`api/v1/constituencies/${this.selectedConstituencyId}`, token).subscribe({
      next: (res) => {
        res?.candidates?.forEach((candidate: any) => {
            this.pieChartLabels.push(candidate.name);
            this.pieChartDatasets[0]?.data?.push(candidate.vote_count);
        });
        this.chart?.chart?.update();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to get constitunecy client details');
      }
    })
  }

  endElection() {
    const token:any = sessionStorage.getItem('token');
    this.apiService.patch(`/api/v1/elections/${this.currentElectionId}/end_election`, {} ,token).subscribe({
      next: (res) => {
        this.toastr.success('Election result announced succesfully');
        this.isElectionStarted = false;
        this.getAllElections();
      }
    })
  }
}