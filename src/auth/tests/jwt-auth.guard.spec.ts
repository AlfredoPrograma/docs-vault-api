import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthGuard } from '../jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import {
  InvalidTokenException,
  MalformedTokenException,
} from '../errors/jwt-auth.errors';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockExecutionContext = createMock<ExecutionContext>();
  const mockJwtService = createMock<JwtService>();
  const mockReflector = createMock<Reflector>();
  const mockConfigService = createMock<ConfigService<Environment>>();

  beforeEach(async () => {
    guard = new JwtAuthGuard(mockConfigService, mockJwtService, mockReflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if request it not private', async () => {
    // Arrange
    mockReflector.getAllAndOverride.mockReturnValueOnce(false);

    // Act
    const isValid = await guard.canActivate(mockExecutionContext);

    // Assert
    expect(isValid).toBe(true);
  });

  it('should return true if request it private and token is valid', async () => {
    // Arrange
    mockReflector.getAllAndOverride.mockReturnValueOnce(true);

    mockExecutionContext.getType.mockReturnValueOnce('http');
    mockExecutionContext.switchToHttp.mockReturnValueOnce({
      getNext: jest.fn(),
      getResponse: jest.fn(),
      getRequest: jest.fn().mockReturnValueOnce({
        headers: {
          authorization: 'Bearer randomtoken',
        },
      }),
    });

    mockJwtService.verifyAsync.mockResolvedValueOnce({
      id: '123',
    });

    // Act
    const isValid = await guard.canActivate(mockExecutionContext);

    // Assert
    expect(isValid).toBe(true);
  });

  it('should throw an error if request is private and token malformed', async () => {
    // Arrange
    mockReflector.getAllAndOverride.mockReturnValueOnce(true);

    mockExecutionContext.getType.mockReturnValueOnce('http');
    mockExecutionContext.switchToHttp.mockReturnValueOnce({
      getNext: jest.fn(),
      getResponse: jest.fn(),
      getRequest: jest.fn().mockReturnValueOnce({
        headers: {
          authorization: 'malformedtoken',
        },
      }),
    });

    // Act & Assert
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError(
      new MalformedTokenException(),
    );
  });

  it('should throw an error if request is private and token is expired/invalid', async () => {
    // Arrange
    mockReflector.getAllAndOverride.mockReturnValueOnce(true);

    mockExecutionContext.getType.mockReturnValueOnce('http');
    mockExecutionContext.switchToHttp.mockReturnValueOnce({
      getNext: jest.fn(),
      getResponse: jest.fn(),
      getRequest: jest.fn().mockReturnValueOnce({
        headers: {
          authorization: 'Bearer expiredToken',
        },
      }),
    });

    mockJwtService.verifyAsync.mockRejectedValueOnce(new Error());

    // Act & Assert
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError(
      new InvalidTokenException(),
    );
  });
});
