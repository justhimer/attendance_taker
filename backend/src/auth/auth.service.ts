import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { checkPasswordBcrypt } from 'src/utils/security/bcrypt';

export enum invalidAuthReason {
  USER_NOT_FOUND = "User not found",
  INVALID_PASSWORD = "Invalid password",
}

export interface AuthResponse {
  isValid: boolean;
  invalidReason?: invalidAuthReason;
  user?: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthResponse> {
    let isValid = true;
    let invalidReason: invalidAuthReason = null;
    try{
      const foundUser = await this.usersService.find({ email });
      if (!foundUser) {
        isValid = false;
        invalidReason = invalidAuthReason.USER_NOT_FOUND;
      }
  
      const passwordMatch = await checkPasswordBcrypt(password, foundUser.password);
      if (!passwordMatch) {
        isValid = false;
        invalidReason = invalidAuthReason.INVALID_PASSWORD;
      }
  
      return {
        isValid,
        invalidReason,
        user: foundUser,
      } 
    } catch (error) {
      throw new Error(error);
    }

  }

  async generateToken(payload: {id: number}) {
    return await this.jwtService.signAsync(payload);
  }
}
