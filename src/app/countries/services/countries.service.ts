import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private _region: Region[] = [
    Region.Africa  ,
    Region.Americas,
    Region.Asia    ,
    Region.Europe  ,
    Region.Oceania ,
  ];

  private baseUrl :string = 'https://restcountries.com/v3.1'; ///region/americas?field=cca3,name,borders

  constructor(private http : HttpClient) { }

  get region(): Region[] {
    return [...this._region];
  }

  getCountriesByRegion(region : Region): Observable<SmallCountry[]>{

    if(!region) return of([]);

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url)
    .pipe(
      map( countrie => countrie.map( c => ({
        name: c.name.common,
        cca3: c.cca3,
        borders: c.borders ?? []
      }))),
    );
  }


  getCountryByAlphaCode(alphaCode : string): Observable<SmallCountry>{
    const url: string = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url)
    .pipe(
      map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? [],
      }))
    );
  }

  getCountryBorderByCode( borders: string[] ) : Observable<SmallCountry[]>{

    if(!borders || borders.length === 0) return of([]);

    const countryReques: Observable<SmallCountry>[]  = [];

    borders.forEach( x => {
      const request = this.getCountryByAlphaCode(x);
      countryReques.push(request);
    });

    return combineLatest(countryReques);
  }





}
