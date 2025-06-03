import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDetailDto } from './dto/create-project-detail.dto';
import { UpdateProjectDetailDto } from './dto/update-project-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDetail } from './entities/project-detail.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetProjectDetailDto } from './dto/get-project-detail.dto';

@Injectable()
export class ProjectDetailsService {
  constructor(
    @InjectRepository(ProjectDetail)
    private readonly projectDetailDetailRepository: Repository<ProjectDetail>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createProjectDetailDto: CreateProjectDetailDto,
    files?: Express.Multer.File[],
  ): Promise<any> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a teamMember with the same name already exists
    const existProjectDetail = await this.projectDetailDetailRepository.findOne(
      {
        where: { title: createProjectDetailDto.title },
      },
    );

    // ⚠️ Prevent duplicate entries
    if (existProjectDetail) {
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
    //  Create a new projectDetailDetail entity with user and optional photo
    const projectDetailDetail = this.projectDetailDetailRepository.create({
      ...createProjectDetailDto,
      added_by: user_id,
      photo,
      project_id: createProjectDetailDto.project_id,
    });

    // 💾 Persist the entity to the database
    return await this.projectDetailDetailRepository.save(projectDetailDetail);
  }

  public async findAll(
    getProjectDetailDto: GetProjectDetailDto,
  ): Promise<IPagination<ProjectDetail>> {
    // Define which fields are searchable
    const searchableFields = ['title'];

    // Define related entities to join (eager loading)
    const relations = ['project'];
    const selectRelations = ['project.title', 'project.photo'];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getProjectDetailDto;

    // Query the database using the dataQueryService
    const projectDetail = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.projectDetailDetailRepository,
    });

    // Handle case when no blogs are found
    if (!projectDetail) {
      throw new NotFoundException('No projectDetail data found');
    }

    return projectDetail;
  }

  public async findOne(id: string): Promise<ProjectDetail> {
    const projectDetail = await this.projectDetailDetailRepository.findOne({
      where: {
        id,
      },
      relations: ['project'],
      // select: {

      //   project: {
      //     title: true,
      //   },
      // },
    });
    if (!projectDetail) {
      throw new BadRequestException('No projectDetail  data found');
    }
    return projectDetail;
  }

  public async update(
    id: string,
    updateProjectDetailDto: UpdateProjectDetailDto,
    files?: Express.Multer.File[],
  ): Promise<ProjectDetail> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('projectDetail details ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const projectDetail = await this.projectDetailDetailRepository.findOneBy({
      id,
    });
    // 🛑 Throw error if no matching record is found
    if (!projectDetail) {
      throw new NotFoundException('projectDetail details not found');
    }

    // let photo;

    // // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    // if (files && projectDetail?.photo?.length) {
    //   projectDetail?.photo?.map(async (ph, index) => {
    //     const img = await this.fileUploadsService.updateFileUploads({
    //       oldFile: ph,
    //       currentFile: files[index],
    //     });
    //     photo?.push(img);
    //   });
    // }

    // 📤 If new file provided and photo does not exist, upload the new file
    // if (files && !projectDetail?.photo?.length) {
    //   photo = await this.fileUploadsService.fileUploads(files);
    // }
    let photo: string[] | undefined;

    // ✅ If files are provided and previous photos exist, update them one by one
    if (files && projectDetail.photo?.length) {
      photo = [];

      for (let index = 0; index < files.length; index++) {
        const oldFile = projectDetail.photo[index];
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
    if (files && !projectDetail.photo?.length) {
      const uploaded = await this.fileUploadsService.fileUploads(files);
      photo = Array.isArray(uploaded) ? uploaded : [uploaded];
    }

    // ✅ If no files are provided, keep existing photos
    if (!files) {
      photo = projectDetail.photo;
    }

    // 📤 If no file provided, keep the existing photo
    updateProjectDetailDto.photo = photo;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(projectDetail, updateProjectDetailDto);

    // 💾 Save the updated entity back to the database
    return await this.projectDetailDetailRepository.save(projectDetail);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    try {
      // 🔍 Find existing projectDetailDetail by ID
      const articleDetail = await this.projectDetailDetailRepository.findOneBy({
        id,
      });

      // 🛑 Throw error if no matching record is found
      if (!articleDetail) {
        throw new NotFoundException('projectDetail detail not found');
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
      await this.projectDetailDetailRepository.delete({ id });

      // 🏁 Return success message
      return {
        message: 'projectDetail deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
