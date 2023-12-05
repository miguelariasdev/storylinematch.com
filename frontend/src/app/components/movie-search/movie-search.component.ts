import { Component } from '@angular/core';
import { OpenaiService } from 'src/app/services/openai.service';

import { MovieDataService } from 'src/app/services/movie-data.service';
import { StoryHistoryService } from 'src/app/services/story-history.service';
import { FavoriteMoviesService } from 'src/app/services/favorite-movie.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent {

  prompt: string = '';
  OpeanAIResponse: any = {};

  movieData: any = [];
  stories: any = [];
  movieFavoriteData: any = [];

  isLoading = false;

  characterCount: number = 0;
  characterCountClass: string = 'text-black';

  selectedStoryIndex: number | null = null;




  constructor ( private openaiService: OpenaiService, 
    private movieDataService: MovieDataService, 
    private storyHistoryService: StoryHistoryService,
    private favoriteMoviesService: FavoriteMoviesService ){

  }

  ngOnInit() {
    this.loadStory();

    this.getFavoriteMovies();

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
            this.loadStory();
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
          this.getFavoriteMovies();

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
          
          console.log(this.movieData)
          console.log(this.movieFavoriteData)

          // Añadiendo isFavorite
        this.movieData.forEach((movie: any) => {
          let isFavorite = false;
          this.movieFavoriteData.forEach((favoriteMovie: any) => {
              if (favoriteMovie.results.length > 0 && movie.results.length > 0) {
                  if (favoriteMovie.results[0].titleText.text === movie.results[0].titleText.text) {
                      isFavorite = true;
                  }
              }
          });
          movie.isFavorite = isFavorite;
        });

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

  loadStory() {
    this.storyHistoryService.getStoryHistory().subscribe({
      next: (stories) => {
        this.stories = stories;
        console.log(this.stories)
      },
      error: (error) => {
        console.error('Error al cargar historias', error);
      }
    });
  }

  printStory( storyQuery: string) {

    for (let i = 0; i < this.stories.length; i++) {

      if (this.stories[i].query === storyQuery) {

        console.log(this.stories[i].query)

        const jsonObject = JSON.parse(this.stories[i].movies_data);
        const jsonArray = Object.values(jsonObject);

        this.movieData = jsonArray

         // Añadiendo isFavorite
         this.movieData.forEach((movie: any) => {
          let isFavorite = false;
          this.movieFavoriteData.forEach((favoriteMovie: any) => {
              if (favoriteMovie.results.length > 0 && movie.results.length > 0) {
                  if (favoriteMovie.results[0].titleText.text === movie.results[0].titleText.text) {
                      isFavorite = true;
                  }
              }
          });
          movie.isFavorite = isFavorite;
      });

      }
      
    }
  }

  favoriteMovie(index: number, isFavorite: boolean){

    if ( isFavorite ) {
      console.log("eliminar favorita")

      this.movieData[index].isFavorite = false;
      /* const movieDataJSON = JSON.stringify(this.movieData[index]); */

      this.deleteFavoriteMovie(this.movieData[index].results[0].titleText.text);
    } else if (isFavorite === false) {

      this.movieData[index].isFavorite = true;
      const movieDataJSON = JSON.stringify(this.movieData[index]);

      this.insertFavoriteMovie(this.movieData[index].results[0].titleText.text , movieDataJSON);
    }

    
  }

  getFavoriteMovies() {
    this.favoriteMoviesService.getFavoriteMovies().subscribe({
      next: (movies) => {

        for (let i = 0; i < movies.length; i++) {
          this.movieFavoriteData.push(JSON.parse(movies[i].movie_data))
        }

        console.log(this.movieFavoriteData)
        
      },
      error: (error) => {
        console.error('Error al obtener películas favoritas', error);
      }
    });
  }

  insertFavoriteMovie(title: string, movieData: any) {
    this.favoriteMoviesService.postFavoriteMovie(title, movieData).subscribe({
        next: (response) => {
            // Manejar respuesta
            console.log('Película favorita insertada', response);
        },
        error: (error) => {
            // Manejar error
            console.error('Error al insertar película favorita', error);
        }
    });
  }

  deleteFavoriteMovie(title: string) {
    this.favoriteMoviesService.deleteFavoriteMovie(title).subscribe({
      next: (response) => {
        console.log('Película favorita eliminada', response);
        // Podrías hacer algo aquí si necesitas actualizar la UI después de eliminar la película de favoritos
      },
      error: (error) => {
        console.error('Error al eliminar película favorita', error);
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
