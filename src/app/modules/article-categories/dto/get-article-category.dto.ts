import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetArticleCategoryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter Article categories by name.',
    example: 'Technology',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;
}

export class GetArticleCategoryDto extends IntersectionType(
  GetArticleCategoryBaseDto,
  PaginationQueryDto,
) {}
