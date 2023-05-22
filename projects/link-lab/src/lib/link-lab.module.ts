import { NgModule } from '@angular/core';

import { VendorsModule } from 'projects/vendors/src/lib/vendors.module';

import { FabGroupModule } from './it/link/components/fab-group/fab-group.module';
import { GroupModule } from './it/link/components/group/group.module';
import { TitleDecoModule } from './it/link/components/title-deco/title-deco.module';
import { FabExtendedModule } from './it/link/components/fab-extended/fab-extended.module';
import { SimpleItemModule } from './it/link/components/simple-item/simple-item.module';
import { CollapseItemModule } from './it/link/components/collapse-item/collapse-item.module';
import { CardModule } from './it/link/components/card/card.module';
import { LabelFieldModule } from './it/link/components/form/label-field.module';
import { RepeaterModule } from './it/link/components/repeater/repeater.module';
import { FragmentMenuModule } from './it/link/components/fragment-menu/fragment-menu.module';
import { BadgeModule } from './it/link/components/badge/badge.module';
import { TwinItemModule } from './it/link/components/twin-item/twin-item.module';
import { SystemViewerModule } from './it/link/components/system-viewer/system-viewer.module';
import { FlexTableModule } from './it/link/components/flex-table/flex-table.module';

@NgModule({
  declarations: [
  ],
  imports: [
    VendorsModule,
    CardModule,
    CollapseItemModule,
    FabExtendedModule,
    FabGroupModule,
    FragmentMenuModule,
    GroupModule,
    LabelFieldModule,
    RepeaterModule,
    SimpleItemModule,
    TwinItemModule,
    TitleDecoModule,
    BadgeModule,
    SystemViewerModule,
    FlexTableModule
  ],
  exports: [
    CardModule,
    CollapseItemModule,
    FabExtendedModule,
    FabGroupModule,
    FragmentMenuModule,
    GroupModule,
    LabelFieldModule,
    RepeaterModule,
    SimpleItemModule,
    TwinItemModule,
    TitleDecoModule,
    BadgeModule,
    SystemViewerModule,
    FlexTableModule
  ]
})
export class LinkLabModule { }
