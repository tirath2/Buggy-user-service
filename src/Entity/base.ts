import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true, name: 'created_by' })
  createdBy: number; // You might want to reference the user who created the entity

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'uploaded_by' })
  updatedBy: number; // You might want to reference the user who last updated the entity

  @Column({ type: 'integer', name: 'deleted_by', nullable: true })
  deletedBy: number;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  setCreatedBy(): void {
    this.createdBy = this.getLoggedInUserId();
    this.updatedBy = this.getLoggedInUserId();
  }

  @BeforeUpdate()
  setUpdatedBy(): void {
    this.updatedBy = this.getLoggedInUserId();
  }

  protected getLoggedInUserId(): number {
    const user = (global as any).currentUser;
    return user.id;
  }
}
