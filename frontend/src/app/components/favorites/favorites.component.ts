import { Component } from '@angular/core';
import { FavoriteMoviesService } from 'src/app/services/favorite-movie.service';
import { MovieDataService } from 'src/app/services/movie-data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {

  movieData: any = [];

  constructor(
    private favoriteMoviesService: FavoriteMoviesService,
    private movieDataService: MovieDataService
  ){}

  ngOnInit(){
    this.getFavoriteMovies();
  }

  getFavoriteMovies() {
    this.favoriteMoviesService.getFavoriteMovies().subscribe({
      next: (movies) => {

        for (let i = 0; i < movies.length; i++) {
          this.movieData.push(JSON.parse(movies[i].movie_data))
        }
        
        this.movieData.reverse();
      },
      error: (error) => {
        console.error('Error al obtener películas favoritas', error);
      }
    });
  }

  deleteFavoriteMovie(title: string) {
    this.favoriteMoviesService.deleteFavoriteMovie(title).subscribe({
      next: (response) => {
        console.log('Película eliminada con éxito:', response);
        // Aquí puedes actualizar la vista o realizar acciones adicionales
              // Encuentra el índice de la película eliminada en el array
      const index = this.movieData.findIndex((movie:any) => movie.results[0].titleText.text === title);
      
      if (index !== -1) {
        this.movieData.splice(index, 1);
      }
      },
      error: (error) => {
        console.error('Error al eliminar película', error);
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


  favoriteMovie(index: number, isFavorite: boolean){

    this.deleteFavoriteMovie(this.movieData[index].results[0].titleText.text);

    this.movieData = []
    this.getFavoriteMovies();
    
  }

}
