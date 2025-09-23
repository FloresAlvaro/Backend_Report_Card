import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class TeachersService {
  private teachers: Teacher[] = [];
  private nextId = 1;

  constructor(private readonly rolesService: RolesService) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    // Verify role exists
    try {
      await this.rolesService.findOneRole(createTeacherDto.roleId);
    } catch {
      throw new BadRequestException(
        `Role with ID ${createTeacherDto.roleId} does not exist`,
      );
    }

    // Verify email is not in use
    const existingTeacher = this.teachers.find(
      (teacher) => teacher.email === createTeacherDto.email && teacher.status,
    );
    if (existingTeacher) {
      throw new ConflictException(
        `Teacher with email ${createTeacherDto.email} already exists`,
      );
    }

    // Verify license number is not in use
    const existingLicense = this.teachers.find(
      (teacher) =>
        teacher.licenseNumber === createTeacherDto.licenseNumber &&
        teacher.status,
    );
    if (existingLicense) {
      throw new ConflictException(
        `Teacher with license number ${createTeacherDto.licenseNumber} already exists`,
      );
    }

    const teacher = new Teacher({
      id: this.nextId++,
      ...createTeacherDto,
    });

    this.teachers.push(teacher);
    return teacher;
  }

  findAll(): Teacher[] {
    return this.teachers
      .filter((teacher) => teacher.status)
      .map((teacher) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...teacherWithoutPassword } = teacher;
        return teacherWithoutPassword as Teacher;
      });
  }

  findOne(id: number): Teacher {
    const teacher = this.teachers.find(
      (teacher) => teacher.id === id && teacher.status,
    );
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...teacherWithoutPassword } = teacher;
    return teacherWithoutPassword as Teacher;
  }

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const teacherIndex = this.teachers.findIndex(
      (teacher) => teacher.id === id && teacher.status,
    );
    if (teacherIndex === -1) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    const existingTeacher = this.teachers[teacherIndex];

    // Verify role exists if being updated
    if (updateTeacherDto.roleId) {
      try {
        await this.rolesService.findOneRole(updateTeacherDto.roleId);
      } catch {
        throw new BadRequestException(
          `Role with ID ${updateTeacherDto.roleId} does not exist`,
        );
      }
    }

    // Verify email uniqueness if being updated
    if (
      updateTeacherDto.email &&
      updateTeacherDto.email !== existingTeacher.email
    ) {
      const emailExists = this.teachers.find(
        (teacher) =>
          teacher.email === updateTeacherDto.email &&
          teacher.status &&
          teacher.id !== id,
      );
      if (emailExists) {
        throw new ConflictException(
          `Teacher with email ${updateTeacherDto.email} already exists`,
        );
      }
    }

    // Verify license number uniqueness if being updated
    if (
      updateTeacherDto.licenseNumber &&
      updateTeacherDto.licenseNumber !== existingTeacher.licenseNumber
    ) {
      const licenseExists = this.teachers.find(
        (teacher) =>
          teacher.licenseNumber === updateTeacherDto.licenseNumber &&
          teacher.status &&
          teacher.id !== id,
      );
      if (licenseExists) {
        throw new ConflictException(
          `Teacher with license number ${updateTeacherDto.licenseNumber} already exists`,
        );
      }
    }

    // Update teacher
    this.teachers[teacherIndex] = new Teacher({
      ...existingTeacher,
      ...updateTeacherDto,
      id,
      updatedAt: new Date(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...teacherWithoutPassword } = this.teachers[teacherIndex];
    return teacherWithoutPassword as Teacher;
  }

  remove(id: number): { message: string } {
    const teacherIndex = this.teachers.findIndex(
      (teacher) => teacher.id === id && teacher.status,
    );
    if (teacherIndex === -1) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Soft delete
    this.teachers[teacherIndex].status = false;
    this.teachers[teacherIndex].updatedAt = new Date();

    return { message: `Teacher with ID ${id} has been removed` };
  }

  // Additional teacher-specific methods
  findByDepartment(department: string): Teacher[] {
    return this.teachers
      .filter((teacher) => teacher.status && teacher.department === department)
      .map((teacher) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...teacherWithoutPassword } = teacher;
        return teacherWithoutPassword as Teacher;
      });
  }

  findBySubject(subjectId: number): Teacher[] {
    return this.teachers
      .filter(
        (teacher) => teacher.status && teacher.subjectIds.includes(subjectId),
      )
      .map((teacher) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...teacherWithoutPassword } = teacher;
        return teacherWithoutPassword as Teacher;
      });
  }

  findByGrade(gradeId: number): Teacher[] {
    return this.teachers
      .filter((teacher) => teacher.status && teacher.gradeIds.includes(gradeId))
      .map((teacher) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...teacherWithoutPassword } = teacher;
        return teacherWithoutPassword as Teacher;
      });
  }
}
