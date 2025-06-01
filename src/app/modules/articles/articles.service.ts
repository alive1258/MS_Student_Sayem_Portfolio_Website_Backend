import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Request } from 'express';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { GetArticleDto } from './dto/get-article.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createArticleDto: CreateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a existBlogTitle with the same name already exists
    const existArticleTitle = await this.articleRepository.findOne({
      where: { article_title: createArticleDto.article_title },
    });

    // ⚠️ Prevent duplicate entries
    if (existArticleTitle) {
      throw new UnauthorizedException('Article Title already exist');
    }

    let thumbnail: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded thumbnail path (single or from array)
      thumbnail = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new existBlogTitle entity with user and optional thumbnail
    const article = this.articleRepository.create({
      ...createArticleDto,
      added_by: user_id,
      thumbnail,
      article_category_id: createArticleDto.article_category_id,
    });

    // 💾 Persist the entity to the database
    return await this.articleRepository.save(article);
  }

  public async findAll(
    getArticleDto: GetArticleDto,
  ): Promise<IPagination<Article>> {
    // Define which fields are searchable
    const searchableFields = [
      'article_title',
      'article_description',
      'article_tags',
    ];

    // Define related entities to join (eager loading)
    const relations = ['articleCategory'];
    const selectRelations = ['articleCategory.name'];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getArticleDto;

    // Query the database using the dataQueryService
    const article = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.articleRepository,
    });

    // Handle case when no blogs are found
    if (!article) {
      throw new NotFoundException('No article data found');
    }

    return article;
  }

  public async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: {
        id,
      },
      relations: ['articleCategory'],
    });
    if (!article) {
      throw new BadRequestException('No article  data found');
    }
    return article;
  }

  public async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Article ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const article = await this.articleRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!article) {
      throw new NotFoundException('article not found');
    }

    let thumbnail: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && article.thumbnail) {
      thumbnail = await this.fileUploadsService.updateFileUploads({
        oldFile: article.thumbnail,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !article.thumbnail) {
      thumbnail = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateArticleDto.thumbnail = thumbnail as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(article, updateArticleDto);

    // 💾 Save the updated entity back to the database
    return await this.articleRepository.save(article);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const article = await this.articleRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!article) {
        throw new NotFoundException('article not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (article.thumbnail) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          article.thumbnail,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the article record from the database
      await this.articleRepository.delete(article);

      // 🏁 Return success message
      return {
        message: 'article deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
