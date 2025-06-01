import { Module } from '@nestjs/common';
import { ProjectDetailsService } from './project-details.service';
import { ProjectDetailsController } from './project-details.controller';

@Module({
  controllers: [ProjectDetailsController],
  providers: [ProjectDetailsService],
})
export class ProjectDetailsModule {}
