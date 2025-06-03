import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionDescriptionDto {
  /**
   * Name of the skill category (e.g., Faculty or Department)
   */
  @ApiProperty({
    description: 'Name of the faculty or department.',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
