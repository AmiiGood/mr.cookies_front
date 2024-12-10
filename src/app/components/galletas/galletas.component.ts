import { Component, OnInit, ViewChild } from '@angular/core';
import { GalletasService } from '../../services/galletas/galletas.service';
import { Cookie } from '../../interfaces/galleta/galleta';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ProduccionService } from '../../services/produccion/produccion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galletas',
  templateUrl: './galletas.component.html',
  styleUrl: './galletas.component.css',
  providers: [MessageService],
})
export class GalletasComponent implements OnInit {
  public galletas!: Cookie[];
  public selectedGalleta: Cookie | null = null;
  public showAllBranches: boolean = false;
  showEditDialog: boolean = false;
  editedName: string = '';
  @ViewChild('tablaGalletas') tablaGalletas!: Table;

  constructor(
    private cookiesService: GalletasService,
    private produccionService: ProduccionService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.messageService.clear();
  }

  openEditDialog() {
    if (this.selectedGalleta) {
      this.editedName = this.selectedGalleta.nombre;
      this.showEditDialog = true;
    }
  }

  ngOnInit(): void {
    this.loadCookies();
  }

  loadCookies() {
    this.cookiesService.getCookies(this.showAllBranches).subscribe({
      next: (response) => {
        this.galletas = response.cookies;
        this.checkInventoryLevels();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las galletas',
          life: 3000,
        });
      },
    });
  }

  onToggleAllBranches() {
    this.loadCookies();
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

  requestProduction(galleta: Cookie) {
    this.messageService.clear();

    // Primero verificamos si hay suficientes insumos
    this.cookiesService
      .postGalleta({ id_galleta: galleta.id_galleta })
      .subscribe({
        next: (response) => {
          // Si el post es exitoso, significa que hay suficientes insumos
          // Ahora actualizamos el estado a "preparacion"
          this.produccionService
            .updateStatus(galleta.id_galleta, { estatus: 'preparacion' })
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Enviado a Producción',
                  detail: `${galleta.nombre} ha sido enviada a producción`,
                  life: 3000,
                });
                this.router.navigate(['/produccion']);
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al actualizar el estado de producción',
                  life: 3000,
                });
              },
            });
        },
        error: (error) => {
          // Si hay error en el post, significa que no hay suficientes insumos
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error?.message ||
              'No hay suficientes insumos para producir esta galleta',
            life: 3000,
          });
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
              life: 3000,
            });
            this.showEditDialog = false;
            this.selectedGalleta = null;
            this.loadCookies();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar',
              detail: 'Hubo un error al actualizar la galleta',
              life: 3000,
            });
          },
        });
    }
  }
}
