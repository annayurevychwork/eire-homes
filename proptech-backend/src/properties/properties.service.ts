import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.property.create({
      data,
      include: { agency: true },
    });
  }

  async findFiltered(params: any) {
    const { minPrice, maxPrice, bedrooms, ber } = params;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }
    if (bedrooms !== undefined) {
      where.bedrooms = { gte: Number(bedrooms) };
    }
    if (ber) {
      where.ber = { startsWith: ber };
    }

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        include: { agency: true },
        orderBy: [
          { createdAt: 'desc' },
          { id: 'asc' } 
        ],
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: { agency: true },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async addImageToProperty(propertyId: string, imageUrl: string) {
    const property = await this.findOne(propertyId);

    const updatedImages = [...(property.images || []), imageUrl]; 

    return this.prisma.property.update({
      where: { id: propertyId },
      data: { images: updatedImages },
      include: { agency: true },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.property.update({
      where: { id },
      data,
      include: { agency: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.property.delete({
      where: { id },
    });
  }
}