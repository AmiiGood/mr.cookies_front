import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProduccionService } from '../../services/produccion/produccion.service';
import { ProductionCookie } from '../../interfaces/produccion/produccion';
import { GalletasService } from '../../services/galletas/galletas.service';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
})
export class ProduccionComponent implements OnInit {
  cookies: ProductionCookie[] = [];
  loading: boolean = false;
  selectedCookie: ProductionCookie | null = null;

  constructor(
    public produccionService: ProduccionService,
    private galletasService: GalletasService,
    private messageService: MessageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadProductionCookies();
  }

  get activeCookies(): ProductionCookie[] {
    return this.cookies.filter(
      (cookie) => cookie.estatus.toLowerCase() !== 'ok'
    );
  }

  loadProductionCookies() {
    this.loading = true;
    this.produccionService.getProduction().subscribe({
      next: (response) => {
        this.cookies = response.production;
        this.loading = false;
      },
      error: (error) => {
        // Si el error es porque no hay producción, limpiamos el array de cookies
        if (error.error?.message === 'No hay produccion en curso') {
          this.cookies = [];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las galletas en producción',
            life: 3000,
          });
        }
        this.loading = false;
      },
    });
  }

  updateStatus(cookie: ProductionCookie) {
    this.loading = true;
    const nextStatus = this.produccionService.getNextStatus(cookie.estatus);

    // Si el estado actual es "enfriando", el siguiente será "lista"
    if (cookie.estatus.toLowerCase() === 'enfriando') {
      this.handleReadyStatus(cookie);
      return;
    }

    this.produccionService
      .updateStatus(cookie.id_galleta, { estatus: nextStatus })
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${cookie.nombre} ha sido actualizada a ${nextStatus}`,
            life: 3000,
          });
          this.loadProductionCookies();
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el estado de la galleta',
            life: 3000,
          });
          this.loading = false;
        },
      });
  }

  private handleReadyStatus(cookie: ProductionCookie) {
    // Actualizamos directamente a "Ok" ya que los insumos ya fueron verificados
    this.produccionService
      .updateStatus(cookie.id_galleta, { estatus: 'Ok' })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Producción Completada',
            detail: `${cookie.nombre} ha sido completada`,
            life: 3000,
          });
          this.loadProductionCookies();
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al finalizar la producción',
            life: 3000,
          });
          this.loading = false;
        },
      });
  }

  getStatusClass(status: string): any {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '120px', // Ancho mínimo fijo
      height: '32px', // Altura fija
      fontSize: '0.875rem', // Tamaño de fuente más equilibrado
      padding: '0.5rem 1rem', // Padding uniforme
      borderRadius: '4px', // Bordes suaves
      textTransform: 'capitalize',
      fontWeight: '500', // Peso de la fuente medio
    };

    switch (status.toLowerCase()) {
      case 'preparacion':
        return { ...baseStyles, backgroundColor: '#ffb74d', color: '#000' };
      case 'horneado':
        return { ...baseStyles, backgroundColor: '#ff7043', color: '#fff' };
      case 'enfriando':
        return { ...baseStyles, backgroundColor: '#64b5f6', color: '#fff' };
      case 'lista':
        return { ...baseStyles, backgroundColor: '#4caf50', color: '#fff' };
      case 'ok':
        return { ...baseStyles, backgroundColor: '#66bb6a', color: '#fff' };
      default:
        return baseStyles;
    }
  }
}
