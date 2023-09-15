import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { SuperEntity } from 'src/db/super.entity';

//name은 테이블명
@Entity({ name: 'Addr' })
export class Addr extends SuperEntity<Addr> {
  //기본 length 255
  //null true => nullable: true
  @Column({ length: 64 })
  street: string;

  @Column({ length: 30 })
  detail: string;

  @ManyToOne(() => User, (user) => user.addrs)
  user: User;
}
