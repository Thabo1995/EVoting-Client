import { Component, OnInit } from '@angular/core';
import { VoteService } from 'src/app/_services/vote.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  registrationOpen = Date.now().toLocaleString()
  registrationClose = Date.now().toLocaleString()
  votingStart = Date.now().toLocaleString()
  votingResult = Date.now().toLocaleString()
  title = ''
  constructor(
    private votingService: VoteService,
  ) { }

  ngOnInit(): void {
    console.log(this.registrationOpen, this.registrationClose)
    this.getVotingEvent()
  }

  getVotingEvent():void{
    this.votingService.VotingEvent().subscribe(res => {
      let result = res[0]
      this.registrationOpen = new Date(result.date_of_event_registration).toDateString()
      this.registrationClose = new Date(result.closing_date_of_event_registration).toDateString()
      this.votingStart = new Date(result.date_of_event).toDateString()
      this.votingResult = new Date(result.date_of_event).toDateString()
      this.title = res[0].title
      
      if(res[0]){
        localStorage.setItem('event',JSON.stringify(res[0]))
      }
    })

  }

}
