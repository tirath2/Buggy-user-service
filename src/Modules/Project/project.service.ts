import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from 'src/Entity/project.entity';
import { UserService } from '../User/user.service';
import { UserProject } from 'src/Entity/user-project.entity';
import { RoleService } from '../Role/role.service';
import { AddUserDto } from './dto/add-user.dto';
import { ERROR_MSG } from 'src/Utils/error-msg';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UserProject)
    private readonly userProjectRepository: Repository<UserProject>,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly datSource: DataSource,
  ) {}

  findAll(): Promise<Project[]> {
    try {
      return this.projectRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }
  async findAllProjectForUser(id: number): Promise<Project[]> {
    try {
      const data = await this.projectRepository.query(`
      SELECT 
        p.id AS id,
        p.name AS name,
        p.description AS description,
        json_agg(json_build_object('id', u.id, 'name', u.name,'roleId',up.role_id)) AS users
      FROM 
        projects p
      LEFT JOIN 
        user_project up ON p.id = up.project_id
      LEFT JOIN 
        "users" u ON up.user_id = u.id
      WHERE 
        p.id IN (
          SELECT 
            project_id 
          FROM 
            user_project 
          WHERE 
            user_id = ${id}
        )
      GROUP BY 
        p.id, p.name;`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }

  async getProjectDetails(projectId: number) {
    try {
      const data = await this.projectRepository.query(`
      SELECT 
        p.id AS id,
        p.name AS name,
        p.description AS description,
        json_agg(json_build_object('id', u.id, 'name', u.name,'roleId',up.role_id)) AS users
      FROM 
        projects p
      LEFT JOIN 
        user_project up ON p.id = up.project_id
      LEFT JOIN 
        "users" u ON up.user_id = u.id
      WHERE 
        p.id=${projectId}
      GROUP BY 
        p.id, p.name;`);

      return data?.length ? data[0] : {};
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }

  findOne(id: number): Promise<Project> {
    try {
      return this.projectRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const queryRunner = await this.datSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const projectRepo = await queryRunner.manager.getRepository(Project);
      const projectEntity = projectRepo.create(createProjectDto);
      const project = await projectRepo.save(projectEntity);
      const roles = await this.createRolesForProject(
        project,
        createProjectDto,
        queryRunner,
      );
      const adminRole = roles.find((item) => item.name === 'ADMIN');
      await this.addUserToProject(
        {
          projectId: project.id,
          roleId: adminRole.id,
        },
        userId,
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return project;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    } finally {
      if (!queryRunner.isReleased) queryRunner.release();
    }
  }

  async createRolesForProject(
    project,
    createProjectDto,
    queryRunner?: QueryRunner,
  ) {
    try {
      const projectRoles = [];
      let doesAdminExist = false;
      createProjectDto.roles?.map((item) => {
        if (item == 'ADMIN') {
          doesAdminExist = true;
        }
        projectRoles.push(item);
      });
      if (!doesAdminExist) {
        projectRoles.push('ADMIN');
      }
      return await this.roleService.createRoles(
        projectRoles,
        project.id,
        queryRunner,
      );
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }

  async addUserToProject(
    addUserDto: AddUserDto,
    userId: number,
    queryRunner?: QueryRunner,
  ) {
    try {
      let userProjectRepo = this.userProjectRepository;
      if (queryRunner) {
        userProjectRepo = queryRunner.manager.getRepository(UserProject);
      }
      const userProject = new UserProject();
      if (addUserDto.email) {
        const user = await this.userService.findOneUserByEmail(
          addUserDto.email,
        );
        userProject.userId = user.id;
      } else {
        userProject.userId = userId;
      }
      userProject.projectId = addUserDto.projectId;
      userProject.roleId = addUserDto.roleId;

      return await userProjectRepo.save(userProject);
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }

  async updateUserRole(projectId: number, userId: number, roleId: number) {
    try {
      const userProject = await this.userProjectRepository.findOne({
        where: { projectId, userId },
      });
      if (userProject) {
        userProject.roleId = roleId;
        return await this.userProjectRepository.save(userProject);
      } else {
        throw new BadRequestException(ERROR_MSG.INVALID_PROJECT);
      }
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MSG.SOMETHING_WENT_WRONG);
    }
  }
}
