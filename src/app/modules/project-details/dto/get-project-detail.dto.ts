import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetProjectDetailBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the title of the project detail.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the title of the project detail.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Points must be a string.' })
  points?: string;

  @ApiPropertyOptional({
    description: 'Filter by the description of the project detail.',
    example: 'john-doe',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by the photo URL or filename of the project detail.',
    example: 'john-doe.jpg',
  })
  @ApiPropertyOptional({
    description: 'Filter by the project ID.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'project ID must be a string.' })
  project_id?: string;
}

export class GetProjectDetailDto extends IntersectionType(
  GetProjectDetailBaseDto,
  PaginationQueryDto,
) {}
