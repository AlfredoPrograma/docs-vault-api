import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptService } from './encrypt.service';
import { UsersService } from '@/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/core/models/user';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '@/core/config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EncryptService, UsersService, JwtConfig],
})
export class AuthModule {}
