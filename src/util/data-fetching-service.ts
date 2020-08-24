import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:"root",
})
export class DataFetchingService{
    constructor(private http:HttpClient){}


    private constructUrl(city:string){
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ae1d0b10b9648a065e8b0a1f92c1fa16&lang=en`;
    }

    getCityData(city:string){
        let url = this.constructUrl(city);

        return this.http.get(url)
        .pipe(
            catchError((error,caught)=>{
                if(error.status === 404){
                    return of("NOT FOUND");
                }
                return throwError(error);
            })
        )
    }
}