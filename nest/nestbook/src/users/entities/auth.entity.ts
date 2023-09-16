import { Column, Entity } from 'typeorm';
import { SuperEntity } from 'src/db/super.entity';
// import { User } from './user.entity';

//name은 테이블명
@Entity({ name: 'Auth' })
export class Auth extends SuperEntity<Auth> {
  //기본 length 255
  //null true => nullable: true
  @Column({ length: 10 })
  type: string;

  //권한에 대한 마스터 테이블이라 조인을 걸 필요가 없음
  // ManyToMany는 한곳에서만 걸면 됨
  // @ManyToMany(() => User, (user) => user.auth)
  // user: User[];
}
