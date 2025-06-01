import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetProjectDto } from './dto/get-project.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createProjectDto: CreateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Project> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a existBlogTitle with the same name already exists
    const existProjectTitle = await this.projectRepository.findOne({
      where: { project_title: createProjectDto.project_title },
    });

    // ⚠️ Prevent duplicate entries
    if (existProjectTitle) {
      throw new UnauthorizedException('Project Title already exist');
    }

    let thumbnail: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded thumbnail path (single or from array)
      thumbnail = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new existBlogTitle entity with user and optional thumbnail
    const project = this.projectRepository.create({
      ...createProjectDto,
      added_by: user_id,
      thumbnail,
      project_category_id: createProjectDto.project_category_id,
    });

    // 💾 Persist the entity to the database
    return await this.projectRepository.save(project);
  }

  public async findAll(
    getProjectDto: GetProjectDto,
  ): Promise<IPagination<Project>> {
    // Define which fields are searchable
    const searchableFields = [
      'project_tags',
      'project_description',
      'project_title',
    ];

    // Define related entities to join (eager loading)
    const relations = ['projectCategory'];
    const selectRelations = ['projectCategory.name'];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getProjectDto;

    // Query the database using the dataQueryService
    const project = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.projectRepository,
    });

    // Handle case when no blogs are found
    if (!project) {
      throw new NotFoundException('No project data found');
    }

    return project;
  }

  public async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
      relations: ['projectCategory'],
    });
    if (!project) {
      throw new BadRequestException('No Project  data found');
    }
    return project;
  }

  public async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Project> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Article ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const project = await this.projectRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!project) {
      throw new NotFoundException('project not found');
    }

    let thumbnail: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && project.thumbnail) {
      thumbnail = await this.fileUploadsService.updateFileUploads({
        oldFile: project.thumbnail,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !project.thumbnail) {
      thumbnail = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateProjectDto.thumbnail = thumbnail as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(project, updateProjectDto);

    // 💾 Save the updated entity back to the database
    return await this.projectRepository.save(project);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const project = await this.projectRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!project) {
        throw new NotFoundException('project not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (project.thumbnail) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          project.thumbnail,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the project record from the database
      await this.projectRepository.delete(project);

      // 🏁 Return success message
      return {
        message: 'project deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
