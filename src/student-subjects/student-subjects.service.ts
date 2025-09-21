import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateStudentSubjectDto } from './dto/create-student-subject.dto';
import { UpdateStudentSubjectDto } from './dto/update-student-subject.dto';
import { StudentSubject } from './entities/student-subject.entity';

@Injectable()
export class StudentSubjectsService {
  private studentSubjects: StudentSubject[] = [];
  private nextId = 1;

  create(createStudentSubjectDto: CreateStudentSubjectDto): StudentSubject {
    // Check if this student-subject combination already exists and is active
    const existingEnrollment = this.studentSubjects.find(
      (enrollment) =>
        enrollment.studentId === createStudentSubjectDto.studentId &&
        enrollment.subjectId === createStudentSubjectDto.subjectId &&
        enrollment.status &&
        enrollment.academicYear === (createStudentSubjectDto.academicYear || new Date().getFullYear()) &&
        enrollment.semester === (createStudentSubjectDto.semester || 1),
    );

    if (existingEnrollment) {
      throw new ConflictException(
        `Student ${createStudentSubjectDto.studentId} is already enrolled in subject ${createStudentSubjectDto.subjectId} for this academic period`,
      );
    }

    const studentSubject = new StudentSubject({
      id: this.nextId++,
      ...createStudentSubjectDto,
    });

    this.studentSubjects.push(studentSubject);
    return studentSubject;
  }

  findAll(): StudentSubject[] {
    return this.studentSubjects.filter((enrollment) => enrollment.status);
  }

  findByStudent(studentId: number): StudentSubject[] {
    const enrollments = this.studentSubjects.filter(
      (enrollment) => enrollment.studentId === studentId && enrollment.status,
    );

    if (enrollments.length === 0) {
      throw new NotFoundException(`No active enrollments found for student ${studentId}`);
    }

    return enrollments;
  }

  findBySubject(subjectId: number): StudentSubject[] {
    const enrollments = this.studentSubjects.filter(
      (enrollment) => enrollment.subjectId === subjectId && enrollment.status,
    );

    if (enrollments.length === 0) {
      throw new NotFoundException(`No active enrollments found for subject ${subjectId}`);
    }

    return enrollments;
  }

  findByAcademicPeriod(academicYear: number, semester: number): StudentSubject[] {
    return this.studentSubjects.filter(
      (enrollment) =>
        enrollment.academicYear === academicYear &&
        enrollment.semester === semester &&
        enrollment.status,
    );
  }

  findOne(id: number): StudentSubject {
    const studentSubject = this.studentSubjects.find(
      (enrollment) => enrollment.id === id && enrollment.status,
    );

    if (!studentSubject) {
      throw new NotFoundException(`Student-Subject enrollment with ID ${id} not found`);
    }

    return studentSubject;
  }

  update(id: number, updateStudentSubjectDto: UpdateStudentSubjectDto): StudentSubject {
    const enrollmentIndex = this.studentSubjects.findIndex(
      (enrollment) => enrollment.id === id && enrollment.status,
    );

    if (enrollmentIndex === -1) {
      throw new NotFoundException(`Student-Subject enrollment with ID ${id} not found`);
    }

    // If updating student or subject IDs, check for conflicts
    if (updateStudentSubjectDto.studentId || updateStudentSubjectDto.subjectId) {
      const currentEnrollment = this.studentSubjects[enrollmentIndex];
      const newStudentId = updateStudentSubjectDto.studentId || currentEnrollment.studentId;
      const newSubjectId = updateStudentSubjectDto.subjectId || currentEnrollment.subjectId;
      const newAcademicYear = updateStudentSubjectDto.academicYear || currentEnrollment.academicYear;
      const newSemester = updateStudentSubjectDto.semester || currentEnrollment.semester;

      const existingEnrollment = this.studentSubjects.find(
        (enrollment) =>
          enrollment.id !== id &&
          enrollment.studentId === newStudentId &&
          enrollment.subjectId === newSubjectId &&
          enrollment.academicYear === newAcademicYear &&
          enrollment.semester === newSemester &&
          enrollment.status,
      );

      if (existingEnrollment) {
        throw new ConflictException(
          `Student ${newStudentId} is already enrolled in subject ${newSubjectId} for this academic period`,
        );
      }
    }

    this.studentSubjects[enrollmentIndex] = {
      ...this.studentSubjects[enrollmentIndex],
      ...updateStudentSubjectDto,
    };

    return this.studentSubjects[enrollmentIndex];
  }

  remove(id: number): { message: string } {
    const enrollmentIndex = this.studentSubjects.findIndex(
      (enrollment) => enrollment.id === id && enrollment.status,
    );

    if (enrollmentIndex === -1) {
      throw new NotFoundException(`Student-Subject enrollment with ID ${id} not found`);
    }

    // Soft delete - mark as inactive
    this.studentSubjects[enrollmentIndex].status = false;

    return {
      message: `Student-Subject enrollment with ID ${id} has been deactivated`,
    };
  }

  completeSubject(id: number, finalGrade: number): StudentSubject {
    if (finalGrade < 0 || finalGrade > 100) {
      throw new BadRequestException('Final grade must be between 0 and 100');
    }

    const enrollmentIndex = this.studentSubjects.findIndex(
      (enrollment) => enrollment.id === id && enrollment.status,
    );

    if (enrollmentIndex === -1) {
      throw new NotFoundException(`Student-Subject enrollment with ID ${id} not found`);
    }

    this.studentSubjects[enrollmentIndex].finalGrade = finalGrade;
    this.studentSubjects[enrollmentIndex].completionDate = new Date();

    return this.studentSubjects[enrollmentIndex];
  }
}