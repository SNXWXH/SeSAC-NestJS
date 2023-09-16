import { SuperEntity } from 'src/db/super.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Profile' })
export class Profile extends SuperEntity<Profile> {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column({ nullable: true })
  photo: string;

  @Column()
  role: number;

  @OneToOne(() => User)
  user: User;
}
