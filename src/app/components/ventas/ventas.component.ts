import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { Venta } from '../../interfaces/venta/venta';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { VentasService } from '../../services/ventas/ventas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
})
export class VentasComponent implements OnInit {
  public ventas!: Venta[];
  public ventasOriginal!: Venta[];
  public fechaInicio: Date | null = null;
  public fechaFin: Date | null = null;

  @ViewChild('tablaVentas') tablaVentas!: Table;

  constructor(
    private ventasService: VentasService,
    private messageService: MessageService,
    private router: Router
  ) {}

  insertVenta() {
    this.router.navigate(['/ventas/insert']);
  }

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.ventasService.getVentas().subscribe({
      next: (response) => {
        this.ventas = response.ventas;
        this.ventasOriginal = [...response.ventas];
      },
      error: (error) => {
        console.log('Error al cargar las ventas');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las ventas',
        });
      },
    });
  }

  applyFilterGlobal(value: string) {
    this.tablaVentas.filterGlobal(value, 'contains');
  }

  filtrarPorFecha() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicioAjustada = new Date(this.fechaInicio);
      fechaInicioAjustada.setHours(0, 0, 0, 0);

      const fechaFinAjustada = new Date(this.fechaFin);
      fechaFinAjustada.setHours(23, 59, 59, 999);

      const ventasFiltradas = this.ventasOriginal.filter((venta) => {
        const fechaVenta = new Date(venta.fecha_venta);
        return (
          fechaVenta >= fechaInicioAjustada && fechaVenta <= fechaFinAjustada
        );
      });

      this.ventas = ventasFiltradas;

      if (ventasFiltradas.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'No se encontraron ventas en el rango de fechas seleccionado',
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione ambas fechas para filtrar',
      });
    }
  }

  limpiarFiltroFecha() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.ventas = [...this.ventasOriginal];
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Filtros limpiados correctamente',
    });
  }
}
