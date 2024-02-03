// src/entities/project.entity.ts

import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { UserProject } from './user-project.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  userProjects: UserProject[];
}
