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
  isElectionStarted: boolean = true;
  currentConstituency:any = {};
  candidates:any=[];
  hideVoteBtn: boolean = false;
  loading: boolean = false;

  constructor(private apiService: BaseApiService, private toastr: ToastrService, private router: Router) {}
  
  ngOnInit(): void {
    this.loading = true;
    const token:any = sessionStorage.getItem('token');
    this.apiService.getWithToken('api/v1/current_user_details', token).subscribe(
      {
        next: (data: any) => {
            this.currentConstituency = data?.profile?.constituency;
            this.hideVoteBtn = data?.profile?.vote_casted;
            console.log(this.currentConstituency);
            this.candidates = this.currentConstituency?.candidates;
            this.loading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to get records');
        },
      })
  }
  
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  castVote(candidateId: string): void {
    console.log('add vote');
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
