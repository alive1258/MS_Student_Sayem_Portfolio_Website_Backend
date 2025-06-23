import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateResearchAndPublicationDto {
  @ApiProperty({
    description: 'Title of the research or publication.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @ApiProperty({
    description: 'Publisher of the research or publication.',
    example: 'Springer',
  })
  @IsString({ message: 'Publisher must be a string.' })
  @IsNotEmpty({ message: 'Publisher is required.' })
  publisher: string;

  @ApiProperty({
    description: 'Name of the journal where it was published.',
    example: 'International Journal of Web Development',
  })
  @IsString({ message: 'Journal name must be a string.' })
  @IsNotEmpty({ message: 'Journal is required.' })
  journal: string;

  @ApiPropertyOptional({
    description: 'DOI (Digital Object Identifier) for the publication.',
    example: '10.1000/j.journal.2024.01.001',
  })
  @IsOptional()
  @IsString({ message: 'DOI must be a string if provided.' })
  doi: string;

  @ApiProperty({
    description: 'Tags related to the research, comma-separated.',
    example: 'NestJS,API,Backend',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Filename or URL of the thumbnail image for the publication.',
    example: 'publication-thumbnail.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string if provided.' })
  thumbnail?: string;

  @ApiProperty({
    description: 'Link to the published paper or article.',
    example: 'https://journals.org/article/12345',
  })
  @IsString({ message: 'Paper link must be a string.' })
  @IsNotEmpty({ message: 'Paper link is required.' })
  paper_link: string;
}
