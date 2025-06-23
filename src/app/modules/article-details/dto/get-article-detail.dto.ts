import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetArticleDetailBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the title of the Article detail.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the title of the Article detail.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Points must be a string.' })
  points?: string;

  @ApiPropertyOptional({
    description: 'meta_key related to the article post, comma-separated.',
    example: 'NestJS,API,Backend',
  })
  @IsString({ message: 'Article meta_key must be a string.' })
  @IsOptional()
  meta_key?: string;

  @ApiPropertyOptional({
    description: 'meta_title related to the article post, comma-separated.',
    example: 'NestJS,API,Backend',
  })
  @IsString({ message: 'Article meta_title must be a string.' })
  @IsOptional()
  meta_title?: string;

  @ApiPropertyOptional({
    description:
      'meta_description related to the article post, comma-separated.',
    example: 'NestJS,API,Backend',
  })
  @IsString({ message: 'Article meta_description must be a string.' })
  @IsOptional()
  meta_description?: string;

  @ApiPropertyOptional({
    description: 'Filter by the description of the Article detail.',
    example: 'john-doe',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by the photo URL or filename of the Article detail.',
    example: 'john-doe.jpg',
  })
  @ApiPropertyOptional({
    description: 'Filter by the Article ID.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'Article ID must be a string.' })
  article_id?: string;
}

export class GetArticleDetailDto extends IntersectionType(
  GetArticleDetailBaseDto,
  PaginationQueryDto,
) {}
