import { Component } from '@angular/core';
import { OpenaiService } from 'src/app/services/openai.service';

import { MovieDataService } from 'src/app/services/movie-data.service';
import { StoryHistoryService } from 'src/app/services/story-history.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent {

  prompt: string = '';
  OpeanAIResponse: any = {};

  movieData: any = [];

  isLoading = false;

  characterCount: number = 0;
  characterCountClass: string = 'text-black';

  constructor ( private openaiService: OpenaiService, private movieDataService: MovieDataService, private storyHistoryService: StoryHistoryService ){

  }

  ngOnInit() {
    /* this.searchMovie("War Horse", "2011") */
  }

  onSubmit(): void {
    console.log(this.prompt)
    this.OpeanAIResponse = null;
    this.movieData = [];

    this.isLoading = true;

    this.openaiService.generateResponse(this.prompt).subscribe({
      next: (data) => {
        this.isLoading = false;
        const jsonData = JSON.parse(data.response);
        this.OpeanAIResponse = jsonData;

        console.log(this.OpeanAIResponse);

        const moviePromises = [];

        if (this.OpeanAIResponse.movie_list) {
          for (let movie of this.OpeanAIResponse.movie_list) {
            // Asumiendo que searchMovie ahora devuelve una Promise
            const moviePromise = this.searchMovie(movie.title, movie.release_year);
            moviePromises.push(moviePromise);
          }

          Promise.all(moviePromises).then(() => {
            // Ahora this.movieData debe estar completo
            const movieDataJSON = JSON.stringify(this.movieData);
            console.log(movieDataJSON);
            console.log(this.movieData);
            this.insertStory(this.prompt, movieDataJSON);
    });
  }
        
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  searchMovie(title: string, year: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.movieDataService.getMovieData(title, year).subscribe(
        data => {
          let movieData;
  
          if (!data.results[0]) {
            movieData = {
              "results": [
                {
                  "primaryImage": {
                    "url": "../../../assets/img/movie_empty.jpg",
                    "caption": {
                      "plainText": "",
                      "__typename": "Markdown"
                    },
                    "__typename": "Image"
                  },
                  "titleText": {
                    "text": title,
                    "__typename": "TitleText"
                  },
                  "releaseYear": {
                    "year": year,
                    "endYear": null,
                    "__typename": "YearRange"
                  },
                  "plot": {
                    "plotText" : {
                      "plainText" : "N/A"
                    }
                  }
                }
              ]
            };
          } else {
            movieData = data;
          }
  
          this.movieData.push(movieData);
          resolve(movieData); // Resolver la promesa con los datos de la película
        },
        error => {
          console.error(error);
          reject(error); // Rechazar la promesa en caso de error
        }
      );
    });
  }
  
  insertStory(query: string, moviesData: any){

    this.storyHistoryService.postStoryHistory(query, moviesData).subscribe({
      next: (response) => {
        // Manejar respuesta
        console.log('Historia insertada', response);
      },
      error: (error) => {
        // Manejar error
        console.error('Error al insertar historia', error);
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
