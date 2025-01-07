import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', nullable: false, name: 'email' })
  email: string;

  @Column({ type: 'varchar', nullable: true, name: 'mobile' })
  mobile: string;

  @Column({ type: 'varchar', nullable: false, name: 'password' })
  password: string;
}
