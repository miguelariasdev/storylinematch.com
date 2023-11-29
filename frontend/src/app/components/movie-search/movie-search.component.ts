import { Component } from '@angular/core';
import { OpenaiService } from 'src/app/services/openai.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent {

  prompt: string = '';
  response: string = '';

  characterCount: number = 0;
  characterCountClass: string = 'text-black';

  constructor ( private openaiService: OpenaiService ){

  }

  onSubmit(): void {
    console.log(this.prompt)
    this.openaiService.generateResponse(this.prompt).subscribe({
      next: (data) => {
        this.response = data.response;
        // Maneja la respuesta aquí, por ejemplo, mostrarla en la UI
        console.log(this.response)
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  updateCharacterCount(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.characterCount = inputElement.value.length;

    this.prompt = inputElement.value;

    if (this.characterCount >= 80) {
        this.characterCountClass = 'text-red-500';
    } else if (this.characterCount >= 30) {
        this.characterCountClass = 'text-yellow-500';
    } else {
        this.characterCountClass = 'text-black';
    }
  }
}
