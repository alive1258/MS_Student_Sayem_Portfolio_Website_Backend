import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';

@Module({
  controllers: [ExperienceController],
  providers: [ExperienceService],
  imports: [TypeOrmModule.forFeature([Experience])],
  exports: [ExperienceService],
})
export class ExperienceModule {}
