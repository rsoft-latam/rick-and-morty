// ANGULAR
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// NGRX
import {reducers} from './reducers';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
// MODULES
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';
import {RouteHandlerModule} from './core/route-handler/route-handler.module';
// COMPONENTS
import {AppComponent} from './app.component';
// OTHERS
import {environment} from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),

    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 50}) : [],
    CoreModule,
    AppRoutingModule,
    RouteHandlerModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
