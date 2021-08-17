import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VoteService } from 'src/app/_services/vote.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  registered = false
  event = null
  userId = ''
  username = ''
  message = ''
  registeredID = null
  selectedParty = null
  selectedPartyId = null
  parties = [
    {
        id: 1,
        name: "African National Congres",
        short_name: "ANC",
        logo: ''
    },
  ]
  constructor(
    private votingService: VoteService,
    private router: Router,
    private toastr: ToastrService
  ) {
    if( localStorage.getItem('user')){
      this.username = JSON.parse(localStorage.getItem('user')).username;
      this.userId = JSON.parse(localStorage.getItem('user')).pk;
      console.log(this.userId)
    }

    this.registered = this.checkRegistration()
    this.getParties()
    this.getVotingEvent()
    this.getRegisteredVoter()

    if(this.registered === false){
      this.message = 'You are not registered to vote.'
      
    }
    
   }

  ngOnInit(): void {

    
  }


  checkRegistration(): boolean{
    console.log(this.userId)
    let condition = false
    this.votingService.checkVoteRegistration(this.username)
    .subscribe(res => {
      if(res.username_exist === true && res.registered_to_vote === true ){
        this.registered = true
        condition = true;
      }
    })
    
    return condition
  }


  getParties(): void{
    this.votingService.party()
    .subscribe(res => {
      this.parties = res
      console.log(this.parties)
    })
  }


  getVotingEvent(){
    if(localStorage.getItem('event')){
      this.event = JSON.parse(localStorage.getItem('event')).id
    }
  }

  
  getRegisteredVoter():void {
    this.votingService.registeredVoter().subscribe(res => {
        if(res[0].voting_event === this.event){
          this.registeredID = res[0].id
          console.log(this.registeredID)
        }
    })
  }


  vote(): void {
    let voteObject = {
      voting_event: this.event,
      voter: this.registeredID,
      party: this.selectedPartyId
    }
    this.votingService.vote(voteObject).subscribe(res => {
      if(res.voting_event === this.event){
        console.log(this.registeredID)
        localStorage.setItem('vote',this.event)
        this.toastr.success('You have successfully voted for ' + this.selectedParty,'Vote Success')
      }

      else {
        if(localStorage.getItem('vote')){
          if(localStorage.getItem('vote') === this.event){
            this.toastr.error('You can not Vote Twice','Voting Error')
          }
        }
        else{
          this.toastr.error('Something on our side is not right','Oops, Sorry!!')
        }
        
      }
      
    })
  }

  confirmParty(party:string,partyId:number):void {
    this.selectedParty = party
    this.selectedPartyId = partyId
  }

}
