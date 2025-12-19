// ANGULAR
import {NgModule} from '@angular/core';
// ANGULAR MATERIAL
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  exports: [
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})

export class SharedMaterialModule {
  static forRoot(): any {
    return {
      ngModule: SharedMaterialModule
    };
  }
}
