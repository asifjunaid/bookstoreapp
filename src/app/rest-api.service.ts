import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map,catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RestApiService<T> {
  public baseUrl:string= 'http://localhost:4200/api';
  errorMessage:string = "Error occured during calling backend service.";
  constructor(private http: HttpClient) {
  }
  get(url: string): Observable<T[]>{
    return this.http.get<T[]>(this.baseUrl + url).pipe(
      map(data => data),
      catchError(err => {          
          throw new Error(this.errorMessage);
      })
  );
  }
  getById(url: string ): Observable<T> {
    return this.http.get<T>(this.baseUrl + url).pipe(
      map(data => data),
      catchError(err => {          
          throw new Error(this.errorMessage);
      })
  );
  }
  delete<U>(url: string ): Observable<U> {
   
    return this.http.delete<U>(this.baseUrl + url).pipe(
      map(data => data),
      catchError(err => {          
          throw new Error(this.errorMessage);
      })
  );
  }
  save<U>(url: string, formData: FormData): Observable<U> {
    
    return this.http.post<U>(this.baseUrl + url,formData,{ }).pipe(
      map(data => data),
      catchError(err => {          
          throw new Error(this.errorMessage);
      })
  );
  }
  update<U>(url: string, formData: FormData): Observable<U> {    
    
    return this.http.patch<U>(this.baseUrl + url,formData,{}).pipe(
      map(data => data),
      catchError(err => {          
          console.log(err);
          throw new Error(this.errorMessage);
      })
  );
  }

}
