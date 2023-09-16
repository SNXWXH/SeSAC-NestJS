import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { v1 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Addr } from './entities/addr.entity';
// import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class UsersService {
  private tokenMap = new Map<string, string>();

  constructor(
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    // console.log(
    //   '🚀  TTT:',
    //   config.get('TTT'),
    //   config.get('PPP'),
    //   config.get('PRO'),
    //   config.get('emailOptions'),
    //   this.config.get('Port'),
    // );
  }
  // create(createUserDto: CreateUserDto) {
  //   // console.log('🚀  createUserDto:', createUserDto);
  //   const token = v1();
  //   this.tokenMap.set(createUserDto.email, token);
  //   // this.emailService.sendMail(createUserDto.email, token);
  //   return createUserDto;
  // }

  async create(createUserDto: CreateUserDto) {
    const profile = new Profile({ ...createUserDto.profile, role: 0 });

    const addrs = createUserDto.addrs?.map(
      (createAddrDto) => new Addr(createAddrDto),
    );

    const allAuths = await this.entityManager.find(Auth);
    const auth = createUserDto.auth?.map((adto) =>
      allAuths.find((a) => a.id === adto.id),
    );

    const user = new User({ ...createUserDto, profile, addrs, auth });

    user.profile = profile;
    return this.entityManager.save(user);
  }

  verifyToken(email: string, token: string) {
    console.log('🚀  token:', token, this.tokenMap.get(email));
    return token === this.tokenMap.get(email);
  }

  // get<T>(key) {
  //   return map.get(key) as T;
  // }

  findAll() {
    return this.entityManager.find(User);
    // return this.dataSource.getRepository(User).find();
  }

  private t(p: number, t: string) {
    console.log(p, t);
  }

  // promise로 반환함
  findOne(id: number) {
    // 여기서는 new Promise를 하는 거여서
    // return될 때는 상관이 없지만, 해당 함수를 사용할 때는 비동기로 걸어줘야 함
    return this.userRepository.findOne({
      where: { id },
      // profile을 찾아서 같이 달라고 한 것임
      relations: { profile: true, addrs: true, auth: true },
    });
    // return this.entityManager.findOne(User, { where: { id } });
    // return this.entityManager.findOneBy(User, { id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // userRepository의 findOne은 Promise를 반환함 그래서 async/await 사용해주어야함
    const user = await this.findOne(id);
    user.name = updateUserDto.name;
    user.passwd = updateUserDto.passwd;

    if (updateUserDto.passwd) user.passwd = updateUserDto.passwd;
    if (updateUserDto.profile)
      user.profile = new Profile(updateUserDto.profile);
    user.addrs = updateUserDto.addrs?.map(
      (CreateAddrDto) => new Addr(CreateAddrDto),
    );
    return this.userRepository.save(user);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  createAuth(createAuthDto: CreateAuthDto) {
    const auth = new Auth(createAuthDto);
    return this.entityManager.save(auth);
  }
  findAuths() {
    return this.entityManager.find(Auth);
  }
}
