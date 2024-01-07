import { Routes } from '@angular/router';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { VoterComponent } from './components/voter/voter.component';
import { CommissionerComponent } from './components/commissioner/commissioner.component';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
    { path: '', component: LoginSignupComponent },
    { path: 'voter', component: VoterComponent, canActivate: [AuthService]},
    { path: 'commission', component: CommissionerComponent, canActivate: [AuthService]}
];
