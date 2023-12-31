import { Component } from '@angular/core';

@Component({
  selector: 'app-voter',
  standalone: true,
  imports: [],
  templateUrl: './voter.component.html',
  styleUrl: './voter.component.scss'
})
export class VoterComponent {
  isElectionStarted: boolean = false;
}
