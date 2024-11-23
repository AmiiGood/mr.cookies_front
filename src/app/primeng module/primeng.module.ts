import { NgModule } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [],
  imports: [
    AvatarModule,
    MenuModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
  ],
  exports: [
    AvatarModule,
    MenuModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
  ],
  providers: [MessageService],
})
export class PrimengModule {}
