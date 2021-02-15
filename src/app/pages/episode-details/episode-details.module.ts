import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from "@angular/router";
import {EpisodeDetailsComponent} from "./episode-details.component";
import {EpisodeDetailsService} from "./episode-details.service";
import {BreadcrumbsModule} from "../../core/breadcrumbs/breadcrumbs.module";
import {PageHeaderModule} from "../../core/page-header/page-header.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";

const routes: Routes = [
  {path: '', component: EpisodeDetailsComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    PageHeaderModule,
    BreadcrumbsModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  declarations: [
    EpisodeDetailsComponent
  ],
  providers: [
    EpisodeDetailsService
  ]
})

export class EpisodeDetailsModule {
}
