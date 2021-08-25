import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ViewChild, ElementRef} from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { VoteService } from 'src/app/_services/vote.service';

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

  state : any;
  information = true;
  verify = false
  finish = false
  userId = null
  event: any;

  constructor(
    private authService: AuthService,
    private votingService:VoteService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private metaTagService: Meta,
    private  title: Title,
    private toastr: ToastrService,
) {
  this.form = this.formBuilder.group({
    idNumber : ['', [ Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    email: ['', [ Validators.required, Validators.email]],
    password: ['', [ Validators.required]],
    password2: ['', [ Validators.required]]
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

    if (this.f.password.value != this.f.password2.value){
      this.f.password2.setErrors({doesNotMatch:true})
      return;
    }

    // check if username exists
    this.authService.usernameExist(this.f.idNumber.value).subscribe(res => {
      if(res.username_is_taken === true){
        this.f.idNumber.setErrors({usernameExist:true})
        console.log("yes")
        return;
      }
    })
  
    
    if(this.verify === false && this.information === true){
      this.verify = true
      this.information = false
      return;
    }

    if(this.verify === true && this.information === false){
      this.verify = false
      this.finish = true
      
      return;
    }

    this.loading = true;
    console.log('gfdhghfgdhfgh')
    // use the rest service here.
    const auth = {
      username: this.f.idNumber.value,
      email: this.f.email.value,
      password1: this.f.password.value,
      password2: this.f.password2.value,
    };

    

    this.authService.register(auth)
    .subscribe(res => {
      localStorage.setItem('token', res.key);

      if (res.status === 400 ){
        this.toastr.error('Oops', 'Something went wrong, cant use credentials');
      }

      this.isLoggedIn = this.authService.isLoggedIn
      if (this.isLoggedIn === true){
        this.getUser()
        this.toastr.success('welcome to our platform','account registration successful')
        this.registerToVote()
        return this.router.navigate(['vote'])

      }

      if (this.isLoggedIn === false){
        console.log(res.values())
        if(res.error){
          this.toastr.error('Attempt failed,please try again. thanks','login failed')
        }
        
      }
      console.log(res);
    }, err => {
      console.log(err);
      console.log("gdgdgdg");
      this.toastr.error('Something went wrong during registration, its our fault', 'Oops');
      this.loading = false;
    });
  }

  getUser(): void {
    this.authService.user().subscribe(
      data => {
        localStorage.setItem('user',JSON.stringify(data))
        this.userId = data.pk
      });
  }

  registerToVote(): void {
    let registerData = {
      "voting_event": this.event,
      "string": "nvjnvjnfvnjf",
      "user": this.userId
    }
    this.votingService.registerVoting(registerData).subscribe(
      data => {
        if(data.user === this.userId){
          console.log('in')
        }
        else {
          this.toastr.error('something went wrong while confirming','oops')
        }
      });
  }

  getVotingEvent(){
    if(localStorage.getItem('event')){
      this.event = JSON.parse(localStorage.getItem('event')).id
    }
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
