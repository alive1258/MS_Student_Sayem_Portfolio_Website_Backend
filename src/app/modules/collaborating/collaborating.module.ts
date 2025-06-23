import { Module } from '@nestjs/common';
import { CollaboratingService } from './collaborating.service';
import { CollaboratingController } from './collaborating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Collaborating } from './entities/collaborating.entity';

@Module({
  controllers: [CollaboratingController],
  providers: [CollaboratingService],
  imports: [TypeOrmModule.forFeature([Collaborating])],
  exports: [CollaboratingService],
})
export class CollaboratingModule {}
