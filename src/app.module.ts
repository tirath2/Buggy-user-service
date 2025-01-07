import { RoleModule } from './Modules/Role/role.module';
import { ProjectModule } from './Modules/Project/project.module';
import { UserModule } from './Modules/User/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbdatasource } from 'data.source';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './Modules/Auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    RoleModule,
    ProjectModule,
    UserModule,
    TypeOrmModule.forRoot(dbdatasource),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' }, // Adjust expiration as needed
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
