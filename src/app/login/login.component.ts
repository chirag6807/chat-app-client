import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as jwt_decode from 'jwt-decode';

import { CoronavirusService } from "../coronavirus.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  isSubmitted = false;
  constructor(private router: Router, private formBuilder: FormBuilder, public coronavirusService: CoronavirusService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get formControls() { return this.authForm.controls; }

  gotoList() {
    this.router.navigate(['/chat']);
  }

  signIn() {
    this.isSubmitted = true;
    if (this.authForm.invalid) {
      return;
    }
    this.coronavirusService.login(this.authForm.value)
      .subscribe(
        data => {
          debugger;
          // console.log(data);
          localStorage.setItem('token', data["jwtoken"]);
          localStorage.setItem('userId', data["userId"]);
          localStorage.setItem('userName', data["userName"])
          this.coronavirusService.addToCart(true);
          this.gotoList();
        },
        error => {
          console.log(error.error)
          this.toastr.error(error.error.error, ' Login Failed');
        }
      );
  }


}
