import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSectionDescriptionDto } from './dto/create-section-description.dto';
import { UpdateSectionDescriptionDto } from './dto/update-section-description.dto';
import { SectionDescription } from './entities/section-description.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetSectionDescriptionDto } from './dto/get-section-description.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class SectionDescriptionService {
  constructor(
    @InjectRepository(SectionDescription)
    private readonly sectionDescriptionRepository: Repository<SectionDescription>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createSectionDescriptionDto: CreateSectionDescriptionDto,
  ): Promise<SectionDescription> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    //2. check for duplicates
    const existingCategory = await this.sectionDescriptionRepository.findOne({
      where: { title: createSectionDescriptionDto.title },
    });
    if (existingCategory) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    //3. Create a new category
    const newCategory = this.sectionDescriptionRepository.create({
      ...createSectionDescriptionDto,
      added_by: user_id,
    });
    return await this.sectionDescriptionRepository.save(newCategory);
  }

  public async findAll(
    getSectionDescriptionDto: GetSectionDescriptionDto,
  ): Promise<IPagination<SectionDescription>> {
    const searchableFields = ['title', 'description'];
    const { limit, page, search, ...filters } = getSectionDescriptionDto;

    const sectionDescription = this.dataQueryService.dataQuery({
      paginationQuery: {
        limit,
        page,
        search,
        filters,
      },
      searchableFields,
      repository: this.sectionDescriptionRepository,
    });
    //check if result empty
    if (!sectionDescription) {
      throw new BadRequestException('No records found');
    }
    return sectionDescription;
  }

  public async findOne(id: string): Promise<SectionDescription> {
    const sectionDescription = await this.sectionDescriptionRepository.findOne({
      where: { id },
    });
    if (!sectionDescription) {
      throw new BadRequestException('No record found');
    }
    return sectionDescription;
  }

  public async update(
    id: string,
    updateSectionDescriptionDto: UpdateSectionDescriptionDto,
  ): Promise<SectionDescription> {
    if (!id) {
      throw new BadRequestException('SectionDescription ID is required');
    }
    const sectionDescription =
      await this.sectionDescriptionRepository.findOneBy({
        id,
      });
    if (!sectionDescription) {
      throw new BadRequestException('No record found');
    }
    Object.assign(sectionDescription, updateSectionDescriptionDto);
    return await this.sectionDescriptionRepository.save(sectionDescription);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('SectionDescription ID is required');
    }

    const sectionDescription = await this.findOne(id);

    await this.sectionDescriptionRepository.remove(sectionDescription);

    return { message: 'SectionDescription deleted successfully' };
  }
}
