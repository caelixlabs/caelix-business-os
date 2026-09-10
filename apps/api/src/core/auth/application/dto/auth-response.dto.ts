import { User } from '@/core/users/domain/entities/user.entity';
import { UserResponseDto } from '@/core/users/application/dto/user-response.dto';
import { Session } from '../services/auth-session.service';

export class AuthResponseDto {
  user!: UserResponseDto;
  accessToken!: string;
  refreshToken!: string;
  tokenType!: 'Bearer';
  roles!: string[];
  permissions!: string[];

  static from(user: User, session: Session): AuthResponseDto {
    const dto = new AuthResponseDto();
    dto.user = UserResponseDto.fromDomain(user);
    dto.accessToken = session.accessToken;
    dto.refreshToken = session.refreshToken;
    dto.tokenType = session.tokenType;
    dto.roles = session.roles;
    dto.permissions = session.permissions;
    return dto;
  }
}
