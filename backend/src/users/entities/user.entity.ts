import { IsInt, IsString } from 'class-validator';

export class User {
  @IsInt()
  id: number;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  contact?: string;
}
