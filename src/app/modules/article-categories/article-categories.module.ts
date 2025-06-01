import { Module } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';
import { ArticleCategoriesController } from './article-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategory } from './entities/article-category.entity';

@Module({
  controllers: [ArticleCategoriesController],
  providers: [ArticleCategoriesService],
  imports: [TypeOrmModule.forFeature([ArticleCategory])],
  exports: [ArticleCategoriesService],
})
export class ArticleCategoriesModule {}
