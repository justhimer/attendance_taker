import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { checkPasswordBcrypt } from 'src/utils/security/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  invalidAuthReason = {
    USER_NOT_FOUND: "User not found",
    INVALID_PASSWORD: "Invalid password",
  }

  async validateUser(email: string, password: string): Promise<User> {
    try{
      const foundUser = await this.usersService.find({ email });
      if (!foundUser) {
        throw this.invalidAuthReason.USER_NOT_FOUND;
      }
  
      const passwordMatch = await checkPasswordBcrypt(password, foundUser.password);
      if (!passwordMatch) {
        throw this.invalidAuthReason.INVALID_PASSWORD;
      }
  
      return foundUser;
    } catch (error) {
      throw new Error(error);
    }

  }

  async generateToken(payload: {id: number}) {
    return await this.jwtService.signAsync(payload);
  }
}
