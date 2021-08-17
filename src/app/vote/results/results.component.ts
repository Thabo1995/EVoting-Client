import { Component, OnInit } from '@angular/core';

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
  
  constructor() { }

  ngOnInit(): void {

  }


  getVotingEvent(){
    if(localStorage.getItem('event')){
      this.event = JSON.parse(localStorage.getItem('event')).date_of_event
    }
  }

}
