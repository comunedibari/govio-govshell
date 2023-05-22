import { AfterContentChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from 'projects/tools/src/lib/config.service';
import { EventsManagerService } from 'projects/tools/src/lib/eventsmanager.service';
import { EventType } from 'projects/tools/src/lib/classes/events';
import { AuthenticationService } from '../../services/authentication.service';
import { Tools } from 'projects/tools/src/lib/tools.service';

@Component({
  selector: 'app-application',
  templateUrl: 'application.component.html',
  styleUrls: ['application.component.scss']
})
export class ApplicationComponent implements OnInit, AfterContentChecked {
  static readonly Name = 'ApplicationComponent';
  @ViewChild('sectionIframe') sectionIframe!: ElementRef;

  config: any;
  appConfig: any;

  _spin: boolean = false;
  desktop: boolean = false;

  gridCols = 3;

  breadcrumbs: any[] = [
    { label: 'APP.TITLE.Application', url: '', type: 'title', icon: 'dashboard' }
  ];

  _iframeUrl: string = '';
  _iframeUrlError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private configService: ConfigService,
    public eventsManagerService: EventsManagerService,
    public authenticationService: AuthenticationService,
    private sanitized: DomSanitizer
  ) {
    this.appConfig = this.configService.getConfiguration();

    this.configService.getConfig('application').subscribe(
      (config: any) => {
        this.config = config;

        if (Tools.CurrentApplication && Tools.CurrentApplication.menu && Tools.CurrentApplication.menu.url) {
          this._iframeUrl = Tools.CurrentApplication.menu.url;
        } else {
          this.router.navigate(['/dashboard']);
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngAfterContentChecked(): void {
    this.desktop = (window.innerWidth >= 992);
    if (Tools.CurrentApplication && Tools.CurrentApplication.menu && Tools.CurrentApplication.menu.url) {
      this._iframeUrl = Tools.CurrentApplication.menu.url;
    }
  }

  onLoadIFrame(event: any) {
    // console.log('iFrame Load', event);
  }

  onIframeClick(event: any) {
    this.sectionIframe.nativeElement.click();
  }

  _sanitizeUrl(url: string): SafeUrl {
    return this.sanitized.bypassSecurityTrustResourceUrl(url)
  }
}
