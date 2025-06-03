import { Module } from '@nestjs/common';
import { SectionDescriptionService } from './section-description.service';
import { SectionDescriptionController } from './section-description.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionDescription } from './entities/section-description.entity';

@Module({
  controllers: [SectionDescriptionController],
  providers: [SectionDescriptionService],
  exports: [SectionDescriptionService],
  imports: [TypeOrmModule.forFeature([SectionDescription])],
})
export class SectionDescriptionModule {}
