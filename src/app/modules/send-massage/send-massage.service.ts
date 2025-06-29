import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSendMassageDto } from './dto/create-send-massage.dto';
import { UpdateSendMassageDto } from './dto/update-send-massage.dto';
import { SendMessage } from './entities/send-massage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetSendMassageDto } from './dto/get-send-massage.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class SendMassageService {
  constructor(
    @InjectRepository(SendMessage)
    private readonly sendMassageRepository: Repository<SendMessage>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    // req: Request,
    createSendMassageDto: CreateSendMassageDto,
  ): Promise<SendMessage> {
    // 3. Create and save the new entry
    const newCollaborate = this.sendMassageRepository.create({
      ...createSendMassageDto,
    });
    return await this.sendMassageRepository.save(newCollaborate);
  }

  public async findAll(
    getSendMassageDto: GetSendMassageDto,
  ): Promise<IPagination<SendMessage>> {
    const searchableFields = ['name', 'email'];
    const { limit, page, search, ...filters } = getSendMassageDto;

    const collaborate = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.sendMassageRepository,
    });
    // check if collaborate is empty
    if (!collaborate) {
      throw new BadRequestException('No data found');
    }
    return collaborate;
  }

  findOne(id: number) {
    return `This action returns a #${id} sendMassage`;
  }

  update(id: number, updateSendMassageDto: UpdateSendMassageDto) {
    return `This action updates a #${id} sendMassage`;
  }

  remove(id: number) {
    return `This action removes a #${id} sendMassage`;
  }
}
