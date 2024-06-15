import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImdbIdDocument = HydratedDocument<ImdbId>;

@Schema()
export class ImdbId {
  _id: string;

  @Prop({ required: true, unique: true })
  imdb_id: string;

  @Prop({ required: true })
  rating: string;

  @Prop({ required: true })
  votes: string;
}

export const ImdbIdSchema = SchemaFactory.createForClass(ImdbId);
