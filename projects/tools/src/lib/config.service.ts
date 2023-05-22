import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Tools } from './tools.service';
import { ActionsUpdate } from 'projects/components/src/lib/nav-bar/toolbar-actions';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: any;

  // Cache
  public CacheConfig: any = {};

  constructor(private http: HttpClient) { }

  load(url: string) {
    return new Promise<void>((resolve) => {
      this.http.get(url)
        .subscribe(config => {
          this.config = config;
          const _currentTheme = this.config.AppConfig.CurrentThems;
          const _theme = this.config.AppConfig.Themes.find((theme: any) => theme.Name === _currentTheme);
          Tools.SetThemeColors(_theme || null);
          ActionsUpdate();
          resolve();
        });
    });
  }

  getConfiguration() {
    return this.config;
  }

  getAppConfig() {
    return this.config.AppConfig;
  }

  getDominio() {
    const defaultDominio = '<Dominio non configurato>';
    return this.config.AppConfig.DOMINI.length == 1 ? this.config.AppConfig.DOMINI[0].label : defaultDominio;
  }

  getSessionPrefix() {
    return this.config.sessionPrefix;
  }

  // Get data

  getTaxonomiesPagoPA() {
    const _timeout = this.config.AppConfig.DELAY || 0;
    const _url = this.config.AppConfig.TAXONOMIESPAGOPA.URL || './assets/config/taxonomies.json';
    return this.http.get<any>(_url);
  }

  getConfig(name: string, suffix: string = '-config') {
    if (this.CacheConfig[name]) {
      let obs = new Observable((subscriber) => {
        subscriber.next(this.CacheConfig[name]);
        subscriber.complete();
      });
      return obs;
    } else{
      return this.http.get<any>(`./assets/config/${name}${suffix}.json`)
        .pipe(
          map((response: Response) => {
            this.CacheConfig[name] = response;
            return response;
          })
        );
    }
  }

  getJson(name: string) {
    const _timeout = this.config.AppConfig.DELAY || 0;
    return this.http.get<any>(`./assets/json/${name}.json`);
  }

  getPage(name: string) {
    return this.http.get<any>(`./assets/pages/${name}.html`, { responseType: 'text' as 'json' });
  }
}
