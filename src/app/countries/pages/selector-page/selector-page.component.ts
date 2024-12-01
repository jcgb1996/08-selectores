import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  standalone: false,

  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit {

    public myForm!: FormGroup;
    public countriesByRegion: SmallCountry[] = [];
    public fronteras: SmallCountry[] = [];

    constructor(private fb: FormBuilder, private countryService : CountryService){

      this.myForm = fb.group({
        region: ['', Validators.required],
        country: ['', Validators.required],
        border: ['', Validators.required]
      });

    }

  ngOnInit(): void {
   this.onRegionChenged();
   this.onCountryChenged();
  }

  onRegionChenged(): void{
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap( ()=> this.myForm.get('country')?.setValue('') ),
      tap( ()=> this.fronteras = [] ),
      switchMap( r => this.countryService.getCountriesByRegion(r) )
    )
    .subscribe( (r)=> {
      this.countriesByRegion = r;
    });

  }

  onCountryChenged(): void{
    this.myForm.get('country')?.valueChanges
    .pipe(
      tap( ()=> this.myForm.get('border')?.setValue('') ),
      filter( (value :string) => value.length > 0),
      switchMap( alphaCode => this.countryService.getCountryByAlphaCode(alphaCode) ),
      switchMap( country => this.countryService.getCountryBorderByCode(country.borders) )
    )
    .subscribe( countries=> {
      this.fronteras = countries;
    });

  }


  get region(): Region[] {
    return this.countryService.region;
  }


}
