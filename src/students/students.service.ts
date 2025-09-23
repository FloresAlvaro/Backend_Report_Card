import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class StudentsService {
  private students: Student[] = [];
  private nextId = 1;

  constructor(private readonly rolesService: RolesService) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Verify role exists
    try {
      await this.rolesService.findOneRole(createStudentDto.roleId);
    } catch {
      throw new BadRequestException(
        `Role with ID ${createStudentDto.roleId} does not exist`,
      );
    }

    // Verify email is not in use
    const existingStudent = this.students.find(
      (student) => student.email === createStudentDto.email && student.status,
    );
    if (existingStudent) {
      throw new ConflictException(
        `Student with email ${createStudentDto.email} already exists`,
      );
    }

    // Verify enrollment number is not in use
    const existingEnrollment = this.students.find(
      (student) =>
        student.enrollmentNumber === createStudentDto.enrollmentNumber &&
        student.status,
    );
    if (existingEnrollment) {
      throw new ConflictException(
        `Student with enrollment number ${createStudentDto.enrollmentNumber} already exists`,
      );
    }

    const student = new Student({
      id: this.nextId++,
      ...createStudentDto,
    });

    this.students.push(student);
    return student;
  }

  findAll(): Student[] {
    return this.students
      .filter((student) => student.status)
      .map((student) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...studentWithoutPassword } = student;
        return studentWithoutPassword as Student;
      });
  }

  findOne(id: number): Student {
    const student = this.students.find(
      (student) => student.id === id && student.status,
    );
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...studentWithoutPassword } = student;
    return studentWithoutPassword as Student;
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const studentIndex = this.students.findIndex(
      (student) => student.id === id && student.status,
    );
    if (studentIndex === -1) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const existingStudent = this.students[studentIndex];

    // Verify role exists if being updated
    if (updateStudentDto.roleId) {
      try {
        await this.rolesService.findOneRole(updateStudentDto.roleId);
      } catch {
        throw new BadRequestException(
          `Role with ID ${updateStudentDto.roleId} does not exist`,
        );
      }
    }

    // Verify email uniqueness if being updated
    if (
      updateStudentDto.email &&
      updateStudentDto.email !== existingStudent.email
    ) {
      const emailExists = this.students.find(
        (student) =>
          student.email === updateStudentDto.email &&
          student.status &&
          student.id !== id,
      );
      if (emailExists) {
        throw new ConflictException(
          `Student with email ${updateStudentDto.email} already exists`,
        );
      }
    }

    // Verify enrollment number uniqueness if being updated
    if (
      updateStudentDto.enrollmentNumber &&
      updateStudentDto.enrollmentNumber !== existingStudent.enrollmentNumber
    ) {
      const enrollmentExists = this.students.find(
        (student) =>
          student.enrollmentNumber === updateStudentDto.enrollmentNumber &&
          student.status &&
          student.id !== id,
      );
      if (enrollmentExists) {
        throw new ConflictException(
          `Student with enrollment number ${updateStudentDto.enrollmentNumber} already exists`,
        );
      }
    }

    // Update student
    this.students[studentIndex] = new Student({
      ...existingStudent,
      ...updateStudentDto,
      id,
      updatedAt: new Date(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...studentWithoutPassword } = this.students[studentIndex];
    return studentWithoutPassword as Student;
  }

  remove(id: number): { message: string } {
    const studentIndex = this.students.findIndex(
      (student) => student.id === id && student.status,
    );
    if (studentIndex === -1) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Soft delete
    this.students[studentIndex].status = false;
    this.students[studentIndex].updatedAt = new Date();

    return { message: `Student with ID ${id} has been removed` };
  }

  // Additional student-specific methods
  findByGrade(gradeId: number): Student[] {
    return this.students
      .filter((student) => student.status && student.gradeId === gradeId)
      .map((student) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...studentWithoutPassword } = student;
        return studentWithoutPassword as Student;
      });
  }

  findBySubject(subjectId: number): Student[] {
    return this.students
      .filter(
        (student) => student.status && student.subjectIds.includes(subjectId),
      )
      .map((student) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...studentWithoutPassword } = student;
        return studentWithoutPassword as Student;
      });
  }

  findByEnrollmentYear(year: number): Student[] {
    return this.students
      .filter((student) => student.status && student.enrollmentYear === year)
      .map((student) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...studentWithoutPassword } = student;
        return studentWithoutPassword as Student;
      });
  }

  findByEnrollmentNumber(enrollmentNumber: string): Student | null {
    const student = this.students.find(
      (student) =>
        student.enrollmentNumber === enrollmentNumber && student.status,
    );

    if (!student) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...studentWithoutPassword } = student;
    return studentWithoutPassword as Student;
  }
}
