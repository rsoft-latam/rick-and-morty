// ANGULAR
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
// MODULES
import {FlexLayoutModule} from '@angular/flex-layout';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {ScrollbarModule} from '../../core/scrollbar/scrollbar.module';
import {SharedMaterialModule} from "../../shared/shared-material.module";
import {PageHeaderModule} from "../../core/page-header/page-header.module";
import {BreadcrumbsModule} from "../../core/breadcrumbs/breadcrumbs.module";
// COMPONENTS
import {CharacterComponent} from './character.component';
// SERVICES
import {CharacterService} from "./character.service";

const routes: Routes = [
  {path: '', component: CharacterComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ScrollbarModule,
    ScrollingModule,
    PageHeaderModule,
    BreadcrumbsModule,
    SharedMaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CharacterComponent
  ],
  providers: [
    CharacterService
  ]
})

export class CharacterModule {
}
