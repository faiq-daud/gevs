import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [NgxScannerQrcodeModule, CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent {

  showLoginForm: boolean = true;
  scanQR: boolean = false;
  scannedValue: string = '';
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];

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
  
  constructor(private qrcode: NgxScannerQrcodeService, private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: [''],
      constituency: ['', Validators.required],
      password: ['', Validators.required],
      uvcCode: [{ value: '', disabled: this.scanQR }]  // You can enable/disable based on 'scanQR' property
    });
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
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
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


  onSubmit(): void {
    // Check if the form is valid before submitting
    if (this.loginForm.valid) {
      // Perform your login logic here
      console.log('Form submitted!', this.loginForm.value);
    }
  }

  registerVoter(): void {
    // Check if the form is valid before submitting
    if (this.registrationForm.valid) {
      // Perform your login logic here
      console.log('Form submitted!', this.registrationForm.value);
    }
  }

}
