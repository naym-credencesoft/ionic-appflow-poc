export enum PropertyStatusType {
    'NEW'= 0,
    'ACTIVE',
    'SUSPENDED',
    'INACTIVE'
  }
  export namespace PropertyStatusType {
  
    export function values() {
      return Object.keys(PropertyStatusType).filter(
        (type) => isNaN(<any>type) && type !== 'values'
      );
    }
  }