// src/entities/user-project.entity.ts

import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base';

@Entity('role_mapping')
export class UserProject extends BaseEntity {
  @Column({ type: 'integer', nullable: false, name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', nullable: false, name: 'project_id' })
  projectId: number;

  @Column({ type: 'integer', name: 'role_id' })
  roleId: number;

  @Column({ type: 'integer', nullable: false, name: 'report_to_user_id' })
  reportToUserId: number;

  @Column({ type: 'integer', nullable: false, name: 'report_to_role_id' })
  reportToRoleId: number;
}
