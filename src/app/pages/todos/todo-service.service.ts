import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryConfigService } from 'src/app/service/CountryConfig/countryConfig.service';
import { Todos } from './todos';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

    constructor(private http: HttpClient, private countryConfig: CountryConfigService) { }

    findAllTodos() {
        return this.http.get<Todos[]>(this.countryConfig.getCoreApiURL() + '/api/todo', { observe: 'response' });
      }
    
      saveTodos(todos:Todos) {
        return this.http.post<Todos>(this.countryConfig.getCoreApiURL() + '/api/todo',todos, { observe: 'response' });
      }
    
      getTodosById(id : number) {
        return this.http.get<Todos>(this.countryConfig.getCoreApiURL() + '/api/todo/'+id, { observe: 'response' });
      }
    
      deleteTodosById(id : number, todo) {
        return this.http.post<Todos>(this.countryConfig.getCoreApiURL() + '/api/todo/delete/'+id , todo, { observe: 'response' });
      }
    
      updateTodos(todos:Todos) {
        return this.http.post<Todos>(this.countryConfig.getCoreApiURL() + '/api/todo/'+todos.id+'/applicationUserId/'+todos.applicationUserId,todos, { observe: 'response' });
      }
    
      findAllTodosByApplicationUserId(applicationUserId:number) {
        return this.http.get<Todos[]>(this.countryConfig.getCoreApiURL() + '/api/todo/applicationUserId/'+ applicationUserId, { observe: 'response' });
      }
    
      findAllTodosByBusinessServiceId(businessServiceId:number) {
        return this.http.get<Todos[]>(this.countryConfig.getCoreApiURL() + '/api/todo/businessServiceId/'+businessServiceId, { observe: 'response' });
      }
    
      findAllTodosByPropertyId(propertyId:number) {
        return this.http.get<Todos[]>(this.countryConfig.getCoreApiURL() + '/api/todo/propertyId/'+propertyId, { observe: 'response' });
      }

   
}
