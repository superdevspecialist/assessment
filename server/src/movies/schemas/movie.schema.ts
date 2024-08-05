import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  poster: string;

  @Prop({ required: true })
  owner: string; // ID of the user who created the movie
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
