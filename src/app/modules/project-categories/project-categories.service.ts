import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectCategory } from './entities/project-category.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetProjectCategoryDto } from './dto/get-project-category.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ProjectCategoriesService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(ProjectCategory)
    private readonly projectCategoryRepository: Repository<ProjectCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createProjectCategoryDto: CreateProjectCategoryDto,
  ): Promise<ProjectCategory> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record
    const existingData = await this.projectCategoryRepository.findOne({
      where: {
        name: createProjectCategoryDto.name,
      },
    });
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.projectCategoryRepository.create({
      ...createProjectCategoryDto,
      added_by: user_id,
    });
    return this.projectCategoryRepository.save(newEntry);
  }

  public async findAll(
    getProjectCategoryDto: GetProjectCategoryDto,
  ): Promise<IPagination<ProjectCategory>> {
    // Fields that can be searched by keyword
    const searchableFields = ['name'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getProjectCategoryDto;

    // Query database using DataQueryService abstraction
    const projectCategory = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.projectCategoryRepository,
    });
    // check if collaborate is empty
    if (!projectCategory) {
      throw new BadRequestException('No projectCategory  data found');
    }
    return projectCategory;
  }

  public async findOne(id: string): Promise<ProjectCategory> {
    const projectCategory = await this.projectCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!projectCategory) {
      throw new BadRequestException('No Project Category  data found');
    }
    return projectCategory;
  }

  // ✅ Public PATCH endpoint to update a articleCategory entry by ID
  public async update(
    id: string,
    updateProjectCategoryDto: UpdateProjectCategoryDto,
  ): Promise<ProjectCategory> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('articleCategory Id is required');
    }

    // 2. Find the existing articleCategory entity by ID
    const projectCategory = await this.projectCategoryRepository.findOneBy({
      id,
    });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!projectCategory) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(projectCategory, updateProjectCategoryDto);

    // 5. Save and return the updated entity
    return this.projectCategoryRepository.save(projectCategory);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('projectCategory ID is required');
    }
    const projectCategory = await this.findOne(id);

    await this.projectCategoryRepository.remove(projectCategory);

    return { message: 'projectCategory deleted successfully' };
  }
}
