import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDetailDto {
  @ApiProperty({
    description: 'Title of the project post.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsString({ message: 'project title must be a string.' })
  @IsNotEmpty({ message: 'project title is required.' })
  title: string;

  @ApiProperty({
    description: 'Points of the project post.',
    example: [
      'Learn NestJS routing',
      'Use DTOs for validation',
      'Implement authentication',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  points: string[];

  @ApiProperty({
    description: 'Description or content summary of the project post.',
    example:
      'This project post explains how to create a RESTful API using NestJS...',
  })
  @IsString({ message: 'project description must be a string.' })
  @IsNotEmpty({ message: 'project description is required.' })
  description: string;

  @ApiPropertyOptional({
    description: 'Filename or URL of the thumbnail image for the project post.',
    example: 'project-thumbnail.jpg',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photo?: string[];

  @ApiProperty({
    description: 'ID of the project  associated with this project post.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'project  ID must be a string.' })
  @IsNotEmpty({ message: 'project  ID is required.' })
  project_id: string;
}
