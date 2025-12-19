// ANGULAR
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
// MODULES
import {SharedMaterialModule} from "../../shared/shared-material.module";
import {PageHeaderModule} from "../../core/page-header/page-header.module";
import {BreadcrumbsModule} from "../../core/breadcrumbs/breadcrumbs.module";
// COMPONENTS
import {CharacterDetailsComponent} from "./character-details.component";
// SERVICES
import {CharacterDetailsService} from "./character-details.service";

const routes: Routes = [
  {path: '', component: CharacterDetailsComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    BreadcrumbsModule,
    SharedMaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CharacterDetailsComponent
  ],
  providers: [
    CharacterDetailsService
  ]
})

export class CharacterDetailsModule {
}
