// src/project/project.controller.ts

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Request,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddUserDto } from './dto/add-user.dto';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.projectService.findAll();
  }

  @Get('details')
  @UseGuards(AuthGuard('jwt'))
  findDetails(@Query('projectId', ParseIntPipe) projectId: number) {
    return this.projectService.getProjectDetails(projectId);
  }

  @Get('user-projects')
  @UseGuards(AuthGuard('jwt'))
  findAllProjectForUser(@Request() req) {
    console.log(req.user);
    return this.projectService.findAllProjectForUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto, req?.user?.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-user')
  addUser(@Request() req, @Body() addUserDto: AddUserDto) {
    return this.projectService.addUserToProject(addUserDto, req?.user?.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/user/role')
  updateUserRole(
    @Query('projectId', ParseIntPipe) projectId: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Query('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.projectService.updateUserRole(projectId, userId, roleId);
  }
}
