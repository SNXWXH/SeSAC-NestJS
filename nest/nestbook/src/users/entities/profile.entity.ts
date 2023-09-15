import { SuperEntity } from 'src/db/super.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'Profile' })
export class Profile extends SuperEntity<Profile> {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column({ nullable: true })
  photo: string;

  @Column()
  role: number;
}
