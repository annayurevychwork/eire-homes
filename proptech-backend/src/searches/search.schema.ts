import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SavedSearchDocument = SavedSearch & Document;

@Schema({ timestamps: true })
export class SavedSearch {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Object, required: true })
  filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    ber?: string;
  };
}

export const SavedSearchSchema = SchemaFactory.createForClass(SavedSearch);