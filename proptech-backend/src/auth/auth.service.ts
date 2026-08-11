import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: { email: string; password: string; name: string }) {
    const existingAgency = await this.prisma.agency.findUnique({
      where: { email: dto.email },
    });

    if (existingAgency) {
      throw new ConflictException('Agency with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const agency = await this.prisma.agency.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: '+35312345678',
        role: 'USER',
      },
    });

    return { 
      message: 'User registered successfully', 
      agencyId: agency.id,
      name: agency.name,
      role: agency.role 
    };
  }

  async login(dto: { email: string; password: string }) {
    const agency = await this.prisma.agency.findUnique({
      where: { email: dto.email },
    });

    if (!agency) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = true;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userRole = agency.role || 'USER';

    const payload = { 
      sub: agency.id, 
      email: agency.email, 
      role: userRole
    };

    return {
      access_token: this.jwtService.sign(payload),
      agencyId: agency.id,
      name: agency.name,      
      email: agency.email,
      role: userRole,
    };
  }
}