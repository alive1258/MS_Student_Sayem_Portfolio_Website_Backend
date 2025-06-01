import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Title of the article post.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsString({ message: 'Article title must be a string.' })
  @IsNotEmpty({ message: 'Article title is required.' })
  article_title: string;

  @ApiProperty({
    description: 'URL-friendly slug for the article post.',
    example: 'how-to-build-a-rest-api-with-nestjs',
  })
  @IsString({ message: 'Slug must be a string.' })
  @IsNotEmpty({ message: 'Slug is required.' })
  slug: string;

  @ApiProperty({
    description: 'Description or content summary of the article post.',
    example:
      'This article post explains how to create a RESTful API using NestJS...',
  })
  @IsString({ message: 'Article description must be a string.' })
  @IsNotEmpty({ message: 'Article description is required.' })
  article_description: string;

  @ApiProperty({
    description: 'Tags related to the article post, comma-separated.',
    example: 'NestJS,API,Backend',
  })
  @IsString({ message: 'Article tags must be a string.' })
  @IsOptional()
  article_tags?: string;

  @ApiProperty({
    description: 'Estimated publish time for the article post.',
    example: '5 min',
  })
  @IsString({ message: 'Reading time must be a string.' })
  @IsNotEmpty({ message: 'Reading time is required.' })
  publish_time: string;

  @ApiPropertyOptional({
    description: 'Filename or URL of the thumbnail image for the article post.',
    example: 'article-thumbnail.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string if provided.' })
  thumbnail?: string;

  @ApiProperty({
    description:
      'ID of the article category associated with this article post.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'Article category ID must be a string.' })
  @IsNotEmpty({ message: 'Article category ID is required.' })
  article_category_id: string;
}
