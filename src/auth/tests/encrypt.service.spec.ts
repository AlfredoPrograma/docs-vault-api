import { Test, TestingModule } from '@nestjs/testing';
import { EncryptService } from '../encrypt.service';

describe('EncryptService', () => {
  let service: EncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptService],
    }).compile();

    service = module.get<EncryptService>(EncryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return encrypted password', async () => {
    // Arrange
    const password = '123456';

    // Act
    const expectedPassword = await service.encryptPassword(password);

    // Assert
    expect(expectedPassword).not.toBeNull();
    expect(expectedPassword).not.toEqual(password);
  });

  it('should return true when password is valid', async () => {
    // Arrange
    const password = '123456';
    const encryptedPassword = await service.encryptPassword(password);

    // Act
    const isValid = await service.validatePassword(password, encryptedPassword);

    // Assert
    expect(isValid).toBe(true);
  });

  it('should return false when password is invalid', async () => {
    // Arrange
    const password = '123456';
    const invalidPassword = '1nvalid';
    const encryptedPassword = await service.encryptPassword(password);

    // Act
    const isValid = await service.validatePassword(
      invalidPassword,
      encryptedPassword,
    );

    // Assert
    expect(isValid).toBe(false);
  });
});
