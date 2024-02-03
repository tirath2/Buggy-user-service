// src/entities/user.entity.ts

import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { Organization } from './organization.entity';
import { UserProject } from './user-project.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  mobile: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization;

  @OneToMany(() => UserProject, (userProject) => userProject.user)
  userProjects: UserProject[];
}
