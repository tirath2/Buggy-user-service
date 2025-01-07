import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Get,
  ParseIntPipe,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/signup.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() userData: SignUpDto) {
    return await this.userService.create(userData);
  }

  @ApiBody({ type: LoginDto })
  @Post('login')
  @UsePipes()
  async login(@Body() loginData: LoginDto) {
    const user = await this.userService.login(loginData);
    return user;
  }

  @Get('project/users/:id')
  @UseGuards(AuthGuard('jwt'))
  projectUsers(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserOfProject(id);
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  searchUser(
    @Query('text') text: string,
    @Query('projectId', ParseIntPipe) projectId: number,
  ) {
    if (!text?.length) {
      return [];
    }
    return this.userService.searchUser(text, projectId);
  }
}
