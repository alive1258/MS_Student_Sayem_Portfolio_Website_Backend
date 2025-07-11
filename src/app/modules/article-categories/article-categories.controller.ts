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
import { ArticleCategoriesService } from './article-categories.service';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetArticleCategoryDto } from './dto/get-article-category.dto';

@Controller('article-categories')
export class ArticleCategoriesController {
  constructor(
    private readonly articleCategoriesService: ArticleCategoriesService,
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
    @Body() createArticleCategoryDto: CreateArticleCategoryDto,
  ) {
    return this.articleCategoriesService.create(req, createArticleCategoryDto);
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
  findAll(@Query() getArticleCategoryDto: GetArticleCategoryDto) {
    return this.articleCategoriesService.findAll(getArticleCategoryDto);
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
    return this.articleCategoriesService.findOne(id);
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
    @Body() updateArticleCategoryDto: UpdateArticleCategoryDto,
  ) {
    return this.articleCategoriesService.update(id, updateArticleCategoryDto);
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
    return this.articleCategoriesService.remove(id);
  }
}
