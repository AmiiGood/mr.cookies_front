import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalletasComponent } from './components/galletas/galletas.component';
import { MainComponent } from './components/main/main.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { InsertVentasComponent } from './components/insert-ventas/insert-ventas.component';

const routes: Routes = [
  {
    path: 'galletas',
    component: GalletasComponent,
  },
  {
    path: 'ventas',
    component: VentasComponent,
  },
  {
    path: 'ventas/insert',
    component: InsertVentasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
