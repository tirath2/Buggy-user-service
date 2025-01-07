import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/Entity/role.entity';
import { ERROR_MSG } from 'src/Utils/error-msg';
import { In, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getRoles(projectId: number) {
    try {
      return this.roleRepository.find({ where: { projectId } });
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }

  async createRoles(
    roles: string[],
    projectId: number,
    queryRunner?: QueryRunner,
  ) {
    try {
      let roleRepo = this.roleRepository;
      if (queryRunner) {
        roleRepo = queryRunner.manager.getRepository(Role);
      }
      const existingRoles = await roleRepo.find({
        where: { name: In(roles), projectId },
      });
      if (existingRoles?.length) {
        throw new BadRequestException(
          ` Roles ${existingRoles
            ?.map((role) => role.name)
            ?.join(', ')} already exists`,
        );
      }
      const roleEntity = [];
      roles.map((role) => {
        roleEntity.push(roleRepo.create({ name: role, projectId }));
      });
      return await roleRepo.save(roleEntity);
    } catch (error) {}
  }
}
