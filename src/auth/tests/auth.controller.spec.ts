import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

import { SignInResponse, SignInUserDto, User } from '@/core/models/user';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = createMock<AuthService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a registered user', async () => {
    // Arrange
    const generateUser = () => {
      const user = new User();

      user.id = randomUUID();
      user.email = 'test@mail.com';
      user.password = 'encryptedPassword';

      return user;
    };

    const registeredUser = generateUser();

    mockAuthService.signUp.mockResolvedValueOnce(registeredUser);

    // Act
    const result = await controller.signUp(registeredUser);

    // Assert
    expect(result).toEqual(registeredUser);
  });

  it('should return signed in user and token', async () => {
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

    mockAuthService.signIn.mockResolvedValueOnce(signedInUserResponse);

    // Act
    const signInResponse = await controller.signIn(signInUserPayload);

    // Assert
    expect(signInResponse).toEqual(signedInUserResponse);
  });
});
