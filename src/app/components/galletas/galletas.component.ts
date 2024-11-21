import { Component, OnInit, ViewChild } from '@angular/core';
import { GalletasService } from '../../services/galletas/galletas.service';
import { Cookie } from '../../interfaces/galleta/galleta';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-galletas',
  templateUrl: './galletas.component.html',
  styleUrl: './galletas.component.css',
})
export class GalletasComponent implements OnInit {
  public galletas!: Cookie[];
  public selectedGalleta: Cookie | null = null;
  showEditDialog: boolean = false;
  editedName: string = '';
  @ViewChild('tablaGalletas') tablaGalletas!: Table;

  constructor(
    private cookiesService: GalletasService,
    private messageService: MessageService
  ) {}

  openEditDialog() {
    if (this.selectedGalleta) {
      this.editedName = this.selectedGalleta.nombre;
      console.log(this.selectedGalleta);
      this.showEditDialog = true;
    }
  }

  ngOnInit(): void {
    this.cookiesService.getCookies().subscribe({
      next: (response) => {
        this.galletas = response.cookies;
      },
      error: (error) => {
        console.log('Error al cargar las galletas');
      },
    });
  }

  applyFilterGlobal(value: string) {
    this.tablaGalletas.filterGlobal(value, 'contains');
  }

  getEstatusSeverity(
    galleta: Cookie
  ): 'success' | 'info' | 'warning' | 'danger' {
    switch (galleta.estatus) {
      case 'Agotado':
        return 'warning';
      case 'Exceso':
        return 'info';
      case 'Caducado':
        return 'danger';
      case 'Ok':
        return 'success';
      default:
        return 'success';
    }
  }

  updateCookie() {
    if (this.selectedGalleta && this.editedName) {
      this.cookiesService
        .updateCookie(this.selectedGalleta.id_galleta, {
          nombre_galleta: this.editedName,
        })
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Galleta actualizada',
              detail: 'La galleta ha sido actualizada correctamente',
            });
            console.log(response);

            this.showEditDialog = false;
            this.ngOnInit();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar',
              detail: 'Hubo un error al actualizar la galleta',
            });
          },
        });
    }
  }
}
