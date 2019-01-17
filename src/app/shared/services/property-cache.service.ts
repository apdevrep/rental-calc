import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyCacheService {
  propertyCache: Object = {'residential': undefined, 'buyVsRent': undefined, 'commercial': undefined};

  constructor() { }

  addCurrentProperty(property: Property, calcType: string, customObject: any){
    if(this.propertyCache[calcType] == undefined){
      this.propertyCache[calcType] = {current: {property: property, customObject: customObject}, archive: []};
    } else if(this.propertyCache[calcType].current != undefined && this.propertyCache[calcType].archive == undefined ){
      this.propertyCache[calcType].archive = [this.propertyCache[calcType].current];
      this.propertyCache[calcType].current = {property: property, customObject: customObject};
    } else {
      this.propertyCache[calcType].archive.push(this.propertyCache[calcType].current);
      this.propertyCache[calcType].current = {property: property, customObject: customObject};
    }
  }

  getCurrentProperty(calcType: string){
    if(this.propertyCache[calcType] == undefined){
      if(calcType == 'residential' && this.propertyCache['buyVsRent'] != undefined){
        return this.propertyCache['buyVsRent'].current;
      } else if(calcType == 'buyVsRent' && this.propertyCache['residential'] != undefined){
        return this.propertyCache['residential'].current;
      } else {
        return undefined;
      }
    } else {
      return this.propertyCache[calcType].current;
    }
  }
}
