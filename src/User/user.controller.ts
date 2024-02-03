import {
  Controller,
  Post,
  Body,
  NotFoundException,
  ConflictException,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../Entity/user.entity';
import { LoginDto } from './user.dto';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() userData: User): Promise<User> {
    return await this.userService.create(userData);
  }

  @ApiBody({ type: LoginDto })
  @Post('login')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes()
  async login(@Body() loginData: LoginDto): Promise<User> {
    const user = await this.userService.login(loginData.email);
    return user;
  }
}
