import { Injectable } from '@nestjs/common';
import { CreateProjectDetailDto } from './dto/create-project-detail.dto';
import { UpdateProjectDetailDto } from './dto/update-project-detail.dto';

@Injectable()
export class ProjectDetailsService {
  create(createProjectDetailDto: CreateProjectDetailDto) {
    return 'This action adds a new projectDetail';
  }

  findAll() {
    return `This action returns all projectDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectDetail`;
  }

  update(id: number, updateProjectDetailDto: UpdateProjectDetailDto) {
    return `This action updates a #${id} projectDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectDetail`;
  }
}
