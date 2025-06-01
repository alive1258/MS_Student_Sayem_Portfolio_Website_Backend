import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetProjectBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the project title.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsOptional()
  @IsString({ message: 'project title must be a string.' })
  project_title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the project slug.',
    example: 'how-to-build-a-rest-api-with-nestjs',
  })
  @IsOptional()
  @IsString({ message: 'Slug must be a string.' })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Filter by project description.',
    example: 'A guide on creating REST APIs with NestJS.',
  })
  @IsOptional()
  @IsString({ message: 'project description must be a string.' })
  project_description?: string;

  @ApiPropertyOptional({
    description: 'Filter by project tags (comma-separated).',
    example: 'NestJS,API,Backend',
  })
  @IsOptional()
  @IsString({ message: 'project tags must be a string.' })
  project_tags?: string;

  @ApiPropertyOptional({
    description: 'Filter by estimated reading time.',
    example: '5 min',
  })
  @IsOptional()
  @IsString({ message: 'Reading time must be a string.' })
  publish_time?: string;

  @ApiPropertyOptional({
    description: 'Filter by project category ID.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsOptional()
  @IsString({ message: 'project category ID must be a string.' })
  project_category_id?: string;
}

export class GetProjectDto extends IntersectionType(
  GetProjectBaseDto,
  PaginationQueryDto,
) {}
