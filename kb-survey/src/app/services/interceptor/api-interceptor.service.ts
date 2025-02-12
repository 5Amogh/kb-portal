import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import secret from '../../../../secret.json';
import { ResponseService } from '../observable/response.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ApiInterceptorService implements HttpInterceptor {
  constructor(private responseService: ResponseService, private router:Router,
    public dialog: MatDialog){
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': secret.Authorization,
        'X-authenticated-user-token':secret['X-authenticated-user-token']
      }
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          console.error('Network error:', error.message);
        } else if (error.status >= 400 && error.status < 500) {
          console.error('Client-side error:', error.message);
        } else if (error.status >= 500) {
          console.error('Server error:', error.message);
        }
        return throwError('Unable to fetch the survey. Please try again');
      })
    );
  }
}
