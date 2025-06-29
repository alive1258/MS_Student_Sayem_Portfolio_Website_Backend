import { Module } from '@nestjs/common';
import { SendMassageService } from './send-massage.service';
import { SendMassageController } from './send-massage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendMessage } from './entities/send-massage.entity';

@Module({
  controllers: [SendMassageController],
  providers: [SendMassageService],
  imports: [TypeOrmModule.forFeature([SendMessage])],
  exports: [SendMassageService],
})
export class SendMassageModule {}
