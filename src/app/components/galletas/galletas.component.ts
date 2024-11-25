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
  providers: [MessageService],
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
  ) {
    this.messageService.clear();
  }

  openEditDialog() {
    if (this.selectedGalleta) {
      this.editedName = this.selectedGalleta.nombre;
      console.log(this.selectedGalleta);
      this.showEditDialog = true;
    }
  }

  ngOnInit(): void {
    this.loadCookies();
  }

  loadCookies() {
    this.cookiesService.getCookies().subscribe({
      next: (response) => {
        this.galletas = response.cookies;
        this.checkInventoryLevels();
        console.log(this.galletas);
      },
      error: (error) => {
        console.log('Error al cargar las galletas');
      },
    });
  }

  checkInventoryLevels() {
    const checkAndNotify = (galleta: Cookie) => {
      if (galleta.estatus === 'Agotado') {
        this.messageService.add({
          severity: 'warn',
          summary: 'Galleta Agotada',
          detail: `¿Deseas enviar ${galleta.nombre} a producción?`,
          sticky: true,
          data: { type: 'needsProduction', galleta },
        });
      } else if (galleta.cantidad <= 10) {
        this.messageService.add({
          severity: 'info',
          summary: 'Stock Bajo',
          detail: `${galleta.nombre} está por agotarse (${galleta.cantidad} unidades restantes)`,
          sticky: true,
          data: { type: 'needsProduction', galleta },
        });
      }
    };

    this.galletas.forEach((galleta, index) => {
      setTimeout(() => checkAndNotify(galleta), index * 300);
    });
  }

  showRestockAlert(galleta: Cookie) {
    console.log('Showing restock alert for:', galleta.nombre);
    this.messageService.add({
      severity: 'warn',
      summary: 'Galleta Agotada',
      detail: `¿Deseas enviar ${galleta.nombre} a producción?`,
      sticky: true,
      closable: true,
      life: 10000,
      key: `restock-${galleta.id_galleta}`,
      data: galleta,
    });
  }

  showLowStockAlert(galleta: Cookie) {
    console.log('Showing low stock alert for:', galleta.nombre);
    this.messageService.add({
      severity: 'info',
      summary: 'Stock Bajo',
      detail: `${galleta.nombre} está por agotarse (${galleta.cantidad} unidades restantes)`,
      life: 8000,
      key: `low-${galleta.id_galleta}`,
      data: galleta,
    });
  }

  requestProduction(galleta: Cookie) {
    this.messageService.clear();
    this.cookiesService
      .postGalleta({ id_galleta: galleta.id_galleta })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Producción Solicitada',
            detail: `Se ha enviado ${galleta.nombre} a producción`,
            life: 3000,
          });
          setTimeout(() => {
            this.loadCookies();
          }, 3000);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'No se pudo solicitar la producción',
            life: 3000,
          });
          setTimeout(() => {
            this.checkInventoryLevels();
          }, 3000);
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
