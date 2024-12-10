import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalletasComponent } from './components/galletas/galletas.component';
import { MainComponent } from './components/main/main.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { InsertVentasComponent } from './components/insert-ventas/insert-ventas.component';
import { ProduccionComponent } from './components/produccion/produccion.component';

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
  {
    path: 'produccion',
    component: ProduccionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
