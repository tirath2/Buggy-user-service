import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../Entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/Utils/hash';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async create(user: SignUpDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const password = user.password;
    const hash = await this.hashService.hashPassword(password);

    const newUser = await this.userRepository.save({
      ...user,
      password: hash,
    });
    delete newUser.password;
    const token = this.jwtService.sign(
      { ...newUser },
      { secret: 'your-secret-key' },
    );
    return { ...newUser, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (user) {
      const checkPassword = await this.hashService.comparePassword(
        loginDto.password,
        user.password,
      );
      if (checkPassword) {
        delete user.password;
        const token = this.jwtService.sign(
          { ...user },
          { secret: 'your-secret-key' },
        );
        return { ...user, token };
      } else {
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException('Invalid Email ID', HttpStatus.BAD_REQUEST);
  }

  async findUserOfProject(id) {
    const data = await this.userRepository
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('up.role_id', 'roleId')
      .leftJoinAndSelect('user_project', 'up', 'u.id = up.user_id')
      .where(`up.project_id=${id}`)
      .getRawMany();
    console.log(data);
    return data;
  }

  async searchUser(text, projectId) {
    const data = await this.userRepository
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.email', 'email')
      .where(
        `u.id not in(select id from user_project where project_id=${projectId})`,
      )
      .andWhere(`u.email  ILIKE '%${text}%'`)
      .getRawMany();
    console.log(data);
    return data;
  }

  async findOneUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
