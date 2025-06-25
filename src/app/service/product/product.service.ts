import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessProperties } from '../../model/Order/businessProperties';
import { Product } from '../../model/product/product';
import { ProductGroup } from '../../model/product/productGroup';
import { ProductVariationDto } from '../../model/product/productVariation';
import { BusinessService } from '../../model/Reservation/businessServic';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private countryConfig: CountryConfigService) { }

  findByPropertyId(id: string) {
    return this.http.get<BusinessProperties>(this.countryConfig.getCoreApiURL() + '/api/website/findByPropertyId/' + id, { observe: 'response' });
  }

  updateVariationArrayByProductId(productId : number, vbariations : ProductVariationDto[] ) {
    return this.http.post<any>(this.countryConfig.getCoreApiURL() + '/api/product/'+productId+'/variations',vbariations, { observe: 'response' });
  }


  getVarificationList(productId: number) {
    return this.http.get<ProductVariationDto[]>(this.countryConfig.getCoreApiURL() + '/api/product/' + productId + '/variation', { observe: 'response' });
  }

  CreateProductGroup(productGroup: ProductGroup, businessServiceId: number) {
    return this.http.post<ProductGroup>(this.countryConfig.getCoreApiURL() + '/api/businessService/' + businessServiceId + '/productGroup', productGroup, { observe: 'response' });
  }

  deleteProductGroup(productGroup: ProductGroup) {
    return this.http.post<ProductGroup>(this.countryConfig.getCoreApiURL() + '/api/productGroup/' + productGroup.id + '/delete', productGroup, { observe: 'response' });
  }

  CreateProduct(product: Product, productGroupId: number) {
    return this.http.post<Product>(this.countryConfig.getCoreApiURL() + '/api/productGroup/' + productGroupId + '/product', product, { observe: 'response' });
  }

  deleteProduct(product: Product) {
    return this.http.post<Product>(this.countryConfig.getCoreApiURL() + '/api/product/' + product.id + '/delete', product, { observe: 'response' });
  }

  deleteVariation(productVariationDto: ProductVariationDto, productId: number) {
    return this.http.post<ProductVariationDto>(this.countryConfig.getCoreApiURL() + '/api/product/' + productId + '/variation/' + productVariationDto.code + '/delete', productVariationDto, { observe: 'response' });
  }

  createVariation(productVariationDto: ProductVariationDto, productId: number) {
    return this.http.post<ProductVariationDto>(this.countryConfig.getCoreApiURL() + '/api/product/' + productId + '/variation', productVariationDto, { observe: 'response' });
  }

  UpdateVeriation(productId: number, productVariation: ProductVariationDto) {
    return this.http.post<ProductVariationDto>(this.countryConfig.getCoreApiURL() + '/api/product/' + productId + '/variation/' + productVariation.code, productVariation, { observe: 'response' });
  }

  updateProductGroup(productGroup: ProductGroup) {
    return this.http.post<ProductGroup>(this.countryConfig.getCoreApiURL() + '/api/productGroup/' + productGroup.id, productGroup, { observe: 'response' });
  }

  updateProduct(product: Product) {
    return this.http.post<Product>(this.countryConfig.getCoreApiURL() + '/api/product/' + product.id, product, { observe: 'response' });
  }

  getProductList(productGroupId: number) {
    return this.http.get<Product[]>(this.countryConfig.getCoreApiURL() + '/api/productGroup/' + productGroupId + '/product', { observe: 'response' });
  }

  getProductGroupListByBusinessServiceId(businessServiceId: number) {
    return this.http.get<ProductGroup[]>(this.countryConfig.getCoreApiURL() + '/api/businessService/' + businessServiceId + '/productGroup', { observe: 'response' });
  }
  getAllBusinessServiceByPropertyId(propertyId: string) {
    return this.http.get<BusinessService[]>(this.countryConfig.getCoreApiURL() + '/api/property/' + propertyId + '/businessServices', { observe: 'response' });
  }

  findProductsByBusinessServiceId(businessServiceId: number) {
    return this.http.get<ProductGroup[]>(this.countryConfig.getCoreApiURL() + '/api/website/getProductList/' + businessServiceId, { observe: 'response' });
  }
}
