import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'integer', nullable: false, name: 'project_id' })
  projectId: number;
}
