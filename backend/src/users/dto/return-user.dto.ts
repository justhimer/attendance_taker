import { OmitType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class ReturnUserDto extends OmitType(User, ['password']) { }