// src/entities/user-project.entity.ts

import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base';

@Entity('user_project')
export class UserProject extends BaseEntity {
  @Column({ type: 'integer', nullable: false, name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', nullable: false, name: 'project_id' })
  projectId: number;

  @Column({ type: 'integer', nullable: false, name: 'role_id' })
  roleId: number;
}
