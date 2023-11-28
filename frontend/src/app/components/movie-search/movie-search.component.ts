import { Component } from '@angular/core';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent {

  characterCount: number = 0;
  characterCountClass: string = 'text-black';

  constructor (){

  }

  updateCharacterCount(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.characterCount = inputElement.value.length;

    if (this.characterCount >= 80) {
        this.characterCountClass = 'text-red-500';
    } else if (this.characterCount >= 30) {
        this.characterCountClass = 'text-yellow-500';
    } else {
        this.characterCountClass = 'text-black';
    }
  }
}
