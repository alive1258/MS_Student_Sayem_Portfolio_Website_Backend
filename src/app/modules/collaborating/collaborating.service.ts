import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCollaboratingDto } from './dto/create-collaborating.dto';
import { UpdateCollaboratingDto } from './dto/update-collaborating.dto';
import { Collaborate } from '../collaborate/entities/collaborate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetCollaborateDto } from '../collaborate/dto/get-collaborate.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class CollaboratingService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(Collaborate)
    private readonly collaborateRepository: Repository<Collaborate>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createCollaboratingDto: CreateCollaboratingDto,
  ): Promise<Collaborate> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record

    // Assuming title is always a
    const existingData = await this.collaborateRepository.findOne({
      where: {
        title: createCollaboratingDto.title,
      },
    });

    // Check if the name already exists in the database
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.collaborateRepository.create({
      ...createCollaboratingDto,
      added_by: user_id,
    });
    return this.collaborateRepository.save(newEntry);
  }

  public async findAll(
    getCollaborateDto: GetCollaborateDto,
  ): Promise<IPagination<Collaborate>> {
    // Fields that can be searched by keyword
    const searchableFields = ['title'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getCollaborateDto;

    // Query database using DataQueryService abstraction
    const collaborate = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.collaborateRepository,
    });
    // check if collaborate is empty
    if (!collaborate) {
      throw new BadRequestException('No collaborate data found');
    }
    return collaborate;
  }

  public async findOne(id: string): Promise<Collaborate> {
    const collaborate = await this.collaborateRepository.findOne({
      where: {
        id,
      },
    });
    if (!collaborate) {
      throw new BadRequestException('No collaborate  data found');
    }
    return collaborate;
  }

  public async update(
    id: string,
    updateCollaboratingDto: UpdateCollaboratingDto,
  ): Promise<Collaborate> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('collaborate Id is required');
    }

    // 2. Find the existing collaborate entity by ID
    const collaborate = await this.collaborateRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!collaborate) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(collaborate, updateCollaboratingDto);

    // 5. Save and return the updated entity
    return this.collaborateRepository.save(collaborate);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('collaborate ID is required');
    }
    const collaborate = await this.findOne(id);

    await this.collaborateRepository.remove(collaborate);

    return { message: 'collaborate deleted successfully' };
  }
}
