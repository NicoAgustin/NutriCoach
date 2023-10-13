import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private firebaseSvc: FirebaseService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.firebaseSvc.getAuthState().pipe(map(auth => {
      //No existe usuario autenticado
      if (!auth) {
        return true
      } else {
        //Existe usuario autenticado
        this.router.navigate(['/tabs/inicial'])
        return false
      }
    }))


  }

}
