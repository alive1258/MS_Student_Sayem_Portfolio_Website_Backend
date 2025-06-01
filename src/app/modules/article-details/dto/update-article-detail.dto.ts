import { PartialType } from '@nestjs/swagger';
import { CreateArticleDetailDto } from './create-article-detail.dto';

export class UpdateArticleDetailDto extends PartialType(CreateArticleDetailDto) {}
