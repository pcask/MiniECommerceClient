import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCartItemsComponent } from './get-cart-items.component';

describe('GetCartItemsComponent', () => {
  let component: GetCartItemsComponent;
  let fixture: ComponentFixture<GetCartItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetCartItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetCartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
