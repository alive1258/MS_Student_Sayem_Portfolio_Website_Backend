import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetArticleBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the article title.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsOptional()
  @IsString({ message: 'Article title must be a string.' })
  article_title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the article slug.',
    example: 'how-to-build-a-rest-api-with-nestjs',
  })
  @IsOptional()
  @IsString({ message: 'Slug must be a string.' })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Filter by article description.',
    example: 'A guide on creating REST APIs with NestJS.',
  })
  @IsOptional()
  @IsString({ message: 'Article description must be a string.' })
  article_description?: string;

  @ApiPropertyOptional({
    description: 'Filter by article tags (comma-separated).',
    example: 'NestJS,API,Backend',
  })
  @IsOptional()
  @IsString({ message: 'Article tags must be a string.' })
  article_tags?: string;

  @ApiPropertyOptional({
    description: 'Filter by estimated reading time.',
    example: '5 min',
  })
  @IsOptional()
  @IsString({ message: 'Reading time must be a string.' })
  publish_time?: string;
}

export class GetArticleDto extends IntersectionType(
  GetArticleBaseDto,
  PaginationQueryDto,
) {}
