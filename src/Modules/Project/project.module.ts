import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/Entity/project.entity';
import { UserService } from '../User/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/Utils/hash';
import { User } from 'src/Entity/user.entity';
import { UserProject } from 'src/Entity/user-project.entity';
import { RoleService } from '../Role/role.service';
import { Role } from 'src/Entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, UserProject, Role])],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    UserService,
    JwtService,
    HashService,
    RoleService,
  ],
})
export class ProjectModule {}
