import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ViewChild, ElementRef} from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = "";
  isLoggedIn = false;
  isCarOwner = false;
  submittedR = false;
  state = '';
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private metaTagService: Meta,
    private  title: Title,
    private toastr: ToastrService,
    
  ) { 

    this.form = this.formBuilder.group({
      idNumber: ['', [ Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      password: ['', [ Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }


  onSubmit(): void {

    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    // use the rest service here.
    const auth = {
      username: this.f.idNumber.value.toString(),
      password: this.f.password.value
    };
    
    console.log(auth)
    this.authService.login(auth)
    .subscribe(res => {
      localStorage.setItem('token', res.key);

      if (res.status === 400 ){
        this.toastr.error('Something went wrong, cant use credentials','0ops');
      }

      this.isLoggedIn = this.authService.isLoggedIn
      if (this.isLoggedIn === true){
        this.toastr.success('welcome back','login successful')
        this.getUser()
        return this.router.navigate(['vote'])
       
      }

      if (this.isLoggedIn === false){
        this.toastr.error('Attempt failed,Check credentials','login failed')
      }
      
    }, err => {
      this.toastr.error('Something went wrong be patient with us','Oops')
      this.loading = false;
    });
  }

  getUser(): void {
    this.authService.user().subscribe(
      data => {
        localStorage.setItem('user',JSON.stringify(data))
      });
  }

  logout(): void {
    // Clear all stored user info from device.
    localStorage.clear()
    sessionStorage.clear()
    this.isLoggedIn = false
    this.authService.isLoggedIn = false
    this.toastr.success('You are successfully logged out','Great')
    this.router.navigate([''])
  }

}
