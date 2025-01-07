import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
@ApiTags('Role')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Get()
  getAllRoles(@Query('projectId') projectId?: number) {
    return this.roleService.getRoles(projectId);
  }

  @Post()
  saveRole(@Query('projectId') projectId: number, @Body() roles?: string[]) {
    return this.roleService.createRoles(roles, projectId);
  }
}
