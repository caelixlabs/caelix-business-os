import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

@Injectable()
export class PasswordHasherService {
  hash(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
  }

  compare(plainTextPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hash);
  }
}
