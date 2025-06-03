import { Module } from '@nestjs/common';
import { ResearchAndPublicationsService } from './research-and-publications.service';
import { ResearchAndPublicationsController } from './research-and-publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchAndPublication } from './entities/research-and-publication.entity';

@Module({
  controllers: [ResearchAndPublicationsController],
  providers: [ResearchAndPublicationsService],
  exports: [ResearchAndPublicationsService],
  imports: [TypeOrmModule.forFeature([ResearchAndPublication])],
})
export class ResearchAndPublicationsModule {}
