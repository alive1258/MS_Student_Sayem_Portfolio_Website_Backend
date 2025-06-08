import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ProjectCategoriesService } from './project-categories.service';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';

import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetProjectCategoryDto } from './dto/get-project-category.dto';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';

@Controller('project-categories')
export class ProjectCategoriesController {
  constructor(
    private readonly projectCategoriesService: ProjectCategoriesService,
  ) {}

  // ✅ Create new articleCategory (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  @ApiOperation({ summary: 'Create a new articleCategory' })
  @ApiResponse({
    status: 200,
    description: 'articleCategory created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  create(
    @Req() req: Request,
    @Body() createProjectCategoryDto: CreateProjectCategoryDto,
  ) {
    return this.projectCategoriesService.create(req, createProjectCategoryDto);
  }

  // ✅ Get all article Category (Public)
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
  @ApiOperation({ summary: 'Get all articleCategory with pagination & search' })
  @ApiResponse({
    status: 200,
    description: 'articleCategory retrieved successfully.',
  })
  findAll(@Query() getProjectCategoryDto: GetProjectCategoryDto) {
    return this.projectCategoriesService.findAll(getProjectCategoryDto);
  }

  // ✅ Get single articleCategory by ID (Public)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'articleCategory ID',
  })
  @ApiOperation({ summary: 'Get a articleCategory by ID' })
  @ApiResponse({
    status: 200,
    description: 'articleCategory retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'articleCategory not found.' })
  findOne(@Param('id') id: string) {
    return this.projectCategoriesService.findOne(id);
  }

  // ✅ Update articleCategory by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60 } })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'articleCategory ID to update',
  })
  @ApiOperation({ summary: 'Update a articleCategory by ID' })
  @ApiResponse({
    status: 200,
    description: 'articleCategory updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or ID format.' })
  @ApiResponse({ status: 404, description: 'articleCategory not found.' })
  update(
    @Param('id') id: string,
    @Body() updateProjectCategoryDto: UpdateProjectCategoryDto,
  ) {
    return this.projectCategoriesService.update(id, updateProjectCategoryDto);
  }

  // ✅ Delete articleCategory by ID (Protected)
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60 } })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
    description: 'articleCategory ID to delete',
  })
  @ApiOperation({ summary: 'Delete a articleCategory by ID' })
  @ApiResponse({
    status: 200,
    description: 'articleCategory deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'articleCategory not found.' })
  remove(@Param('id') id: string) {
    return this.projectCategoriesService.remove(id);
  }
}
