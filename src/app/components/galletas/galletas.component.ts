import { Component, OnInit } from '@angular/core';
import { GalletasService } from '../../services/galletas/galletas.service';
import { Cookie } from '../../interfaces/galleta/galleta';

@Component({
  selector: 'app-galletas',
  templateUrl: './galletas.component.html',
  styleUrl: './galletas.component.css',
})
export class GalletasComponent implements OnInit {
  public galletas!: Cookie[];
  constructor(private cookiesService: GalletasService) {}

  ngOnInit(): void {
    this.cookiesService.getCookies().subscribe({
      next: (response) => {
        this.galletas = response.cookies;
        console.log('Galletas: ', this.galletas);
      },
      error: (error) => {
        console.log('Error al cargar las galletas');
      },
    });
  }
}
