import { PartialType } from '@nestjs/swagger';
import { CreateSectionDescriptionDto } from './create-section-description.dto';

export class UpdateSectionDescriptionDto extends PartialType(CreateSectionDescriptionDto) {}
