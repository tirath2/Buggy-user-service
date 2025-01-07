import { Project } from 'src/Entity/project.entity';
import { Role } from 'src/Entity/role.entity';
import { UserProject } from 'src/Entity/user-project.entity';
import { User } from 'src/Entity/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
export const dbdatasource: DataSourceOptions = {
  migrationsTableName: 'user_migrations',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'groyyo123',
  database: 'buggy',
  logging: true,
  synchronize: false,
  name: 'default',
  entities: [User, Project, UserProject, Role],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscriber/**/*{.ts,.js}'],
};

const dataSource = new DataSource(dbdatasource);
export default dataSource;
