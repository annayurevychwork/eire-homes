import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SearchesService } from './searches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('searches')
@UseGuards(JwtAuthGuard) 
export class SearchesController {
  constructor(private readonly searchesService: SearchesService) {}

  @Post()
  saveSearch(@Body() body: { filters: any }, @Req() req: any) {
    const userId = req.user.userId;
    return this.searchesService.create(userId, body.filters);
  }

  @Get()
  getUserSearches(@Req() req: any) {
    const userId = req.user.userId;
    return this.searchesService.findAllByUser(userId);
  }
}