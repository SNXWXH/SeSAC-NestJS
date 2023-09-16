import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { SuperEntity } from 'src/db/super.entity';

//name은 테이블명
@Entity({ name: 'Addr' })
export class Addr extends SuperEntity<Addr> {
  //기본 length 255
  //null true => nullable: true
  @Column()
  street: string;

  @Column({ length: 128 })
  detail: string;

  // @ManyToOne(() => User, (user) => user.addrs, {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'soft-delete', // 'delete'
  })
  @JoinColumn()
  user: User;

  @DeleteDateColumn()
  deleteAt: Date;
}
