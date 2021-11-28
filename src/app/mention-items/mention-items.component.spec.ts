import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionItemsComponent } from './mention-items.component';

describe('MentionItemsComponent', () => {
  let component: MentionItemsComponent;
  let fixture: ComponentFixture<MentionItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentionItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
