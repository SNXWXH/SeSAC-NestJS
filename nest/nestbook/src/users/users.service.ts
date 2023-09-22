import { Injectable, NotFoundException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { v1 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { EmailService } from '../email/email.service';
// import { DataSource, EntityManager, Repository } from 'typeorm';
import { EntityManager, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Addr } from './entities/addr.entity';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

const CNT_PER_PAGE = 3;

@Injectable()
export class UsersService {
  private tokenMap = new Map<string, string>();

  constructor(
    // private readonly config: ConfigService,
    // private readonly emailService: EmailService,
    // private readonly dataSource: DataSource,
    private readonly entityManager: EntityManager,
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

  private getAllAuth() {
    return this.entityManager.find(Auth);
  }

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

  findAll(page: number = 1) {
    const skip = (page - 1) * CNT_PER_PAGE;
    // return this.userRepository.find({ where: { id: MoreThan(1) } });
    return this.entityManager.find(User, {
      take: CNT_PER_PAGE,
      skip,
      order: { id: 'DESC' },
    });
    // return this.dataSource.getRepository(User).find();
  }

  private t(p: number, t: string) {
    console.log(p, t);
  }

  private async checkUser(id: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id },
      //!이걸 걸어줘야 정보가 같이 넘어옴 제발 같이 넘겨주셈
      relations: { profile: true, addrs: true, auth: true },
    });
    if (!user) throw new NotFoundException('There is no user!');
    return user;
  }

  async findOne(id: number) {
    await this.checkUser(id);

    // return this.userRepository.findOne({
    //   where: { id },
    //   relations: { profile: true, addrs: true },
    // });

    return this.entityManager.findOne(User, {
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createAt: true,
        updateAt: true,
      },
      relations: { profile: true, addrs: true, auth: true },
    });
    // return this.entityManager.findOneBy(User, { id });
  }

  // // promise로 반환함
  // async findOne(id: number) {
  //   await this.checkUser(id);

  //   // 여기서는 new Promise를 하는 거여서
  //   // return될 때는 상관이 없지만, 해당 함수를 사용할 때는 비동기로 걸어줘야 함
  //   return this.entityManager.findOne(User, {
  //     where: { id },
  //     // profile을 찾아서 같이 달라고 한 것임
  //     relations: { profile: true, addrs: true, auth: true },
  //   });
  //   // return this.entityManager.findOne(User, { where: { id } });
  // }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.entityManager.transaction(async (entityManager) => {
      // const user = await this.userRepository.findOne({ where: { id } });
      // const user = await this.findOne(id);
      const user = await this.checkUser(id);
      // if (!user) throw new NotFoundException('There is no user!');

      user.name = updateUserDto.name;

      if (updateUserDto.passwd) user.passwd = updateUserDto.passwd;

      console.log('🚀  user.profile:', user.profile);
      if (updateUserDto.profile.id !== user.profile.id) {
        await entityManager.delete(Profile, { id: user.profile.id });
      }

      user.profile = new Profile(updateUserDto.profile);

      user.addrs = updateUserDto.addrs?.map(
        (createAddrDto) => new Addr(createAddrDto),
      );

      const allAuths = await this.getAllAuth();
      user.auth = updateUserDto.auth?.map((createAuthDto: CreateAuthDto) =>
        allAuths.find((auth: Auth) => auth.id === createAuthDto.id),
      );

      return entityManager.save(user);
    });
  }

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
