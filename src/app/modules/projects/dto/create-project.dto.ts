import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Title of the project post.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsString({ message: 'project title must be a string.' })
  @IsNotEmpty({ message: 'project title is required.' })
  project_title: string;

  @ApiProperty({
    description: 'URL-friendly slug for the project post.',
    example: 'how-to-build-a-rest-api-with-nestjs',
  })
  @IsString({ message: 'Slug must be a string.' })
  @IsNotEmpty({ message: 'Slug is required.' })
  slug: string;

  @ApiProperty({
    description: 'Description or content summary of the project post.',
    example:
      'This project post explains how to create a RESTful API using NestJS...',
  })
  @IsString({ message: 'project description must be a string.' })
  @IsNotEmpty({ message: 'project description is required.' })
  project_description: string;

  @ApiProperty({
    description: 'Tags related to the project post, comma-separated.',
    example: 'NestJS,API,Backend',
  })
  @IsString({ message: 'project tags must be a string.' })
  @IsOptional()
  project_tags?: string;

  @ApiProperty({
    description: 'Estimated publish time for the project post.',
    example: '5 min',
  })
  @IsString({ message: 'Reading time must be a string.' })
  @IsNotEmpty({ message: 'Reading time is required.' })
  publish_time: string;

  @ApiPropertyOptional({
    description: 'Filename or URL of the thumbnail image for the project post.',
    example: 'project-thumbnail.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string if provided.' })
  thumbnail?: string;

  @ApiProperty({
    description:
      'ID of the project category associated with this project post.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'project category ID must be a string.' })
  @IsNotEmpty({ message: 'project category ID is required.' })
  project_category_id: string;
}
