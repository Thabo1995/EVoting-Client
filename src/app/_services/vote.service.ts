import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = 'http://localhost:8000/api';
const apiv2 = 'http://localhost:8000/api/v2';


@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(
    private http: HttpClient,
  ) { }


  party(): Observable<any> {
      return this.http.get(apiUrl + '/parties/', httpOptions).pipe(
        tap(_ => console.log('fetch parties'))
      );
  }

  candidate(): Observable<any> {
    return this.http.get(`${apiUrl}`, httpOptions).pipe(
      tap(_ => console.log('fetch candidate'))
    );
  }

  
  registerVoting(registerData: object): Observable<any>{
    return this.http.post(apiUrl + '/voting/register', registerData, httpOptions).pipe(
      tap(_ => console.log('registered to vote'))
    );
  }


  registeredVoter(): Observable<any>{
    return this.http.get(apiUrl + '/voting/register/', httpOptions).pipe(
      tap(_ => console.log('registered to vote'))
    );
  }

  vote(votingData: object): Observable<any>{
    return this.http.post(apiUrl + '/voting/vote/', votingData, httpOptions).pipe(
      tap(_ => console.log('voted')),
      catchError(this.handleError('vote', []))
    );
  }

  VotingEvent(): Observable<any>{
    return this.http.get(apiUrl + '/voting/event/',httpOptions).pipe(
      tap(_ => console.log('voted'))
    );
  }

  checkVoteRegistration(username:string): Observable<any> {
    return this.http.get(apiUrl + '/check-status/'+ username + '/',httpOptions).pipe(
      tap(_ => console.log('>>')),
      catchError(this.handleError('register', []))
    );
  }

  votingResults(): Observable<any> {
    return this.http.get(apiUrl + '/voting-results/',httpOptions).pipe(
      tap(_ => console.log('>>')),
      catchError(this.handleError('register', []))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }



}
