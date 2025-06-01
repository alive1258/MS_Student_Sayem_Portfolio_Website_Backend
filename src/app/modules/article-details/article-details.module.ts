import { Module } from '@nestjs/common';
import { ArticleDetailsService } from './article-details.service';
import { ArticleDetailsController } from './article-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleDetail } from './entities/article-detail.entity';

@Module({
  controllers: [ArticleDetailsController],
  providers: [ArticleDetailsService],
  exports: [ArticleDetailsService],
  imports: [TypeOrmModule.forFeature([ArticleDetail])],
})
export class ArticleDetailsModule {}
