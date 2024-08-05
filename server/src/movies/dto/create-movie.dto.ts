export class CreateMovieDto {
    title: string;
    year: number;
    poster: string; // Could be a URL or path to the image
    owner: string; // Will be set in the controller
  }
  