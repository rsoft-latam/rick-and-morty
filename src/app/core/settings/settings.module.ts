import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatRadioModule,
    MatSelectModule
  ],
  declarations: [SettingsComponent],
  exports: [SettingsComponent]
})
export class SettingsModule { }
