import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSkillDto {
  /**
   * Title of the skill
   */
  @ApiProperty({
    description: 'Title of the skill',
    example: 'JavaScript',
  })
  @IsString()
  @IsNotEmpty()
  skill_title: string;

  /**
   * Amount or level of the skill
   */
  @ApiProperty({
    description: 'Amount or level of the skill',
    example: 'Advanced',
  })
  @IsNumber()
  @IsNotEmpty()
  skill_amount: number;

  /**
   * Foreign key ID of the related skill category
   */
  @ApiProperty({
    description: 'ID of the related skill category',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  skills_category_id: string;
}
