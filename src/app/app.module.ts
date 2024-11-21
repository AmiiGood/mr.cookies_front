import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { PrimengModule } from './primeng module/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { GalletasComponent } from './components/galletas/galletas.component';
import { MainComponent } from './components/main/main.component';
import { InsertVentasComponent } from './components/insert-ventas/insert-ventas.component';

@NgModule({
  declarations: [
    AppComponent,
    VentasComponent,
    GalletasComponent,
    MainComponent,
    InsertVentasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PrimengModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
