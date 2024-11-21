import { MenuItem } from 'primeng/api';

export const menuItems: MenuItem[] = [
  {
    label: 'Ventas',
    icon: 'pi pi-shopping-bag',
    routerLink: ['/ventas'],
    routerLinkActiveOptions: { exact: true },
    title: 'Ventas',
  },
  {
    label: 'Galletas',
    icon: 'pi pi-box',
    routerLink: ['/galletas'],
    routerLinkActiveOptions: { exact: true },
    title: 'Galletas',
  },
];
