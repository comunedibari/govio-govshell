import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HttpClientXsrfModule } from '@angular/common/http';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { VendorsModule } from 'projects/vendors/src/lib/vendors.module';
import { ComponentsModule } from 'projects/components/src/lib/components.module';
import { LinkLabModule } from 'projects/link-lab/src/lib/link-lab.module';
import { CustomFormsModule } from 'projects/tools/src/lib/custom-forms-validators/custom-forms.module';

import { GpLayoutModule } from '../containers/gp-layout/gp-layout.module';

import { ConfigService } from 'projects/tools/src/lib/config.service';
import { AuthGuard } from '../guard/auth.guard';

import { httpInterceptorProviders } from 'projects/tools/src/lib/interceptors/index';

import { HasPermissionModule } from '../directives/has-permission/has-permission.module';

// Import containers
import {
  GpLayoutComponent,
  GpSidebarNavHelper,
  SimpleLayoutComponent
} from '../containers';

const APP_CONTAINERS = [
  GpLayoutComponent,
  SimpleLayoutComponent
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function ConfigLoader(configService: ConfigService) {
  return () => configService.load(environment.configFile);
}

@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    VendorsModule,
    ComponentsModule,
    LinkLabModule,
    CustomFormsModule,
    HasPermissionModule,

    GpLayoutModule
  ],
  providers: [
    httpInterceptorProviders,
    GpSidebarNavHelper,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigService],
      multi: true
    },
    AuthGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
