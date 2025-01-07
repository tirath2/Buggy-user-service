// src/project/dto/create-project.dto.ts

export class CreateProjectDto {
  readonly name: string;
  readonly description: string;
  readonly link: string;
  readonly roles: string[];
}
