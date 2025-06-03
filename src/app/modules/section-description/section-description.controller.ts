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
import { SectionDescriptionService } from './section-description.service';
import { CreateSectionDescriptionDto } from './dto/create-section-description.dto';
import { UpdateSectionDescriptionDto } from './dto/update-section-description.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetSectionDescriptionDto } from './dto/get-section-description.dto';

@Controller('section-description')
export class SectionDescriptionController {
  constructor(
    private readonly sectionDescriptionService: SectionDescriptionService,
  ) {}

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a new snapshots category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  create(
    @Req() req: Request,
    @Body() createSectionDescriptionDto: CreateSectionDescriptionDto,
  ) {
    return this.sectionDescriptionService.create(
      req,
      createSectionDescriptionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve paginated list of snapshot categories' })
  @ApiResponse({ status: 200, description: 'List retrieved successfully' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number to retrieve',
    example: 1,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search keyword',
    example: 'First',
  })
  findAll(@Query() getSectionDescriptionDto: GetSectionDescriptionDto) {
    return this.sectionDescriptionService.findAll(getSectionDescriptionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single snapshots category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the snapshots category',
    example: '64b1c2e5c2f94f0ad9a45d12',
  })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.sectionDescriptionService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Patch(':id')
  @ApiOperation({ summary: 'Update a snapshots category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the snapshots category',
    example: '64b1c2e5c2f94f0ad9a45d12',
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update data or ID' })
  update(
    @Param('id') id: string,
    @Body() updateSectionDescriptionDto: UpdateSectionDescriptionDto,
  ) {
    return this.sectionDescriptionService.update(
      id,
      updateSectionDescriptionDto,
    );
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a snapshots category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the snapshots category to delete',
    example: '64b1c2e5c2f94f0ad9a45d12',
  })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string) {
    return this.sectionDescriptionService.remove(id);
  }
}
