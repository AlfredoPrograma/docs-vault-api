import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/core/models/entities';
import { CreateUserDto } from '@/core/models/user';
import { UserAlreadyRegisteredError } from './errors/user.errors';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(payload: CreateUserDto): Promise<User> {
    const isRegisteredUser = await this.findByEmail(payload.email);

    if (isRegisteredUser) {
      throw new UserAlreadyRegisteredError();
    }

    return await this.usersRepository.save(payload);
  }
}
