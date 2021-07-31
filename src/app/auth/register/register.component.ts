import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ViewChild, ElementRef} from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { ToastrService } fom 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  registerForm: FormGroup;
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
    // private toastr: ToastrService,
) {
  this.form = this.formBuilder.group({
    idNumber : ['', [ Validators.required,Validators.minLength(13),Validators.pattern('[0-9]*')]],
    email: ['', [ Validators.required, Validators.email]],
    password: ['', [ Validators.required]],
    password2: ['', [ Validators.required]]
  });
 }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }


  onRegister(): void {

    this.submittedR = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    if (this.f.password.value != this.f.password2.value){
      this.f.password2.setErrors({doesNotMatch:true})
      return;
    }

    this.loading = true;

    // use the rest service here.
    const auth = {
      username: this.f.idNumber.value,
      email: this.f.email.value,
      password1: this.f.password.value,
      password2: this.f.password2.value,
    };

    // check if username exists
    this.authService.usernameExist(auth.username).subscribe(res => {
      if(res.is_taken === true){
        this.f.username.setErrors({usernameExist:true})
        console.log(res)
      }
    })

    this.authService.register(auth)
    .subscribe(res => {
      localStorage.setItem('token', res.key);

      if (res.status === 400 ){
        // this.toastr.error('Oops', 'Something went wrong, cant use credentials');
        console.log("+++++++++++++++")
      }

      this.isLoggedIn = this.authService.isLoggedIn
      if (this.isLoggedIn === true){
        // this.getUser()
        // this.toastr.success('welcome to our platform','registration successful')
        // this.closeAddRegisterModal.nativeElement.click()

      }

      if (this.isLoggedIn === false){
        console.log('failed>>>>>>..')
        console.log(res.values())
        if(res.error){
          // this.toastr.error('Attempt failed,please try again. thanks','login failed')
        }
        
      }
      console.log(res);
    }, err => {
      console.log(err);
      console.log("gdgdgdg");
      // this.toastr.error('Something went wrong during registration, its our fault', 'Oops');
      this.loading = false;
    });
  }

}
