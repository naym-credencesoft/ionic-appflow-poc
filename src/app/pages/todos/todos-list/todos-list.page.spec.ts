import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodosListPage } from './todos-list.page';

describe('TodosListPage', () => {
  let component: TodosListPage;
  let fixture: ComponentFixture<TodosListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
