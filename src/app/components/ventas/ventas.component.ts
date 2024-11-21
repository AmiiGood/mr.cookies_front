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
    this.ventasService.getVentas().subscribe({
      next: (response) => {
        this.ventas = response.ventas;
      },
      error: (error) => {
        console.log('Error al cargar las ventas');
      },
    });
  }

  applyFilterGlobal(value: string) {
    this.tablaVentas.filterGlobal(value, 'contains');
  }
}
