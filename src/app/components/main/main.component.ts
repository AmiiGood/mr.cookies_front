import { Component } from '@angular/core';
import { menuItems } from '../../interfaces/menu/menu-items';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  menuItems = menuItems;
}
