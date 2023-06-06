import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { User } from '@/core/models/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '@/core/models/user';

import { UsersService } from '../users.service';
import { UserAlreadyRegisteredError } from '../errors/user.errors';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = createMock<Repository<User>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return found user by email', async () => {
    // Arrange
    const generateUser = () => {
      const user = new User();
      user.email = 'test@mail.com';
      user.id = randomUUID();
      user.password = 'secretPassword';

      return user;
    };

    const email = 'test@mail.com';
    const expectedUser = generateUser();

    mockUsersRepository.findOne.mockResolvedValueOnce(expectedUser);

    // Act
    const foundUser = await service.findByEmail(email);

    // Assert
    expect(foundUser).toEqual(expectedUser);
  });

  it('should return null if user not found', async () => {
    // Arrange
    const email = 'test@mail.com';
    mockUsersRepository.findOne.mockResolvedValueOnce(null);

    // Act
    const expectedNull = await service.findByEmail(email);

    // Assert
    expect(expectedNull).toBeNull();
  });

  it('should create new user', async () => {
    // Arrange
    const payload: CreateUserDto = {
      email: 'test@mail.com',
      password: 'secretPassword',
    };

    const generateUser = () => {
      const user = new User();
      user.email = payload.email;
      user.id = randomUUID();
      user.password = payload.password;

      return user;
    };

    const expectedUser = generateUser();
    mockUsersRepository.findOne.mockResolvedValueOnce(null);
    mockUsersRepository.save.mockResolvedValueOnce(expectedUser);

    // Act
    const createdUser = await service.create(payload);

    // Assert
    expect(createdUser).toEqual(expectedUser);
  });

  it('should throw error if on user creation email is already taken', async () => {
    // Arrange
    const payload: CreateUserDto = {
      email: 'test@mail.com',
      password: 'secretPassword',
    };

    const generateUser = () => {
      const user = new User();
      user.email = payload.email;
      user.id = randomUUID();
      user.password = payload.password;

      return user;
    };

    const savedUser = generateUser();

    mockUsersRepository.findOne.mockResolvedValueOnce(savedUser);

    // Act / Assert
    await expect(service.create(payload)).rejects.toThrowError(
      new UserAlreadyRegisteredError(),
    );
  });
});
