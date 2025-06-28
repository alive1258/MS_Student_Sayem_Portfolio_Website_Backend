import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetArticleDto } from './dto/get-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // ✅ Protected endpoint for creating a Work Gallery entry
  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FileInterceptor('thumbnail')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new article.' })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Article already exists.' })
  create(
    @Req() req: Request,
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.articlesService.create(req, createArticleDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all articles with filters and pagination.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '10' })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'John' })
  @ApiQuery({
    name: 'anyFilterField',
    required: false,
    type: String,
    example: 'active',
    description: 'Any custom filter field (e.g., status).',
  })
  findAll(@Query() getArticleDto: GetArticleDto) {
    return this.articlesService.findAll(getArticleDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single article by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Article ID.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Article found.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findOne(slug);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a article by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Article ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Article updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.articlesService.update(id, updateArticleDto, file);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a article by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Article ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Article deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
