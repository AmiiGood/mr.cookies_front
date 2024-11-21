import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalletasComponent } from './galletas.component';

describe('GalletasComponent', () => {
  let component: GalletasComponent;
  let fixture: ComponentFixture<GalletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalletasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GalletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
