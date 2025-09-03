import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  constructor(private readonly rolesService: RolesService) {}

  create(createUserDto: CreateUserDto): User {
    // Verificar que el role existe
    try {
      this.rolesService.findOneRole(createUserDto.roleId);
    } catch {
      throw new BadRequestException(
        `Role with ID ${createUserDto.roleId} does not exist`,
      );
    }

    // Verificar que el email no esté en uso
    const existingUser = this.users.find(
      (user) => user.email === createUserDto.email && user.status,
    );
    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const user = new User({
      id: this.nextId++,
      ...createUserDto,
    });

    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users
      .filter((user) => user.status)
      .map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id && user.status);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex(
      (user) => user.id === id && user.status,
    );
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Si se está actualizando el roleId, verificar que el role existe
    if (updateUserDto.roleId) {
      try {
        this.rolesService.findOneRole(updateUserDto.roleId);
      } catch {
        throw new BadRequestException(
          `Role with ID ${updateUserDto.roleId} does not exist`,
        );
      }
    }

    // Si se está actualizando el email, verificar que no esté en uso por otro usuario
    if (updateUserDto.email) {
      const existingUser = this.users.find(
        (user) =>
          user.email === updateUserDto.email && user.status && user.id !== id,
      );
      if (existingUser) {
        throw new ConflictException(
          `User with email ${updateUserDto.email} already exists`,
        );
      }
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword as User;
  }

  remove(id: number): { message: string } {
    const userIndex = this.users.findIndex(
      (user) => user.id === id && user.status,
    );
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Soft delete - just mark as inactive
    this.users[userIndex].status = false;
    this.users[userIndex].updatedAt = new Date();

    return { message: `User with ID ${id} has been removed` };
  }

  findUserWithRole(id: number): User {
    const user = this.findOne(id);
    if (user.roleId) {
      try {
        const role = this.rolesService.findOneRole(user.roleId);
        user.role = role;
      } catch {
        // Role might have been deleted, but we still return the user
      }
    }
    return user;
  }
}
