import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateSendMassageDto {
  @ApiProperty({
    description: 'Full name of the sender.',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Valid email address of the sender.',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Message or description provided by the sender.',
    example: 'I am interested in your services and would like to connect.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
