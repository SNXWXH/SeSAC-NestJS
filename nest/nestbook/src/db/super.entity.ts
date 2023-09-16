import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class SuperEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createAt: Date;

  @CreateDateColumn()
  updateAt: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
