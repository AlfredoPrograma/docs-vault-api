import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  private encrypter = bcrypt;

  async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await this.encrypter.hash(password, 13);

    return encryptedPassword;
  }

  async validatePassword(
    plainPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    const isValid = await this.encrypter.compare(
      plainPassword,
      encryptedPassword,
    );

    return isValid;
  }
}
