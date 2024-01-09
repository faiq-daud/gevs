import { Component } from '@angular/core';
import { BaseApiService } from '../../services/base-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-voter',
  standalone: true,
  imports: [NgxLoadingModule],
  templateUrl: './voter.component.html',
  styleUrl: './voter.component.scss'
})
export class VoterComponent {
  isElectionStarted: boolean = false;
  currentConstituency:any = {};
  candidates:any=[];
  hideVoteBtn: boolean = false;
  loading: boolean = false;
  lastElectionResult: any | undefined;

  constructor(private apiService: BaseApiService, private toastr: ToastrService, private router: Router) {}
  
  ngOnInit(): void {
    this.loading = true;
    const token:any = sessionStorage.getItem('token');

    this.apiService.get('api/v1/elections/started_election', token).subscribe({
      next: (data) => {
        this.isElectionStarted = data.status === "started" ? true : false;
        if (this.isElectionStarted) {
          this.getCurrentUserDetails(token);
        } else  if(data?.last_election) {
          this.lastElectionResult = data.last_election;          
          this.loading = false;
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    })
  }
  
  getCurrentUserDetails(token: string): void {
    this.apiService.get('api/v1/current_user_details', token).subscribe(
      {
        next: (data: any) => {
            this.currentConstituency = data?.profile?.constituency;
            this.hideVoteBtn = data?.profile?.vote_casted;
            this.candidates = this.currentConstituency?.candidates;
            this.loading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to get records');
        },
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

  castVote(candidateId: string): void {
    const token:any = sessionStorage.getItem('token');
    this.apiService.patch(`api/v1/cast_vote/${candidateId}`,{}, token).subscribe({
      next: (data) => {
        this.hideVoteBtn = data?.profile?.vote_casted;
        this.toastr.success('Vote casted successfully');
      },
      error: (err) => {
        this.toastr.error('Failed to cast vote');
      }
    });
  }
}
