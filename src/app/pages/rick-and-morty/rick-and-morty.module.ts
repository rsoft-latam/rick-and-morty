import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RickAndMortyComponent} from './rick-and-morty.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatIconModule, MatTabsModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {ScrollbarModule} from '../../core/scrollbar/scrollbar.module';
import {RickAndMortyService} from "./rick-and-morty.service";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderModule} from "../../core/page-header/page-header.module";
import {BreadcrumbsModule} from "../../core/breadcrumbs/breadcrumbs.module";

const routes: Routes = [
  {path: '', component: RickAndMortyComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    ScrollbarModule,
    ScrollingModule,
    PageHeaderModule,
    BreadcrumbsModule,

    FlexLayoutModule,

    MatCardModule,
    MatIconModule,
    MatDividerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    RickAndMortyComponent
  ],
  providers: [
    RickAndMortyService
  ]
})

export class RickAndMortyModule {
}