import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Addr } from './addr.entity';
import { SuperEntity } from 'src/db/super.entity';
import { Auth } from './auth.entity';

//name은 테이블명
@Entity({ name: 'User' })
export class User extends SuperEntity<User> {
  // @PrimaryGeneratedColumn()
  // id: number;

  //기본 length 255
  //null true => nullable: true
  @Column({ length: 30 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 256 })
  passwd: string;

  @OneToOne(() => Profile, { cascade: true, onDelete: 'SET NULL' })
  //{name: 이름} => 하면 조인 될 때 기본 이름이 아닌 해당 이름으롯 설정됨
  //아닐 경우 원래 컬럼+ID로 이름이 설정
  @JoinColumn({ name: 'profile' })
  profile: Profile;

  @OneToMany(() => Addr, (addr) => addr.user, { cascade: true })
  addrs: Addr[];

  //ManytoMany일 경우 JoinTable 설정
  @ManyToMany(() => Auth, { cascade: true, onDelete: 'SET NULL' })
  @ManyToMany(() => Auth)
  @JoinTable({ name: 'UserAuth' })
  auth: Auth[];
}
