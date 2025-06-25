import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/model/inventory/recipe';
import { TokenStorage } from 'src/app/token.storage';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';
import { GroceryProduct } from 'src/app/model/inventory/Groceryproduct';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

    constructor(private http: HttpClient, private token: TokenStorage,private countryConfig: CountryConfigService) { }

  
    updateInventoryByReceipe(receipe: Recipe[]) {
      return this.http.post<Recipe[]>(this.countryConfig.getInventoryApiURL() + '/api/recipe/inventory',receipe, { observe: 'response' });
    }

    getAllRecipeByPropertyId(propertyId: number){
        return this.http.get<Recipe[]>(this.countryConfig.getInventoryApiURL() + '/api/recipe/propertyId/' + propertyId, { observe: 'response' });
 
    }

    getGroceryProductListByPropertyId(propertyId: number){
        return this.http.get<GroceryProduct[]>(this.countryConfig.getInventoryApiURL() + '/api/inventoryItem/propertyId/' + propertyId, { observe: 'response' });
      }
}
