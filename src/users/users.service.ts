import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserWithRoleDto } from './dto/user-with-role.dto';
import { User } from './entities/user.entity';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  constructor(private readonly rolesService: RolesService) {}

  create(createUserDto: CreateUserDto): User {
    // Verify role exists
    try {
      this.rolesService.findOneRole(createUserDto.roleId);
    } catch {
      throw new BadRequestException(
        `Role with ID ${createUserDto.roleId} does not exist`,
      );
    }

    // Verify email is not in use
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

    // Verify role exists if updating roleId
    if (updateUserDto.roleId) {
      try {
        this.rolesService.findOneRole(updateUserDto.roleId);
      } catch {
        throw new BadRequestException(
          `Role with ID ${updateUserDto.roleId} does not exist`,
        );
      }
    }

    // Verify email is not in use if updating email
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

    return { message: `User with ID ${id} has been removed` };
  }

  findUserWithRole(id: number): UserWithRoleDto {
    const user = this.findOne(id);
    if (user.roleId) {
      try {
        const role = this.rolesService.findOneRole(user.roleId);
        return { ...user, role } as UserWithRoleDto;
      } catch {
        // Role might have been deleted, but we still return the user
        return user as UserWithRoleDto;
      }
    }
    return user as UserWithRoleDto;
  }

  // Teacher-specific methods
  createTeacher(createTeacherDto: CreateTeacherDto): Teacher {
    // Verify role exists
    try {
      this.rolesService.findOneRole(createTeacherDto.roleId);
    } catch {
      throw new BadRequestException(
        `Role with ID ${createTeacherDto.roleId} does not exist`,
      );
    }

    // Verify email is not in use
    const existingUser = this.users.find(
      (user) => user.email === createTeacherDto.email && user.status,
    );
    if (existingUser) {
      throw new ConflictException(
        `User with email ${createTeacherDto.email} already exists`,
      );
    }

    const teacher = new Teacher({
      id: this.nextId++,
      ...createTeacherDto,
    });

    this.users.push(teacher);
    return teacher;
  }

  findAllTeachers(): Teacher[] {
    return this.users
      .filter((user) => user.status && user instanceof Teacher)
      .map((teacher) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...teacherWithoutPassword } = teacher;
        return teacherWithoutPassword as Teacher;
      });
  }

  findTeacher(id: number): Teacher {
    const teacher = this.users.find(
      (user) => user.id === id && user.status && user instanceof Teacher,
    );
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...teacherWithoutPassword } = teacher;
    return teacherWithoutPassword as Teacher;
  }

  updateTeacher(id: number, updateTeacherDto: UpdateTeacherDto): Teacher {
    const teacherIndex = this.users.findIndex(
      (user) => user.id === id && user.status && user instanceof Teacher,
    );
    if (teacherIndex === -1) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Verify role exists if updating roleId
    if (updateTeacherDto.roleId) {
      try {
        this.rolesService.findOneRole(updateTeacherDto.roleId);
      } catch {
        throw new BadRequestException(
          `Role with ID ${updateTeacherDto.roleId} does not exist`,
        );
      }
    }

    // Verify email is not in use if updating email
    if (updateTeacherDto.email) {
      const existingUser = this.users.find(
        (user) =>
          user.email === updateTeacherDto.email && 
          user.status && 
          user.id !== id,
      );
      if (existingUser) {
        throw new ConflictException(
          `User with email ${updateTeacherDto.email} already exists`,
        );
      }
    }

    this.users[teacherIndex] = {
      ...this.users[teacherIndex],
      ...updateTeacherDto,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...teacherWithoutPassword } = this.users[teacherIndex];
    return teacherWithoutPassword as Teacher;
  }

  // Student-specific methods
  createStudent(createStudentDto: CreateStudentDto): Student {
    // Verify role exists
    try {
      this.rolesService.findOneRole(createStudentDto.roleId);
    } catch {
      throw new BadRequestException(
        `Role with ID ${createStudentDto.roleId} does not exist`,
      );
    }

    // Verify email is not in use
    const existingUser = this.users.find(
      (user) => user.email === createStudentDto.email && user.status,
    );
    if (existingUser) {
      throw new ConflictException(
        `User with email ${createStudentDto.email} already exists`,
      );
    }

    // Verify enrollment number is unique
    const existingEnrollment = this.users.find(
      (user) => user instanceof Student && 
      (user as Student).enrollmentNumber === createStudentDto.enrollmentNumber,
    );
    if (existingEnrollment) {
      throw new ConflictException(
        `Student with enrollment number ${createStudentDto.enrollmentNumber} already exists`,
      );
    }

    const studentData = {
      id: this.nextId++,
      ...createStudentDto,
      dateOfBirth: new Date(createStudentDto.dateOfBirth),
    };

    const student = new Student(studentData);
    this.users.push(student);
    return student;
  }

  findAllStudents(): Student[] {
    return this.users
      .filter((user) => user.status && user instanceof Student)
      .map((student) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...studentWithoutPassword } = student;
        return studentWithoutPassword as Student;
      });
  }

  findStudent(id: number): Student {
    const student = this.users.find(
      (user) => user.id === id && user.status && user instanceof Student,
    );
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...studentWithoutPassword } = student;
    return studentWithoutPassword as Student;
  }

  updateStudent(id: number, updateStudentDto: UpdateStudentDto): Student {
    const studentIndex = this.users.findIndex(
      (user) => user.id === id && user.status && user instanceof Student,
    );
    if (studentIndex === -1) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Verify role exists if updating roleId
    if (updateStudentDto.roleId) {
      try {
        this.rolesService.findOneRole(updateStudentDto.roleId);
      } catch {
        throw new BadRequestException(
          `Role with ID ${updateStudentDto.roleId} does not exist`,
        );
      }
    }

    // Verify email is not in use if updating email
    if (updateStudentDto.email) {
      const existingUser = this.users.find(
        (user) =>
          user.email === updateStudentDto.email && 
          user.status && 
          user.id !== id,
      );
      if (existingUser) {
        throw new ConflictException(
          `User with email ${updateStudentDto.email} already exists`,
        );
      }
    }

    const updateData = { ...updateStudentDto };
    if (updateStudentDto.dateOfBirth) {
      updateData.dateOfBirth = updateStudentDto.dateOfBirth;
    }

    this.users[studentIndex] = {
      ...this.users[studentIndex],
      ...updateData,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...studentWithoutPassword } = this.users[studentIndex];
    return studentWithoutPassword as Student;
  }
}
