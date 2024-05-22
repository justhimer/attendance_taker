import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, SuccessHttpStatus } from 'src/utils/api/Response';
import { AuthRequest } from './entities/authRequest.entity';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    phone?: string;
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('')
  async authenticate(@Body() authRequest: AuthRequest) {
    try{
      Logger.log(`Authenticating user: ${authRequest.email}`);
      
      const foundUser = await this.authService.validateUser(authRequest.email, authRequest.password);
  
      const payload = { id: foundUser.id }
      const token = await this.authService.generateToken(payload);

      const returnData: AuthResponse = {
        token,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          phone: foundUser.phone,
        }
      }

      return new Response(SuccessHttpStatus.OK, returnData);
    } catch (error) {
      Logger.error(error.message);
      if (error.message === this.authService.invalidAuthReason.USER_NOT_FOUND) {
        error.status = HttpStatus.NOT_FOUND;
      }
      if (error.message === this.authService.invalidAuthReason.INVALID_PASSWORD) {
        error.status = HttpStatus.UNAUTHORIZED;
      }
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
