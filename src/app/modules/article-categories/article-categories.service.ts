import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { ArticleCategory } from './entities/article-category.entity';
import { Request } from 'express';
import { GetArticleCategoryDto } from './dto/get-article-category.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ArticleCategoriesService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createArticleCategoryDto: CreateArticleCategoryDto,
  ): Promise<ArticleCategory> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record
    const existingData = await this.articleCategoryRepository.findOne({
      where: {
        name: createArticleCategoryDto.name,
      },
    });
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.articleCategoryRepository.create({
      ...createArticleCategoryDto,
      added_by: user_id,
    });
    return this.articleCategoryRepository.save(newEntry);
  }
  public async findAll(
    getArticleCategoryDto: GetArticleCategoryDto,
  ): Promise<IPagination<ArticleCategory>> {
    // Fields that can be searched by keyword
    const searchableFields = ['name'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getArticleCategoryDto;

    // Query database using DataQueryService abstraction
    const articleCategory = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.articleCategoryRepository,
    });
    // check if collaborate is empty
    if (!articleCategory) {
      throw new BadRequestException('No articleCategory  data found');
    }
    return articleCategory;
  }

  // ✅ Public GET endpoint to retrieve a single articleCategory entry by ID
  public async findOne(id: string): Promise<ArticleCategory> {
    const articleCategory = await this.articleCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!articleCategory) {
      throw new BadRequestException('No articleCategory  data found');
    }
    return articleCategory;
  }

  // ✅ Public PATCH endpoint to update a articleCategory entry by ID
  public async update(
    id: string,
    updateArticleCategoryDto: UpdateArticleCategoryDto,
  ): Promise<ArticleCategory> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('articleCategory Id is required');
    }

    // 2. Find the existing articleCategory entity by ID
    const articleCategory = await this.articleCategoryRepository.findOneBy({
      id,
    });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!articleCategory) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(articleCategory, updateArticleCategoryDto);

    // 5. Save and return the updated entity
    return this.articleCategoryRepository.save(articleCategory);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('articleCategory ID is required');
    }
    const articleCategory = await this.findOne(id);

    await this.articleCategoryRepository.remove(articleCategory);

    return { message: 'articleCategory deleted successfully' };
  }
}
