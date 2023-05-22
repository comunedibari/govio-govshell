import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EventType } from 'projects/tools/src/lib/classes/events';
import { ConfigService } from 'projects/tools/src/lib/config.service';
import { EventsManagerService } from 'projects/tools/src/lib/eventsmanager.service';

import * as _ from 'lodash';

export const AUTH_CONST: any = {
  storageSession: 'GOSH_SESSION'
};

export const USER_ADMIN: string = 'amministratore';

export const PERMISSIONS: any = {
  govhub_organizations_editor: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govhub_organizations_viewer: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govhub_services_editor: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govhub_services_viewer: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govhub_users_editor: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govhub_users_viewer: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govio_sender: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govio_viewer: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govio_service_instance_editor: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ],
  govio_service_instance_viewer: [
    { name: 'DASHBOARD', view: true, edit: false, create: false, delete: false }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentSession: any = null;

  config: any = null;
  appConfig: any = null;

  API_LOGIN: string = '/do-login';
  API_PROFILE: string = '/profile';
  API_LOGOUT: string = '/logout';

  _noProfile: boolean = false;

  constructor(
    private http: HttpClient,
    public configService: ConfigService,
    private eventsManagerService: EventsManagerService
  ) {
    this.config = this.configService.getConfiguration();
    this.appConfig = this.configService.getAppConfig();

    if (this.appConfig?.GOVAPI?.LOGOUT_URL) {
      this.API_LOGOUT = this.appConfig.GOVAPI.LOGOUT_URL;
    }

    this.reloadSession();
  }

  ngOnInit(): void {
  }

  login(username: string, password: string) {
    const body = `username=${username}&password=${password}`;

    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/x-www-form-urlencoded')

    const httpOptions = {
      params: {},
      headers: httpHeaders
    };

    let url = `${this.appConfig.GOVAPI['HOST']}${this.API_LOGIN}`;

    return this.http.post(url, body, httpOptions);
  }

  logout() {
    localStorage.removeItem(AUTH_CONST.storageSession);
    let url = `${this.appConfig.GOVAPI['HOST']}${this.API_LOGOUT}`;
    return this.http.get(url);
  }

  setNoProfile(value: boolean) {
    this._noProfile = value;
  }

  setCurrentSession(data: any) {
    const session = btoa(encodeURI(JSON.stringify(data)));
    localStorage.setItem(AUTH_CONST.storageSession, session);
  }

  getCurrentSession() {
    const storage = localStorage.getItem(AUTH_CONST.storageSession);
    if (storage) {
      const currentSession = JSON.parse(decodeURI(atob(storage)));
      return currentSession;
    }
    return null;
  }

  reloadSession() {
    this.currentSession = this.getCurrentSession();
    this.eventsManagerService.broadcast(EventType.SESSION_UPDATE, this.currentSession);
  }

  isLogged() {
    if (this.currentSession) {
      return true;
    }
    return false;
  }

  getUser() {
    const session = this.getCurrentSession();
    return session?.principal ?? '<no-username>';
  }

  getAuthorizations() {
    const session = this.getCurrentSession();
    return session?.authorizations ?? [];
  }

  hasRole(role: string) {
    const _auths = this.getAuthorizations();
    if (_auths.findIndex((x: any) => x.name === role) > -1) {
      return true;
    }
    return false;
  }

  isAdmin() {
    const _auths: any[] = this.getAuthorizations();
    if (!this.currentSession) {
      return false;
    } else {
      const idx = _auths.findIndex((auth: any) => auth.role.role_name === USER_ADMIN);
      return ( idx > -1);
    }
  }

  getPermissions() {
    const _auths: any[] = this.getAuthorizations();
    let permissions: any[] = [];
    _auths.forEach((auth: any) => {
      permissions = permissions.concat(PERMISSIONS[auth.role.role_name]);
    });
    return permissions;
  }

  hasPermission(value: string, grant = 'view') {
    const uValue = value;
    // if (this.isAdmin() || uValue === 'PUBLIC' || this._noProfile) { return true; }
    const permissions = this.getPermissions();
    const idx = permissions.findIndex((auth: any) => auth.name === uValue);
    const permission = (idx > -1) ? permissions[idx] : null;
    if (permission) {
      return permission[grant];
    }
    return false;
  }

  hasAuthorizationsForApplication(name: string) {
    // if (this.isAdmin() || this._noProfile) { return true; }
    const _auths: any[] = this.getAuthorizations();
    const idx = _auths.findIndex((auth: any) => auth.role.application.toLowerCase() === name.toLowerCase() );
    return (idx > -1);
  }
}
