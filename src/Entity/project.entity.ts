import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', nullable: true, name: 'description' })
  description: string;

  @Column({ type: 'varchar', nullable: true, name: 'link' })
  link: string;
}
