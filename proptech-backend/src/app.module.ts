import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedSearch, SavedSearchSchema } from './searches/search.schema';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchesModule } from './searches/searches.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: SavedSearch.name, schema: SavedSearchSchema }]),

    PropertiesModule,
    AuthModule,
    SearchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}