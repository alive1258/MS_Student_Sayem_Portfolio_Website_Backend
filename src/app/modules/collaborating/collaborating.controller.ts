import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CollaboratingService } from './collaborating.service';
import { CreateCollaboratingDto } from './dto/create-collaborating.dto';
import { UpdateCollaboratingDto } from './dto/update-collaborating.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetCollaborateDto } from '../collaborate/dto/get-collaborate.dto';

@Controller('collaborating')
export class CollaboratingController {
  constructor(private readonly collaboratingService: CollaboratingService) {}

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a new Collaborating' })
  @ApiResponse({
    status: 200,
    description: 'Collaborating created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  create(
    @Req() req: Request,
    @Body() createCollaboratingDto: CreateCollaboratingDto,
  ) {
    return this.collaboratingService.create(req, createCollaboratingDto);
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    example: 'Manager',
    description: 'Search keyword',
  })
  @ApiOperation({ summary: 'Get all Skills with pagination & search' })
  @ApiResponse({
    status: 200,
    description: 'Skills retrieved successfully.',
  })
  findAll(@Query() getCollaborateDto: GetCollaborateDto) {
    return this.collaboratingService.findAll(getCollaborateDto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Skills ID',
  })
  @ApiOperation({ summary: 'Get a Skills by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skills retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Skills not found.' })
  findOne(@Param('id') id: string) {
    return this.collaboratingService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Collaborate ID to update',
  })
  @ApiOperation({ summary: 'Update a Collaborate by ID' })
  @ApiResponse({
    status: 200,
    description: 'Collaborate updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or ID format.' })
  @ApiResponse({ status: 404, description: 'Collaborate not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCollaboratingDto: UpdateCollaboratingDto,
  ) {
    return this.collaboratingService.update(id, updateCollaboratingDto);
  }
  // ✅ Delete Skills by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'Skills ID to delete',
  })
  @ApiOperation({ summary: 'Delete a Skills by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skills deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'Skills not found.' })
  remove(@Param('id') id: string) {
    return this.collaboratingService.remove(id);
  }
}
