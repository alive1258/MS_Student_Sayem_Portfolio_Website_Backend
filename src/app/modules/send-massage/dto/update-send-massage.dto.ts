import { PartialType } from '@nestjs/swagger';
import { CreateSendMassageDto } from './create-send-massage.dto';

export class UpdateSendMassageDto extends PartialType(CreateSendMassageDto) {}
