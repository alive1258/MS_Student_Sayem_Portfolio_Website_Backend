import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { SendMassageService } from './send-massage.service';
import { CreateSendMassageDto } from './dto/create-send-massage.dto';
import { UpdateSendMassageDto } from './dto/update-send-massage.dto';
import { GetSendMassageDto } from './dto/get-send-massage.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('send-messages') // ✅ Corrected endpoint
export class SendMassageController {
  constructor(private readonly sendMassageService: SendMassageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a message.' })
  @ApiResponse({ status: 201, description: 'Message created successfully.' })
  create(@Body() dto: CreateSendMassageDto) {
    return this.sendMassageService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetSendMassageDto) {
    return this.sendMassageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendMassageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSendMassageDto) {
    return this.sendMassageService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendMassageService.remove(+id);
  }
}
