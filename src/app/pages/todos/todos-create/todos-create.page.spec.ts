import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodosCreatePage } from './todos-create.page';

describe('TodosCreatePage', () => {
  let component: TodosCreatePage;
  let fixture: ComponentFixture<TodosCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
