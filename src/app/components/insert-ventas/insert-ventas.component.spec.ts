import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertVentasComponent } from './insert-ventas.component';

describe('InsertVentasComponent', () => {
  let component: InsertVentasComponent;
  let fixture: ComponentFixture<InsertVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsertVentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
