/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../Entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HashService } from 'src/Utils/hash';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' }, // Adjust expiration as needed
    }),
  ],
  controllers: [UserController],
  providers: [UserService, HashService, JwtService],
})
export class UserModule {}
