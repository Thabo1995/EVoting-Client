import { Injectable, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, concatMap } from 'rxjs/operators';
import { EMPTY, from, Observable, of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

const options = {
  observe: "response", // to display the full response
  responseType: "json",
};


const apiUrl = 'https://api.kabook.co.za/';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false;
  redirectUrl: string = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
        
  ) { }

  login(logins:object): Observable<any> {
    const url = apiUrl + 'api/auth/login/';
    return this.http.post(url, logins,httpOptions).pipe(
      tap(_ =>
        this.isLoggedIn = true
        ),
        catchError(this.handleError('login', []))
    );
  }

  register(accountInfo:object): Observable<any> {
    const url = apiUrl + 'api/auth/registration/';
    return this.http.post(url, accountInfo, httpOptions).pipe(
      tap(_ => this.isLoggedIn = true),
      catchError(this.handleError('register', []))
    );
  }


 

  
  user(): Observable<any> {
    return this.http.get(apiUrl + 'api/cars/user-details/',httpOptions).pipe(
      tap(_ => console.log('got user')),
      catchError(this.handleError('register', []))
    );
  }


  usernameExist(username:string): Observable<any> {
    return this.http.get(apiUrl + 'api/cars/validate-username/'+ username + '/',httpOptions).pipe(
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
