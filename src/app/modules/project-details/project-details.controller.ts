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
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProjectDetailsService } from './project-details.service';
import { CreateProjectDetailDto } from './dto/create-project-detail.dto';
import { UpdateProjectDetailDto } from './dto/update-project-detail.dto';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { IpDeviceThrottlerGuard } from 'src/app/auth/decorators/ip-device-throttler-guard';
import { Throttle } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { GetProjectDetailDto } from './dto/get-project-detail.dto';

@Controller('project-details')
export class ProjectDetailsController {
  constructor(private readonly projectDetailsService: ProjectDetailsService) {}

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard) // 🔐 Custom guards for authentication & throttling
  @Throttle({ default: { limit: 20, ttl: 180 } }) // 📈 Limit to 6 requests per 3 minutes per IP/device
  @UseInterceptors(FilesInterceptor('files')) // 📎 Handles file upload with key 'photo'
  @Post()
  @ApiOperation({ summary: 'Create a new ProjectDetails.' })
  @ApiResponse({
    status: 201,
    description: 'ProjectDetails created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'ProjectDetails already exists.' })
  create(
    @Req() req: Request,
    @Body() createProjectDetailDto: CreateProjectDetailDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.projectDetailsService.create(
      req,
      createProjectDetailDto,
      files,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all project Detail Detail Details with filters and pagination.',
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
  findAll(@Query() getProjectDetailDto: GetProjectDetailDto) {
    return this.projectDetailsService.findAll(getProjectDetailDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single blog by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Blog ID.',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Blog found.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  findOne(@Param('id') id: string) {
    return this.projectDetailsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @UseInterceptors(FilesInterceptor('files'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Blog ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Blog updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or ID.' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDetailDto: UpdateProjectDetailDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.projectDetailsService.update(id, updateProjectDetailDto, files);
  }

  @UseGuards(AuthenticationGuard, IpDeviceThrottlerGuard)
  @Throttle({ default: { limit: 6, ttl: 180 } })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog by ID.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Blog ID.',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Blog deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  remove(@Param('id') id: string) {
    return this.projectDetailsService.remove(id);
  }
}
