import { Module } from '@nestjs/common';
import { CollaboratingService } from './collaborating.service';
import { CollaboratingController } from './collaborating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborate } from '../collaborate/entities/collaborate.entity';

@Module({
  controllers: [CollaboratingController],
  providers: [CollaboratingService],
  imports: [TypeOrmModule.forFeature([Collaborate])],
  exports: [CollaboratingService],
})
export class CollaboratingModule {}
