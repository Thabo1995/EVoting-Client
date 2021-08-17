import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { VoteService } from 'src/app/_services/vote.service';

@Component({
  selector: 'app-voting-status',
  templateUrl: './voting-status.component.html',
  styleUrls: ['./voting-status.component.css']
})
export class VotingStatusComponent implements OnInit {
  message = ""
  registered = false
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = "";
  constructor(
    private votingService: VoteService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      idNumber: ['', [ Validators.required, Validators.minLength(13), Validators.maxLength(13)]]
    });
    
  }

  ngOnInit(): void {
    
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }


  onSubmit():void {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

 
    this.votingService.checkVoteRegistration(this.f.idNumber.value)
    .subscribe(res => {
      if(res.username_exist === true){
        console.log(res)
        if(res.registered_to_vote === true){
          this.message = 'This ID is registered to vote on the following election'
          this.registered = true
        }

        this.message = "This Registration is not complete"
      }
    })
  }



}
