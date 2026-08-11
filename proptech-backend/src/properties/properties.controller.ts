import { 
  Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, 
  UseInterceptors, UploadedFile, BadRequestException, ForbiddenException, Req 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userRole = req.user?.role?.toUpperCase();

    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Only administrators can upload property photos.');
    }

    const fileUrl = `http://localhost:4000/uploads/${file.filename}`;
    
    const propertyId = req.body?.propertyId;

    if (propertyId) {
      await this.propertiesService.addImageToProperty(propertyId, fileUrl);
    }

    return {
      message: 'Image uploaded and property updated successfully',
      url: fileUrl,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPropertyDto: any) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.propertiesService.findFiltered(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePropertyDto: any) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}