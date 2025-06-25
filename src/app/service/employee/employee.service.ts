import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/model/emp/employee';
import { TokenStorage } from 'src/app/token.storage';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
    
    constructor(private http: HttpClient, private token: TokenStorage, private countryConfig: CountryConfigService) { }

    getAllEmployee() {
      return this.http.get<Employee[]>(this.countryConfig.getEmpApiURL + '/api/v1/employees', { observe: 'response' });
    }
  
    getAllEmployeeByPropertyId(propertyId : number) {
      return this.http.get<Employee[]>(this.countryConfig.getEmpApiURL() + '/api/v1/employees/propertyId/'+propertyId, { observe: 'response' });
    }
  
    createEmployee(employeeData:Employee){
      return this.http.post<Employee>(this.countryConfig.getEmpApiURL() + '/api/v1/employees',employeeData, { observe: 'response' });
    }
  
    // updateEmployeeStatusbyId(statusData:EmpStatus ,employeeData:Employee){
    //   return this.http.get<Employee>(this.countryConfig.getCoreApiURL() + '/api/v1/employees/employeeId/'+employeeData.id+'/status/'+statusData.status, { observe: 'response' });
    // }
  
    getEmployeeById(id: number){
      return this.http.get<Employee>(this.countryConfig.getEmpApiURL() + '/api/v1/employees/'+id, { observe: 'response' });
    }
  
    deleteEmployeeData(id:number):Observable<object>{
      return this.http.delete<Employee>(this.countryConfig.getEmpApiURL() + '/api/v1/employees/'+id, { observe: 'response' });
    }
}
