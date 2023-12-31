import {
  AfterInsert,
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
  //기본 length 255
  //null true => nullable: true
  @Column({ length: 30 })
  name: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column({ length: 128, select: false })
  passwd: string;

  @OneToOne(() => Profile, { cascade: true, onDelete: 'SET NULL' })
  //{name: 이름} => 하면 조인 될 때 기본 이름이 아닌 해당 이름으롯 설정됨
  //아닐 경우 원래 컬럼+ID로 이름이 설정
  @JoinColumn({ name: 'profile' })
  profile: Profile;

  //()=> Addr -> 타입 지정해주기
  //(addr) => addr.user  -> 외래키 거는거라 생각하면 편함
  @OneToMany(() => Addr, (addr) => addr.user, { cascade: true })
  addrs: Addr[];

  //ManytoMany일 경우 JoinTable 설정
  // @ManyToMany(() => Auth, { cascade: true, onDelete: 'SET NULL' })
  @ManyToMany(() => Auth, { cascade: true })
  @JoinTable({ name: 'UserAuth' })
  auth: Auth[];

  @AfterInsert()
  afterUserInsert() {
    this.passwd = '';
  }
}
