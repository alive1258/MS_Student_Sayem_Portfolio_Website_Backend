import { Module } from '@nestjs/common';
import { ProjectCategoriesService } from './project-categories.service';
import { ProjectCategoriesController } from './project-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectCategory } from './entities/project-category.entity';

@Module({
  controllers: [ProjectCategoriesController],
  providers: [ProjectCategoriesService],
  exports: [ProjectCategoriesService],
  imports: [TypeOrmModule.forFeature([ProjectCategory])],
})
export class ProjectCategoriesModule {}
