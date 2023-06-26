import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './dynamic-page.component.html',
  styles: [
  ]
})
export class DynamicPageComponent {

  private readonly fb = inject(FormBuilder);

  public myForm: FormGroup = this.fb.group({
    name: [ '', [ Validators.required, Validators.minLength(3) ] ],
    favouriteGames: this.fb.array([
      ['Age of Empires II', Validators.required],
      ['Pokémon', Validators.required],
    ])
  });

  public newFavorite: FormControl = new FormControl('', Validators.required );

  get favouriteGameList() {
    return this.myForm.get('favouriteGames') as FormArray;
  }

  isValidField( field: string ): boolean | null {
    return this.myForm.controls[field].errors
      && this.myForm.controls[field].touched;
  }

  getFieldError( field: string ): string | null {

    if ( !this.myForm.controls[field] ) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors) ) {
      switch( key ) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${ errors['minlength'].requiredLength } caracters.`;
      }
    }

    return null;
  }

  isValidFieldInArray( formArray: FormArray, i: number ) {
    return formArray.controls[i].errors
      && formArray.controls[i].touched;
  }

  onAddFavorite(): void{
    if ( this.newFavorite.invalid ) return;

    const newGame = this.newFavorite.value;
    this.favouriteGameList.push(
      this.fb.control( newGame, Validators.required )
    );

    this.newFavorite.reset();
  }

  onDeleteFavourite( i: number ){
    this.favouriteGameList.removeAt(i);
  }

  onSubmit(): void{
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.valid);
    (this.myForm.controls['favouriteGameList'] as FormArray) = this.fb.array([]);
    this.myForm.reset();
  }


}
