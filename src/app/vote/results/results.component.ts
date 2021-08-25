import { Component, OnInit } from '@angular/core';
import { VoteService } from 'src/app/_services/vote.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  registered = false
  event = null
  userId = ''
  username = ''
  message = ''
  results = [
    {
      "name": "",
      "short_name": "",
      "logo": "",
      "vote__voting_event": 2,
      "number_of_votes": 1,
      "vote_percentage": 50.0
  },
  ]
  
  constructor(
    private votingService: VoteService
  ) { }

  ngOnInit(): void {
    this.getResults()
  }


  getVotingEvent(){
    if(localStorage.getItem('event')){
      this.event = JSON.parse(localStorage.getItem('event')).date_of_event
    }
  }

  getResults(){
    this.votingService.votingResults().subscribe(res => {
      this.results = res
    })
  }

}
