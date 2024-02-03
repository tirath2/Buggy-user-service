// src/entities/user-project.entity.ts

import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('user_project')
export class UserProject extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userProjects)
  user: User;

  @ManyToOne(() => Project, (project) => project.userProjects)
  project: Project;
}
