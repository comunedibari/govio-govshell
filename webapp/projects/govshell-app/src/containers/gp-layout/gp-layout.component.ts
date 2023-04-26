import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterContentChecked, OnDestroy, Input, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { TranslateService } from '@ngx-translate/core';

import { Tools } from 'projects/tools/src/lib/tools.service';
import { ConfigService } from 'projects/tools/src/lib/config.service';
import { Language } from 'projects/components/src/lib/classes/language';
import { MenuAction } from 'projects/components/src/lib/classes/menu-action';
import { EventType } from 'projects/tools/src/lib/classes/events';
import { EventsManagerService } from 'projects/tools/src/lib/eventsmanager.service';
import { AuthenticationService } from '../../services/authentication.service';
import { OpenAPIService } from 'projects/govshell-app/src/services/openAPI.service';

import { INavData } from './gp-sidebar-nav';
import { GpSidebarNavHelper } from './gp-sidebar-nav.helper';
import { navItemsMainMenu } from './_nav';

import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

import urlExist from "url-exist"

@Component({
  selector: 'gp-layout',
  templateUrl: './gp-layout.component.html',
  styleUrls: ['./gp-layout.component.scss']
})
export class GpLayoutComponent implements OnInit, AfterContentChecked, OnDestroy {
  static readonly Name = 'GpLayoutComponent';
  @ViewChild('watermark', { read: ElementRef }) watermark!: ElementRef;

  @HostBinding('class.full-content') get fullContentClass(): boolean {
    return this.fullContent;
  }
  @HostBinding('class.page-full-scroll') get pageFullScrollClass(): boolean {
    return (this.fullScroll || !this.desktop) && !this.contentScroll;
  }
  @HostBinding('class.page-content-scroll') get pageContentScrollClass(): boolean {
    return (!this.fullScroll && this.desktop) || this.contentScroll;
  }

  fullContent: boolean = false;
  fullScroll: boolean = false;
  contentScroll: boolean = true;

  Tools = Tools;

  _session: any = null;

  _config: any = null;
  _languages: Language[] = [];
  _language: string = '';
  __once: boolean = true;

  _menuActions: MenuAction[] = [];
  _menuAppActions: MenuAction[] = [];

  _spin = false;

  _sideBarOpened: boolean = false;
  _sideBarCollapsed: boolean = false;
  _sideBarCollapsedPinned: boolean = false;
  _openSideBar: boolean = false;

  navItems: INavData[] = [];

  desktop: boolean = false;
  tablet: boolean = false;
  mobile: boolean = false;

  _hasSideBar: boolean = false;
  _showHeaderBar: boolean = false;
  _showFooterBar: boolean = false;
  _showFooterExpander: boolean = false;
  _footerHeight: string = '48px';
  _footerExpandedHeight: string = '48px';
  _footerExpandedOver: boolean = false;
  _expandedFooter: boolean = false;
  _forceMenuOpen: boolean = false;

  _footerHtml: string = '';
  _footerSmallHtml: string = '';

  _title: string = '';

  _isGovShell: boolean = true;
  _notSideBar: boolean = true;

  _menuShellAction: MenuAction = new MenuAction({
    title: 'GovShell',
    subTitle: '',
    action: 'dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    enabled: true
  });

  constructor(
    private router: Router,
    private observer: BreakpointObserver,
    private translate: TranslateService,
    private configService: ConfigService,
    private tools: Tools,
    private eventsManagerService: EventsManagerService,
    private authenticationService: AuthenticationService,
    private apiService: OpenAPIService,
    public sidebarNavHelper: GpSidebarNavHelper
  ) {
    this._config = this.configService.getConfiguration();
    this._hasSideBar = this._config.AppConfig.Layout.hasSideBar || false;
    this._showHeaderBar = this._config.AppConfig.Layout.showHeaderBar || false;
    this._showFooterBar = this._config.AppConfig.Layout.showFooterBar || false;
    this._showFooterExpander = this._config.AppConfig.Layout.showFooterExpander || false;
    this._footerHeight = this._config.AppConfig.Layout.footerHeight || '48px';
    this._footerExpandedHeight = this._config.AppConfig.Layout.footerExpandedHeight || '48px';
    this._footerExpandedOver = this._config.AppConfig.Layout.footerExpandedOver || false;
    this._forceMenuOpen = this._config.AppConfig.Layout.forceMenuOpen || false;
    this._title = this._config.AppConfig.Layout.Header.title;
    this._menuShellAction.title = this._config.AppConfig.Layout.Header.title;

    document.documentElement.style.setProperty('--header-height', this._showHeaderBar ? '48px' : '0px');
    document.documentElement.style.setProperty('--content-wrapper-top', this._showHeaderBar ? '48px' : '0px');

    document.documentElement.style.setProperty('--footer-height', this._showFooterBar ? this._footerHeight : '0px');
    document.documentElement.style.setProperty('--footer-expanded-height', this._showFooterBar ? this._footerExpandedHeight : '0px');
    document.documentElement.style.setProperty('--content-wrapper-bottom', this._showFooterBar ? this._footerHeight : '0px');

    if (this._config.NavMenu && this._config.NavMenu.length > 0) {
      this.navItems = this._config.NavMenu;
    } else {
      this.navItems = [...navItemsMainMenu];
    }

    this._session = this.authenticationService.getCurrentSession();

    // if (Tools.CurrentApplication && Tools.CurrentApplication.menu) {
    //   this._isGovShell = Tools.CurrentApplication.menu.action === 'dashboard';
    // }

    this._initLanguages();
    this._initMenuActions();
    this._onResize();

    this._loadFooter();
  }

  @HostListener('window:resize')
  _onResize() {
    this.desktop = (window.innerWidth >= 1200);
    this.tablet = (window.innerWidth < 1200 && window.innerWidth >= 768);
    this.mobile = (window.innerWidth < 768);

    if (this.desktop) {
      this._sideBarCollapsed = this._sideBarCollapsedPinned ? true : false;
      this._sideBarOpened = true;
      this._openSideBar = false;
    }
    if (this.tablet) {
      this._sideBarCollapsed = true;
      this._sideBarOpened = false;
      this._openSideBar = false;
    }
    if (this.mobile) {
      this._sideBarCollapsed = false;
      this._sideBarOpened = false;
    }
  }

  @HostListener('window:message', ['$event'])
  onMessage(e: any) {
    if (e.data && e.data.action) {
      switch (e.data.action) {
        case 'logout':
          this.router.navigate(['/auth/login'], { state: e.data });
          break;
        default:
          // console.log('GovShell - window:message', e.data);
          break;
      }
    }
  }

  ngOnInit() {
    this.eventsManagerService.on(EventType.NAVBAR_OPEN, (event: any) => {
      this.__openSideBar();
    });

    setTimeout(() => {
      if (this._sideBarOpened && !this.desktop && !this.mobile) {
        this.__toggelCollapse();
      }
    });

    // setTimeout(() => {
    //   this.loadProfile();
    // }, 200);
  }

  ngAfterContentChecked() {
    // this._spin = this.tools.getSpinner() && this.tools.isSpinnerGlobal();

    if (Tools.CurrentApplication && Tools.CurrentApplication.menu) {
      this._title = Tools.CurrentApplication.menu.title;
      this._isGovShell = (Tools.CurrentApplication.menu.action === 'dashboard');
    } else {
      this._title = this._config.AppConfig.Layout.Header.title;
    }

    if (this._config.AppConfig.Watermark) {
      this.__once = false;
      this._watermark();
    }
  }

  ngOnDestroy() {
  }

  loadProfile() {
    this._spin = true;
    this.apiService.getList('profile').subscribe(
      (response: any) => {
        this.authenticationService.setCurrentSession(response);
        this.authenticationService.reloadSession();
        this._initMenuActions();
        this._spin = false;
      },
      (error: any) => {
        console.log('loadProfile error', error);
        this._spin = false;
      }
    );
  }

  _initMenuActions() {
    const _user = this.authenticationService.getUser();

    this._menuActions = [
      new MenuAction({
        title: _user,
        subTitle: '',
        action: 'profile'
      }),
      new MenuAction({
        title: this.translate.instant('APP.MENU.Logout'),
        action: 'logout'
      })
    ];

    this.configService.getConfig('application').subscribe(
      (config: any) => {
        const _apps = config.Applications || [];
        _apps.forEach(async (item: any) => {
          if (this.authenticationService.hasAuthorizationsForApplication(item.name)) {            
            this._menuAppActions.push(
              new MenuAction({
                title: item.name,
                action: item.id,
                url: item.app_url,
                type: item.logo.type,
                image: item.logo.url,
                icon: item.logo.icon,
                micon: item.logo.micon,
                iconUrl: item.logo.icon_url,
                bgColor: item.logo.bg_color,
                color: item.logo.color,
                enabled: false
              })
            );
          }
        });

        this._menuAppActions.map(async (item: any) => {
          let _isEnabled = false;
          if (item.action !== 'dashboard') {
            _isEnabled = await urlExist(item.url);
            item.enabled = _isEnabled;
          }
          return item;
        });

        Tools.Applications = this._menuAppActions;
      }
    );
  }

  _initLanguages() {
    try {
      const _lingue = this._config.AppConfig.Lingue;
      const _codeLangs = (_lingue.length != 0) ? [] : ['it'];
      let _currentLanguage: Language = new Language({
        language: 'Italiano',
        alpha2Code: 'it',
        alpha3Code: 'ita'
      });
      const browserLang = this.translate.getBrowserLang();

      _lingue.forEach((lingua: any) => {
        const _l: Language = new Language(lingua);
        this._languages.push(_l);
        _codeLangs.push(lingua.alpha2Code);
        if (browserLang == _l.alpha2Code) {
          _currentLanguage = _l;
        }
      });

      this.translate.addLangs(_codeLangs);
      this._language = _currentLanguage.alpha3Code;
      // PayService.ALPHA_3_CODE = _currentLanguage.alpha3Code;
      if (this.translate.currentLang !== _currentLanguage.alpha2Code) {
        this._doTranslate();
      }
      this.translate.use(_currentLanguage.alpha2Code);

    } catch (e) {
      console.log('Verificare configurazione lingue');
    }
  }

  _onChangeLanguage(event: any) {
    if (event.language.alpha2Code !== this.translate.currentLang) {
      Tools.WaitForResponse();
      this._language = event.language.alpha3Code;
      this._doTranslate();
      this.translate.use(event.language.alpha2Code);
    }
  }

  _doTranslate() {
    // dummy
    Tools.WaitForResponse(false);
  }

  __toggelCollapse() {
    this._sideBarCollapsed = !this._sideBarCollapsed;
    this._sideBarCollapsedPinned = this._sideBarCollapsed;
    this._sideBarOpened = !this._sideBarCollapsed
    window.dispatchEvent(new Event('resize'));
  }

  __openSideBar() {
    this._openSideBar = true;
    window.dispatchEvent(new Event('resize'));
  }

  __closeSideBar() {
    this._openSideBar = false;
    window.dispatchEvent(new Event('resize'));
  }

  _onClickMenu(event: any, item: INavData) {
    if (!this._forceMenuOpen) {
      if (!this.desktop && !this.mobile) {
        this._sideBarCollapsed = true;
        this._sideBarOpened = false;
        this._openSideBar = false;
      }

      if (this.mobile && item.title && item.children && item.children.length > 0) {
        // Expand the menu
        this._sideBarCollapsed = false;
        this._sideBarOpened = true;
        this._openSideBar = true;
        this._expandMenu(item);
      } else {
        this.router.navigate([item.url]);
        if (this.mobile) {
          this._sideBarCollapsed = true;
          this._sideBarOpened = false;
          this._openSideBar = false;
          this._resetExpandMenu();
        }
      }
    } else {
      // Expand the menu
      this._sideBarCollapsed = false;
      this._sideBarOpened = true;
      this._openSideBar = true;
      item.expanded = true;
      this.router.navigate([item.url]);
      if (this.mobile) {
        this._sideBarCollapsed = true;
        this._sideBarOpened = false;
        this._openSideBar = false;
      }
    }
  }

  _onMenuHeaderAction(event: any) {
    Tools.CurrentApplication = this._menuShellAction;
    this._title = this._config.AppConfig.Layout.Header.title;
    switch (event.menu.action) {
      case 'profile':
        this.router.navigate(['/profile']);
        break
      case 'logout':
        this.router.navigate(['/auth/login']);
        break
      default:
        break;
    }
  }

  _onMenuAppHeaderAction(event: any) {
    Tools.CurrentApplication = event;
    switch (event.menu.action) {
      case 'dashboard':
        this._isGovShell = true;
        this.router.navigate([event.menu.url]);
        break
      default:
        this._isGovShell = false;
        this.router.navigate(['/application']);
        break;
    }
  }

  _hasPermission(menu: any) {
    return this.authenticationService.hasPermission(menu.permission, 'view');
  }

  _expandMenu(item: INavData) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  _resetExpandMenu() {
    this.navItems.forEach((item: INavData) => {
      item.expanded = false;
    });
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    if (e.target.id !== 'footerExpander' && this._expandedFooter) {
      if (this._footerExpandedOver) {
        this._expandedFooter = false;
      } else {
        document.documentElement.style.setProperty('--footer-height', this._expandedFooter ? this._footerExpandedHeight : this._footerHeight);
        document.documentElement.style.setProperty('--content-wrapper-bottom', this._expandedFooter ? this._footerExpandedHeight : this._footerHeight);
      }
    }
  }

  _toggleExpandFooter(event: any) {
    event.stopPropagation();
    this._expandedFooter = !this._expandedFooter;
    if (!this._footerExpandedOver) {
      document.documentElement.style.setProperty('--footer-height', this._expandedFooter ? this._footerExpandedHeight : this._footerHeight);
      document.documentElement.style.setProperty('--content-wrapper-bottom', this._expandedFooter ? this._footerExpandedHeight : this._footerHeight);
    }
  }

  _loadFooter() {
    if (this._showFooterBar) {
      this._loadStyle('./assets/pages/css/styles.css');
      this._loadScript('./assets/pages/js/scripts.js');

      const reqs: Observable<any>[] = [];  
      reqs.push( this.configService.getPage('footer-small').pipe(catchError((err) => { return of(''); })) );
      reqs.push( this.configService.getPage('footer') .pipe( catchError((err) => { return of(''); })) );
      forkJoin(reqs).subscribe(
        (results: Array<any>) => {
          this._footerSmallHtml = results[0];
          this._footerHtml = results[1];
        },
        (error: any) => {
          console.log('_loadFooter forkJoin error', error);
        }
      );
    }
  }

  _loadStyle(styleName: string) {
    const head = document.getElementsByTagName('head')[0];

    let cssLink = document.getElementById(
      'footer-css'
    ) as HTMLLinkElement;
    if (cssLink) {
      cssLink.href = styleName;
    } else {
      const style = document.createElement('link');
      style.id = 'footer-css';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }

  _loadScript(scriptName: string) {
    const head = document.getElementsByTagName('head')[0];

    let jsLink = document.getElementById(
      'footer-script'
    ) as HTMLLinkElement;
    if (jsLink) {
      jsLink.href = scriptName;
    } else {
      const script = document.createElement('script');
      script.id = 'footer-script';
      script.type = 'text/javascript';
      script.src = `${scriptName}`;
  
      head.appendChild(script);
    }
  }

  /**
   * Internal watermark text rotation
   */
  protected _watermark() {
    if (this.watermark) {
      this.__once = true;
      const watermark = this.watermark.nativeElement;
      const span = watermark.querySelector('span');
      span.style.transform = 'rotate(-' + Math.atan((watermark.clientHeight / watermark.clientWidth)) * 180 / Math.PI + 'deg)';
    }
  }
}
