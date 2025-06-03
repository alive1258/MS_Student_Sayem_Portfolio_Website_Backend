import { Module } from '@nestjs/common';
import { ProjectDetailsService } from './project-details.service';
import { ProjectDetailsController } from './project-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDetail } from './entities/project-detail.entity';

@Module({
  controllers: [ProjectDetailsController],
  providers: [ProjectDetailsService],
  exports: [ProjectDetailsService],
  imports: [TypeOrmModule.forFeature([ProjectDetail])],
})
export class ProjectDetailsModule {}
