import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalletasComponent } from './components/galletas/galletas.component';

const routes: Routes = [
  {
    path: '',
    component: GalletasComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
