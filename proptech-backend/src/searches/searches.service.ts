import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavedSearch, SavedSearchDocument } from './search.schema';

@Injectable()
export class SearchesService {
  constructor(
    @InjectModel(SavedSearch.name)
    private savedSearchModel: Model<SavedSearchDocument>,
  ) {}

  async create(userId: string, filters: any): Promise<SavedSearch> {
    const newSearch = new this.savedSearchModel({ userId, filters });
    return newSearch.save();
  }

  async findAllByUser(userId: string): Promise<SavedSearch[]> {
    return this.savedSearchModel.find({ userId }).exec();
  }
}