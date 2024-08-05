import { Controller, Post, Put, Body, UseGuards, UploadedFile, UseInterceptors, Get, Req, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Request } from 'express';

@Controller('movie')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Create a new movie
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('poster', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueSuffix);
      },
    }),
  }))
  async create(@Body() createMovieDto: CreateMovieDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const user = req.user as any;
    createMovieDto.owner = user.userId; // Set the owner to the authenticated user's ID
    createMovieDto.poster = file.path.replace(/\\/g, '/');
    // createMovieDto.poster = `http://localhost:3000/${createMovieDto.poster}`;
    return this.moviesService.create(createMovieDto);
  }

  // Get all movies
  @Get('all')
  async findAll() {
    return this.moviesService.findAll();
  }

  // Get movies by the authenticated user
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyMovies(@Req() req: Request) {
    const user = req.user as any;
    return this.moviesService.findByOwner(user.userId);
  }

  // Get a specific movie by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  // Update a movie by ID
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('poster', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueSuffix);
      },
    }),
  }))
  async update(@Param('id') id: string, @Body() updateMovieDto: CreateMovieDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      updateMovieDto.poster = file.path.replace(/\\/g, '/');
      // updateMovieDto.poster = `http://localhost:3000/${updateMovieDto.poster}`;
    }
    return this.moviesService.update(id, updateMovieDto);
  }
}
