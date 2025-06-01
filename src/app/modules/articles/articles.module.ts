import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategory } from '../article-categories/entities/article-category.entity';
import { Article } from './entities/article.entity';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
  imports: [TypeOrmModule.forFeature([Article, ArticleCategory])],
})
export class ArticlesModule {}
