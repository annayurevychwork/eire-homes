import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchesService } from './searches.service';
import { SearchesController } from './searches.controller';
import { SavedSearch, SavedSearchSchema } from './search.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SavedSearch.name, schema: SavedSearchSchema }]),
  ],
  controllers: [SearchesController],
  providers: [SearchesService],
})
export class SearchesModule {}