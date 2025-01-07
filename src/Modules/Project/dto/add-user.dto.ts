// src/project/dto/create-project.dto.ts

export class AddUserDto {
  readonly projectId: number;
  readonly roleId: number;
  readonly email?: string;
}
