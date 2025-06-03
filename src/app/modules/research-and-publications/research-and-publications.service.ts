import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateResearchAndPublicationDto } from './dto/create-research-and-publication.dto';
import { UpdateResearchAndPublicationDto } from './dto/update-research-and-publication.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResearchAndPublication } from './entities/research-and-publication.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { Request } from 'express';
import { IPagination } from 'src/app/common/data-query/pagination.interface';
import { GetResearchAndPublicationDto } from './dto/get-research-and-publication.dto';

@Injectable()
export class ResearchAndPublicationsService {
  constructor(
    @InjectRepository(ResearchAndPublication)

    /**
     * Inject repository
     */
    private readonly researchAndPublicationRepository: Repository<ResearchAndPublication>,

    private readonly dataQueryService: DataQueryService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  public async create(
    req: Request,
    createResearchAndPublicationDto: CreateResearchAndPublicationDto,
    file?: Express.Multer.File,
  ): Promise<ResearchAndPublication> {
    const user_id = req?.user?.sub;

    if (!user_id) {
      throw new UnauthorizedException(
        'User ID is required.You have to sing in!',
      );
    }

    const existResearchAndPublication =
      await this.researchAndPublicationRepository.findOne({
        where: { title: createResearchAndPublicationDto.title },
      });

    if (existResearchAndPublication) {
      throw new BadRequestException('researchAndPublication already exists!');
    }

    // Handle file upload if file is present
    let thumbnail: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      thumbnail = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    //crete new researchAndPublication

    let researchAndPublication = this.researchAndPublicationRepository.create({
      ...createResearchAndPublicationDto,
      added_by: user_id,
      thumbnail,
    });
    const result = await this.researchAndPublicationRepository.save(
      researchAndPublication,
    );
    return result;
  }

  public async findAll(
    getResearchAndPublicationDto: GetResearchAndPublicationDto,
  ): Promise<IPagination<ResearchAndPublication>> {
    const searchableFields = ['title', 'publisher', 'journal', 'doi'];

    const { page, limit, search, ...filters } = getResearchAndPublicationDto;

    const researchAndPublication = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.researchAndPublicationRepository,
    });

    return researchAndPublication;
  }

  public async findOne(id: string): Promise<ResearchAndPublication> {
    const researchAndPublication =
      await this.researchAndPublicationRepository.findOne({
        where: { id },
      });
    if (!researchAndPublication) {
      throw new BadRequestException('researchAndPublication not found');
    }
    return researchAndPublication;
  }

  public async update(
    id: string,
    updateResearchAndPublicationDto: UpdateResearchAndPublicationDto,
    file?: Express.Multer.File,
  ): Promise<ResearchAndPublication> {
    // Validate ID presence
    if (!id) {
      throw new BadRequestException('Hero section ID is required.');
    }
    // Find the existing record
    const existResearchAndPublication =
      await this.researchAndPublicationRepository.findOneBy({ id });

    if (!existResearchAndPublication) {
      throw new BadRequestException(
        'Home Hero Section not found with the given ID.',
      );
    }

    // Handle thumbnail update (if file is uploaded)
    let thumbnail: string | string[] | undefined;

    if (file && existResearchAndPublication.thumbnail) {
      // Replace old thumbnail with new one
      thumbnail = await this.fileUploadsService.updateFileUploads({
        oldFile: existResearchAndPublication.thumbnail,
        currentFile: file,
      });
    }

    // Upload new thumbnail if no previous one
    if (file && !existResearchAndPublication.thumbnail) {
      thumbnail = await this.fileUploadsService.fileUploads(file);
    }

    // Assign new thumbnail if uploaded
    updateResearchAndPublicationDto.thumbnail = thumbnail as string | undefined;

    // Merge updated fields into existing entity
    Object.assign(existResearchAndPublication, updateResearchAndPublicationDto);

    // Save and return the updated record
    return await this.researchAndPublicationRepository.save(
      existResearchAndPublication,
    );
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('ID is required for deletion.');
    }

    try {
      // Try to find the record
      const homeHeroSection = await this.findOne(id);

      if (!homeHeroSection) {
        throw new NotFoundException(`ResearchAndPublication not found with ID`);
      }

      // Delete associated thumbnail if it exists
      if (homeHeroSection.thumbnail) {
        const deletedFile = await this.fileUploadsService.deleteFileUploads(
          homeHeroSection.thumbnail,
        );
        if (!deletedFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // Proceed with removal
      await this.researchAndPublicationRepository.remove(homeHeroSection);

      return {
        message: `ResearchAndPublication with ID  has been successfully removed.`,
      };
    } catch (error) {
      // Log it or handle known DB/File errors differently if needed
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
