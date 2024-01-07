import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { BaseApiService } from '../../services/base-api.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [NgxScannerQrcodeModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent {

  showLoginForm: boolean = true;
  scanQR: boolean = false;
  scannedValue: string = '';
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  constituencies: any = [];

  public config: ScannerQRCodeConfig = {
    constraints: { 
      video: {
        width: window.innerWidth
      }
    } 
  };
  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  loginForm: FormGroup;
  registrationForm: FormGroup;
  subscription: any;
  
  constructor(private router: Router, private auth: AuthService, private qrcode: NgxScannerQrcodeService, private fb: FormBuilder, private apiService: BaseApiService, private toastrService: ToastrService) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      constituency: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      uvcCode: [{ value: '', disabled: false }, Validators.required]
    });
  }

  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      // Check if the user is at least 18 years old
      if (age < 18) {
        return { ageUnder18: true };
      }
    }
      return null;
  }

  ngOnInit(): void {
    const role = sessionStorage.getItem('role');
    if(role) {
      this.auth.isCurrentUserLoggedIn = true;
      if(role === 'voter') {
        this.auth.currentUserRole = 'voter';
        this.router.navigate(['voter']);
      } else if(role === 'election_officer') {
        this.auth.currentUserRole = 'election_officer';
        this.router.navigate(['commission']);
      }
    }
    this.apiService.get('api/v1/constituencies').subscribe(data => {
      this.constituencies = data;
    })
  }

  public onSelects(files: any) {
    this.qrcode.loadFilesToScan(files, this.config).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      this.scanQR = true;
      this.subscription = action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      this.subscription = action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    if(e?.length) {
      console.log(e[0].value);
      this.registrationForm.get('uvcCode')?.setValue(e[0].value);
    }
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onLogin(): void {
    // Check if the form is valid before submitting
    if (this.loginForm.valid) {
      const payload = {
        grant_type:'password',
        client_id: this.apiService.getClientId(),
        client_secret: this.apiService.getClientSecret(),
        ...this.loginForm.value
      }
      this.apiService.post('oauth/token',payload).subscribe({
        next: (data) => {
            this.toastrService.success('Logged In Successfully');
            this.auth.isCurrentUserLoggedIn = true;
            this.auth.currentUserRole = data?.role;
            sessionStorage.setItem('role', data.role);
            sessionStorage.setItem('token', data.access_token);
            if(data?.role === 'voter') {
              this.router.navigate(['voter']);
            } else if(data?.role === 'election_officer') {
              this.router.navigate(['commission']);
            }
            
        },
        error: (e) => this.toastrService.error('Failed to login. Please try again!')
       });
    }
  }

  registerVoter(): void {
    // Check if the form is valid before submitting
    if (this.registrationForm.valid) {
      const payload = {
        client_id: this.apiService.getClientId(),
        user: {
          email: this.registrationForm.value?.email,
          password: this.registrationForm.value?.password,
          password_confirmation: this.registrationForm.value?.password,
          role: 'voter'
        },
        profile: {
          full_name: this.registrationForm.value?.email,
          constituency_id: this.registrationForm.value?.constituency,
          dob: this.registrationForm.value?.dateOfBirth,
          uvc: this.registrationForm.value?.uvcCode
        }
      }
      this.apiService.post('api/v1/users',payload).subscribe({
          next: (v) => {
          this.toastrService.success('Voter registered successfully');
          this.showLoginForm = true;
        },
        error: (e) => this.toastrService.error('Failed to register voter. Please try again!')
       });
      }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }
}
