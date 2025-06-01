import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDetailDto {
  @ApiProperty({
    description: 'Title of the article post.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsString({ message: 'article title must be a string.' })
  @IsNotEmpty({ message: 'article title is required.' })
  title: string;

  @ApiProperty({
    description: 'Points of the article post.',
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
    description: 'Description or content summary of the article post.',
    example:
      'This article post explains how to create a RESTful API using NestJS...',
  })
  @IsString({ message: 'article description must be a string.' })
  @IsNotEmpty({ message: 'article description is required.' })
  description: string;

  @ApiPropertyOptional({
    description: 'Filename or URL of the thumbnail image for the article post.',
    example: 'article-thumbnail.jpg',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photo?: string[];

  @ApiProperty({
    description: 'ID of the article  associated with this article post.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'article  ID must be a string.' })
  @IsNotEmpty({ message: 'article  ID is required.' })
  article_id: string;
}
