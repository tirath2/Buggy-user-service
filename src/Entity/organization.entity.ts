// src/entities/organization.entity.ts

import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  industry: string;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}
