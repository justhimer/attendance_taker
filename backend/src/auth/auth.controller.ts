import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService, invalidAuthReason } from './auth.service';
import { Response, SuccessHttpStatus } from 'src/utils/api/response';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async authenticate(@Body() authRequest: AuthRequest) {
    try{
      const validationResult = await this.authService.validateUser(authRequest.email, authRequest.password);
      if (!validationResult.isValid) {
        if (!validationResult.invalidReason) {
          throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          switch (validationResult.invalidReason) {
            case invalidAuthReason.USER_NOT_FOUND:
              throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            case invalidAuthReason.INVALID_PASSWORD:
              throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
            default:
              throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      }

      if (!validationResult.validatedUser) {
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
      const payload = { id: validationResult.validatedUser.id}
      const token = await this.authService.generateToken(payload);

      const returnData: AuthResponse = {
        token,
        user: {
          id: validationResult.validatedUser.id,
        }
      }

      return new Response(SuccessHttpStatus.OK, returnData);
    } catch (error) {
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
