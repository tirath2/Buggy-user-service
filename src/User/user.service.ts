/* eslint-disable prettier/prettier */
// src/user/user.service.ts
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/Utils/hash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async create(user: User): Promise<User & { token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
    let password = user.password;
    let hash = await this.hashService.hashPassword(password);

    let newUser = await this.userRepository.save({
      ...user,
      password: hash,
    });
    let token = this.jwtService.sign(user);
    return { ...newUser, token };
  }

  async login(email: string): Promise<(User & { token: string }) | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      let token = this.jwtService.sign(user);
      return { ...user, token };
    }
    throw new HttpException('Invalid Credential', HttpStatus.BAD_REQUEST);
  }
}
