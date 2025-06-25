import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class Logger {
    static info(value: any, ...rest: any[]): void {
        if (environment.showLog)
            console.info(value, rest);
    }

    static log(value: any, ...rest: any[]): void {
        if (environment.showLog)
            console.log(value, rest);
    }

    static warn(value: any, ...rest: any[]): void {
        if (environment.showLog)
            console.warn(value, rest);
    }

    static error(value: any, ...rest: any[]): void {
        if (environment.showLog)
            console.error(value, rest);
    }
}