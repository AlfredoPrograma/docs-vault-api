import { UsersService } from '@/users/users.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

import {
  CreateUserDto,
  SignInResponse,
  SignInUserDto,
} from '@/core/models/user';

import { AuthService } from '../auth.service';
import { EncryptService } from '../encrypt.service';
import { InvalidCredentialsException } from '../errors/auth.errors';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = createMock<UsersService>();
  const mockEncryptService = createMock<EncryptService>();
  const mockJwtService = createMock<JwtService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EncryptService,
          useValue: mockEncryptService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    // Arrange
    const createUserPayload: CreateUserDto = {
      email: 'test@mail.com',
      password: '123456',
    };

    mockEncryptService.encryptPassword.mockResolvedValue('encryptedPassword');

    mockUsersService.create.mockResolvedValue({
      id: randomUUID(),
      email: createUserPayload.email,
      password: 'encryptedPassword',
    });

    // Act
    const registeredUser = await service.signUp(createUserPayload);

    // Assert
    expect(registeredUser).not.toBeNull();
    expect(registeredUser.id).toBeDefined();
    expect(registeredUser.password).not.toEqual(createUserPayload.password);
  });

  it('should sign in a user', async () => {
    // Arrange
    const signInUserPayload: SignInUserDto = {
      email: 'test@mail.com',
      password: '123456',
    };

    const signedInUserResponse: SignInResponse = {
      accessToken: 'token',
      user: {
        id: expect.any(String),
        email: signInUserPayload.email,
      },
    };

    mockUsersService.findByEmail.mockResolvedValue({
      id: randomUUID(),
      email: signInUserPayload.email,
      password: 'encryptedPassword',
    });

    mockEncryptService.validatePassword.mockResolvedValue(true);
    mockJwtService.signAsync.mockResolvedValue('token');

    // Act
    const signInResponse = await service.signIn(signInUserPayload);

    // Assert
    expect(signInResponse).toEqual(signedInUserResponse);
  });

  it('should throw InvalidCredentialsException if target user is not found', async () => {
    // Arrange
    const signInUserPayload: SignInUserDto = {
      email: 'test@mail.com',
      password: '123456',
    };

    mockUsersService.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(service.signIn(signInUserPayload)).rejects.toThrowError(
      new InvalidCredentialsException(),
    );
  });

  it('should throw InvalidCredentialsException if given password is invalid', async () => {
    // Arrange
    const signInUserPayload: SignInUserDto = {
      email: 'test@mail.com',
      password: '123456',
    };

    mockUsersService.findByEmail.mockResolvedValue({
      id: randomUUID(),
      email: signInUserPayload.email,
      password: 'encryptedPassword',
    });

    mockEncryptService.validatePassword.mockResolvedValue(false);

    // Act & Assert
    await expect(service.signIn(signInUserPayload)).rejects.toThrowError(
      new InvalidCredentialsException(),
    );
  });
});
