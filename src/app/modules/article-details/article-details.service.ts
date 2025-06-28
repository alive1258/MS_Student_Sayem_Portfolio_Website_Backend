import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateArticleDetailDto } from './dto/create-article-detail.dto';
import { UpdateArticleDetailDto } from './dto/update-article-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDetail } from './entities/article-detail.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetArticleDetailDto } from './dto/get-article-detail.dto';

@Injectable()
export class ArticleDetailsService {
  constructor(
    @InjectRepository(ArticleDetail)
    private readonly articleDetailRepository: Repository<ArticleDetail>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createArticleDetailDto: CreateArticleDetailDto,
    files?: Express.Multer.File[],
  ): Promise<any> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a teamMember with the same name already exists
    const existArticle = await this.articleDetailRepository.findOne({
      where: { title: createArticleDetailDto.title },
    });

    // ⚠️ Prevent duplicate entries
    if (existArticle) {
      throw new UnauthorizedException('Blog Detail already exist');
    }

    let photo: string[] | undefined;

    // 📤 Handle optional file upload
    if (files) {
      const uploaded = await this.fileUploadsService.fileUploads(files);

      // 📁 Use the uploaded photo path (single or from array)
      // photo = uploaded;
      photo = Array.isArray(uploaded) ? uploaded : [uploaded];
    }
    //  Create a new article entity with user and optional photo
    const article = this.articleDetailRepository.create({
      ...createArticleDetailDto,
      added_by: user_id,
      photo,
      article_id: createArticleDetailDto.article_id,
    });

    // 💾 Persist the entity to the database
    return await this.articleDetailRepository.save(article);
  }

  public async findAll(
    getArticleDetailDto: GetArticleDetailDto,
  ): Promise<IPagination<ArticleDetail>> {
    // Define which fields are searchable
    const searchableFields = ['title'];

    // Define related entities to join (eager loading)
    const relations = ['article'];
    const selectRelations = [
      'article.article_title',
      'article.thumbnail',
      'article.article_tags',
      'article.publish_time',
    ];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getArticleDetailDto;

    // Query the database using the dataQueryService
    const articleDetail = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.articleDetailRepository,
    });

    // Handle case when no blogs are found
    if (!articleDetail) {
      throw new NotFoundException('No articleDetail data found');
    }

    return articleDetail;
  }
  public async findOne(id: string): Promise<ArticleDetail> {
    const articleDetail = await this.articleDetailRepository.findOne({
      where: {
        id,
      },
      relations: ['article'],
      // select: {

      //   article: {
      //     title: true,
      //   },
      // },
    });
    if (!articleDetail) {
      throw new BadRequestException('No articleDetail  data found');
    }
    return articleDetail;
  }

  public async update(
    id: string,
    updateArticleDetailDto: UpdateArticleDetailDto,
    files?: Express.Multer.File[],
  ): Promise<ArticleDetail> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Blog details ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const blog = await this.articleDetailRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!blog) {
      throw new NotFoundException('blog details not found');
    }

    // let photo;

    // // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    // if (files && blog?.photo?.length) {
    //   blog?.photo?.map(async (ph, index) => {
    //     const img = await this.fileUploadsService.updateFileUploads({
    //       oldFile: ph,
    //       currentFile: files[index],
    //     });
    //     photo?.push(img);
    //   });
    // }

    // 📤 If new file provided and photo does not exist, upload the new file
    // if (files && !blog?.photo?.length) {
    //   photo = await this.fileUploadsService.fileUploads(files);
    // }
    let photo: string[] | undefined;

    // ✅ If files are provided and previous photos exist, update them one by one
    if (files && blog.photo?.length) {
      photo = [];

      for (let index = 0; index < files.length; index++) {
        const oldFile = blog.photo[index];
        const newFile = files[index];

        // If there is a new file at this index, update it
        if (newFile) {
          const updated = await this.fileUploadsService.updateFileUploads({
            oldFile,
            currentFile: newFile,
          });
          photo.push(updated);
        } else if (oldFile) {
          // Keep old image if no new file is provided at this index
          photo.push(oldFile);
        }
      }
    }

    // ✅ If files are provided but there are no old photos, upload new ones
    if (files && !blog.photo?.length) {
      const uploaded = await this.fileUploadsService.fileUploads(files);
      photo = Array.isArray(uploaded) ? uploaded : [uploaded];
    }

    // ✅ If no files are provided, keep existing photos
    if (!files) {
      photo = blog.photo;
    }

    // 📤 If no file provided, keep the existing photo
    updateArticleDetailDto.photo = photo;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(blog, updateArticleDetailDto);

    // 💾 Save the updated entity back to the database
    return await this.articleDetailRepository.save(blog);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    try {
      // 🔍 Find existing blogDetail by ID
      const articleDetail = await this.articleDetailRepository.findOneBy({
        id,
      });

      // 🛑 Throw error if no matching record is found
      if (!articleDetail) {
        throw new NotFoundException('articleDetail detail not found');
      }

      // 🗑️ Delete associated files if they exist
      if (articleDetail.photo?.length) {
        for (const file of articleDetail.photo) {
          const deleted = await this.fileUploadsService.deleteFileUploads(file);

          if (!deleted) {
            throw new BadRequestException(
              'Failed to delete associated file: ' + file,
            );
          }
        }
      }

      // 🗑️ Delete the articleDetail record by ID
      await this.articleDetailRepository.delete({ id });

      // 🏁 Return success message
      return {
        message: 'articleDetail deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
