// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  isCurrentUserLoggedIn:boolean = false;
  currentUserRole: string = '';
  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if (route.routeConfig?.path === 'voter' && this.isCurrentUserLoggedIn && this.currentUserRole === 'voter') {
      return true;
    } else if (route.routeConfig?.path === 'commission' && this.isCurrentUserLoggedIn && this.currentUserRole === 'election_officer') {
      return true;
    }
    return false;
  }
}