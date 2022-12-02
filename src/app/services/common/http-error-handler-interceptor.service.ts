import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastr: CustomToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(err => {
      switch (err.status) {
        case HttpStatusCode.Unauthorized:
          this.toastr.Notify("You are not authorized. Please sign up first.", "Unauthorized", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopCenter,
            timeOut: 3000
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastr.Notify("We couldn't load this page. Please try again. If the problem persists, let us know.", "Bad Request", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopCenter,
            timeOut: 3500
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastr.Notify("We looked everywhere for this page. Please sure the URL is correct and try again. If the problem persists, let us know.", "Page Not Found", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopCenter,
            timeOut: 3500
          });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastr.Notify("The server encountered an error and couldn't complete your request. If the problem persists, let us know.", "Internal Server Error", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopCenter,
            timeOut: 3500
          });
          break;
        default:
          this.toastr.Notify("An unexpected error has occurred. Please try again. If the problem persists, let us know.", "Unexpected Error", {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopCenter,
            timeOut: 3500
          });
          break;
      }
      return of(err);
    }));

  }

}
