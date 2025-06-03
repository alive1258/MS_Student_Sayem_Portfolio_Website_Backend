import { PartialType } from '@nestjs/swagger';
import { CreateResearchAndPublicationDto } from './create-research-and-publication.dto';

export class UpdateResearchAndPublicationDto extends PartialType(CreateResearchAndPublicationDto) {}
