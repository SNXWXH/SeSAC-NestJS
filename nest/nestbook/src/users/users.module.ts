import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailService } from '../email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Addr } from './entities/addr.entity';
import { Auth } from './entities/auth.entity';
import { UserSubscriber } from './user.subscriber';
import { Post } from 'src/posts/entities/post.entity';

@Module({
  //테이블이 추가되면 여기에도 추가
  imports: [TypeOrmModule.forFeature([User, Profile, Addr, Auth, Post])],
  controllers: [UsersController],
  providers: [UsersService, EmailService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
