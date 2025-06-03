import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetResearchAndPublicationBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the title of the research or publication.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by publisher name.',
    example: 'Springer',
  })
  @IsOptional()
  @IsString({ message: 'Publisher must be a string.' })
  publisher?: string;

  @ApiPropertyOptional({
    description: 'Filter by journal name.',
    example: 'International Journal of Web Development',
  })
  @IsOptional()
  @IsString({ message: 'Journal must be a string.' })
  journal?: string;

  @ApiPropertyOptional({
    description: 'Filter by DOI (Digital Object Identifier).',
    example: '10.1000/j.journal.2024.01.001',
  })
  @IsOptional()
  @IsString({ message: 'DOI must be a string.' })
  doi?: string;

  @ApiPropertyOptional({
    description: 'Filter by tags (comma-separated).',
    example: 'NestJS,API,Backend',
  })
  @IsOptional()
  @IsString({ message: 'Tags must be a string.' })
  tags?: string;
}

export class GetResearchAndPublicationDto extends IntersectionType(
  GetResearchAndPublicationBaseDto,
  PaginationQueryDto,
) {}
