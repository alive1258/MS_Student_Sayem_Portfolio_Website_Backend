import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Filter fields for retrieving educational collaboration records.
 */
class GetSendMassageBaseDto {
  @ApiPropertyOptional({
    description: 'Full name of the sender.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Valid email address of the sender.',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Message or description provided by the sender.',
    example: 'I am interested in your services and would like to connect.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * DTO for fetching filtered and paginated educational collaboration data.
 */
export class GetSendMassageDto extends IntersectionType(
  GetSendMassageBaseDto,
  PaginationQueryDto,
) {}
