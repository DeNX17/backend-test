import { IsString, MinLength } from 'class-validator';
import { User } from 'src/auth/user.entity';

export class CreateMessageDto {
  author: User;

  @IsString()
  @MinLength(1)
  text: string;
}
