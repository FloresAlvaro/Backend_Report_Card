import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private roles: Role[] = [];
  private nextId = 1;

  create(createRoleDto: CreateRoleDto): Role {
    const role = new Role({
      id: this.nextId++,
      ...createRoleDto,
    });

    this.roles.push(role);
    return role;
  }

  findAll(): Role[] {
    return this.roles.filter((role) => role.status);
  }

  findOne(id: number): Role {
    const role = this.roles.find((role) => role.id === id && role.status);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  update(id: number, updateRoleDto: UpdateRoleDto): Role {
    const roleIndex = this.roles.findIndex(
      (role) => role.id === id && role.status,
    );
    if (roleIndex === -1) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    this.roles[roleIndex] = {
      ...this.roles[roleIndex],
      ...updateRoleDto,
      updatedAt: new Date(),
    };

    return this.roles[roleIndex];
  }

  remove(id: number): { message: string } {
    const roleIndex = this.roles.findIndex(
      (role) => role.id === id && role.status,
    );
    if (roleIndex === -1) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Soft delete - just mark as inactive
    this.roles[roleIndex].status = false;
    this.roles[roleIndex].updatedAt = new Date();

    return { message: `Role with ID ${id} has been removed` };
  }
}
