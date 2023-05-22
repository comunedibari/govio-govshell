import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsComponent } from './components.component';

import { VendorsModule } from 'projects/vendors/src/lib/vendors.module';
import { LinkLabModule } from 'projects/link-lab/src/lib/link-lab.module';

import { HeadBarComponent } from './head-bar/head-bar.component';
import { NavBarComponent, FilterActionsPipe, InnerHTMLPipe } from './nav-bar/nav-bar.component';
// import { SidenavMenuComponent } from './sidenav-menu/sidenav-menu.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpidComponent } from './spid/spid.component';
// import { YesnoDialogComponent } from './dialogs/yesno-dialog/yesno-dialog.component';
import { YesnoDialogBsComponent } from './dialogs/yesno-dialog-bs/yesno-dialog-bs.component';
import { MultiSnackbarComponent } from './dialogs/multi-snackbar/multi-snackbar.component';
import { BoxMessageComponent } from './box-message/box-message.component';
import { TextBoxHighlighterComponent } from './text-box-highlighter/text-box-highlighter.component';

// UI
import { BreadcrumbModule } from './ui/breadcrumb/breadcrumb.module';
import { BoxMessageModule } from './ui/box-message/box-message.module';
import { BoxSpinnerModule } from './ui/box-spinner/box-spinner.module';
import { FormReadonlyModule } from './ui/form-readonly/form-readonly.module';
import { BoxCollapseModule } from './ui/box-collapse/box-collapse.module';
import { SearchBarModule } from './ui/search-bar/search-bar.module';
import { SearchBarFormModule } from './ui/search-bar-form/search-bar-form.module';
import { SimpleItemModule } from './ui/simple-item/simple-item.module';
import { CollapseItemModule } from './ui/collapse-item/collapse-item.module';
import { InputHelpModule } from './ui/input-help/input-help.module';
import { AddEditValueModule } from './ui/add-edit-value/add-edit-value.module';
import { AppSwitcherModule } from './ui/app-switcher/app-switcher.module';

// Charts
import { SparklineeModule } from './charts/sparkline/sparkline.module';

// Pipes
import { PluralTranslatePipe } from './pipes/plural-translate.pipe';
import { PropertyFilterPipe } from './pipes/service-filters';
import { OrderByPipe } from './pipes/ordeby.pipe';
import { HighlighterPipe } from './pipes/highlighter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { MapperPipe } from './pipes/mapper.pipe';

// Directives
import { RouterLinkMatchDirective } from './directives/router-link-match.directive';
import { HtmlAttributesDirective } from './directives/html-attr.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { TextUppercaseModule } from './directives/uppercase.module';
import { TextLowercaseModule } from './directives/lowercase.module';
import { CountUpeModule } from './directives/count-up.module';
import { IframeTrackerModule } from './directives/iframe-tracker.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    VendorsModule,
    LinkLabModule,

    // UI
    BreadcrumbModule,
    BoxMessageModule,
    BoxSpinnerModule,
    FormReadonlyModule,
    BoxCollapseModule,
    SearchBarModule,
    SearchBarFormModule,
    SimpleItemModule,
    CollapseItemModule,
    InputHelpModule,
    AddEditValueModule,
    AppSwitcherModule,

    // Charts
    SparklineeModule,

    // Directives
    TextUppercaseModule,
    TextLowercaseModule,
    CountUpeModule,
    IframeTrackerModule
  ],
  declarations: [
    ComponentsComponent,
    HeadBarComponent,
    NavBarComponent, FilterActionsPipe, InnerHTMLPipe,
    // LayoutComponent,
    // SidenavMenuComponent,
    SpinnerComponent,
    SpidComponent,
    // YesnoDialogComponent,
    YesnoDialogBsComponent,
    MultiSnackbarComponent,
    BoxMessageComponent,
    TextBoxHighlighterComponent,

    // Pipes
    PluralTranslatePipe,
    PropertyFilterPipe,
    OrderByPipe,
    HighlighterPipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    MapperPipe,

    // Directives
    RouterLinkMatchDirective,
    HtmlAttributesDirective,
    ClickOutsideDirective
  ],
  exports: [
    // UI
    BreadcrumbModule,
    BoxMessageModule,
    BoxSpinnerModule,
    FormReadonlyModule,
    BoxCollapseModule,
    SearchBarModule,
    SearchBarFormModule,
    SimpleItemModule,
    CollapseItemModule,
    InputHelpModule,
    AddEditValueModule,
    AppSwitcherModule,

    // Charts
    SparklineeModule,

    ComponentsComponent,
    HeadBarComponent,
    NavBarComponent, FilterActionsPipe, InnerHTMLPipe,
    // LayoutComponent,
    // SidenavMenuComponent,
    SpinnerComponent,
    SpidComponent,
    // YesnoDialogComponent,
    YesnoDialogBsComponent,
    MultiSnackbarComponent,
    BoxMessageComponent,
    TextBoxHighlighterComponent,

    // Pipes
    PluralTranslatePipe,
    PropertyFilterPipe,
    OrderByPipe,
    HighlighterPipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    MapperPipe,

    // Directives
    RouterLinkMatchDirective,
    HtmlAttributesDirective,
    ClickOutsideDirective,
    TextUppercaseModule,
    TextLowercaseModule,
    CountUpeModule,
    IframeTrackerModule
  ]
})
export class ComponentsModule { }
