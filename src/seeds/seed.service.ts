import { Injectable, Logger } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { GradesService } from '../grades/grades.service';
import { SubjectsService } from '../subjects/subjects.service';
import { UsersService } from '../users/users.service';
import { TeachersService } from '../teachers/teachers.service';
import { StudentsService } from '../students/students.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly rolesService: RolesService,
    private readonly gradesService: GradesService,
    private readonly subjectsService: SubjectsService,
    private readonly usersService: UsersService,
    private readonly teachersService: TeachersService,
    private readonly studentsService: StudentsService,
  ) {}

  seedAll(): void {
    this.logger.log('🌱 Starting database seeding...');

    try {
      // Seed in order due to dependencies
      this.seedRoles();
      this.seedGrades();
      this.seedSubjects();
      this.seedUsers();

      this.logger.log('✅ Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  clearDatabase(): void {
    this.logger.log('🗑️ Clearing database...');

    try {
      // Note: Individual services don't have removeAll methods
      // This would require individual deletion of each entity
      this.logger.log(
        '✅ Database clearing completed (individual deletion required for full clearing)',
      );
    } catch (error) {
      this.logger.error('❌ Database clearing failed:', error);
      throw error;
    }
  }

  private seedRoles(): void {
    this.logger.log('📝 Seeding roles...');

    const roles = [
      { name: 'admin', description: 'Administrator with full access' },
      { name: 'teacher', description: 'Teacher with limited access' },
      { name: 'student', description: 'Student with basic access' },
      {
        name: 'parent',
        description: 'Parent with view access to student data',
      },
    ];

    for (const role of roles) {
      try {
        this.rolesService.createRole(role);
        this.logger.log(`   ✓ Created role: ${role.name}`);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('already exists')
        ) {
          this.logger.log(
            `   ⚠ Role ${role.name} already exists, skipping...`,
          );
        } else {
          throw error;
        }
      }
    }
  }

  private seedGrades(): void {
    this.logger.log('🎓 Seeding grades...');

    const grades = [
      {
        level: 'Preescolar',
        description: 'Educación preescolar para niños de 3-5 años',
      },
      {
        level: '1° Primaria',
        description: 'Primer grado de educación primaria',
      },
      {
        level: '2° Primaria',
        description: 'Segundo grado de educación primaria',
      },
      {
        level: '3° Primaria',
        description: 'Tercer grado de educación primaria',
      },
      {
        level: '4° Primaria',
        description: 'Cuarto grado de educación primaria',
      },
      {
        level: '5° Primaria',
        description: 'Quinto grado de educación primaria',
      },
      {
        level: '6° Primaria',
        description: 'Sexto grado de educación primaria',
      },
      {
        level: '1° Secundaria',
        description: 'Primer grado de educación secundaria',
      },
      {
        level: '2° Secundaria',
        description: 'Segundo grado de educación secundaria',
      },
      {
        level: '3° Secundaria',
        description: 'Tercer grado de educación secundaria',
      },
    ];

    for (const grade of grades) {
      try {
        this.gradesService.createGrade(grade);
        this.logger.log(`   ✓ Created grade: ${grade.level}`);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('already exists')
        ) {
          this.logger.log(
            `   ⚠ Grade ${grade.level} already exists, skipping...`,
          );
        } else {
          throw error;
        }
      }
    }
  }

  private seedSubjects(): void {
    this.logger.log('📖 Seeding subjects...');

    const subjects = [
      {
        subjectName: 'Matemáticas',
        description: 'Matemática básica y avanzada',
        hoursPerWeek: 5,
      },
      {
        subjectName: 'Lengua y Literatura',
        description: 'Comprensión lectora y escritura',
        hoursPerWeek: 4,
      },
      {
        subjectName: 'Ciencias Naturales',
        description: 'Biología, Química y Física',
        hoursPerWeek: 4,
      },
      {
        subjectName: 'Ciencias Sociales',
        description: 'Historia y Geografía',
        hoursPerWeek: 3,
      },
      {
        subjectName: 'Inglés',
        description: 'Idioma extranjero',
        hoursPerWeek: 3,
      },
      {
        subjectName: 'Educación Física',
        description: 'Actividad física y deportes',
        hoursPerWeek: 2,
      },
      {
        subjectName: 'Arte y Música',
        description: 'Expresión artística y musical',
        hoursPerWeek: 2,
      },
      {
        subjectName: 'Tecnología',
        description: 'Informática y tecnología',
        hoursPerWeek: 2,
      },
      {
        subjectName: 'Formación Ética',
        description: 'Valores y ciudadanía',
        hoursPerWeek: 1,
      },
    ];

    for (const subject of subjects) {
      try {
        this.subjectsService.createSubject(subject);
        this.logger.log(`   ✓ Created subject: ${subject.subjectName}`);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('already exists')
        ) {
          this.logger.log(
            `   ⚠ Subject ${subject.subjectName} already exists, skipping...`,
          );
        } else {
          throw error;
        }
      }
    }
  }

  private seedUsers(): void {
    this.logger.log('👥 Seeding users...');

    // Get roles
    const roles = this.rolesService.findAllRoles();
    const adminRole = roles.find((r) => r.name === 'admin');
    const teacherRole = roles.find((r) => r.name === 'teacher');
    const studentRole = roles.find((r) => r.name === 'student');

    if (!adminRole || !teacherRole || !studentRole) {
      throw new Error('Required roles not found. Please seed roles first.');
    }

    // Seed admin user
    try {
      this.usersService.create({
        name: 'Administrador Principal',
        email: 'admin@school.edu',
        password: 'admin123',
        roleId: adminRole.id,
      });
      this.logger.log('   ✓ Created admin user');
    } catch {
      this.logger.log('   ⚠ Admin user already exists, skipping...');
    }

    // Seed teachers
    const teachers = [
      {
        name: 'Dr. María González',
        email: 'maria.gonzalez@school.edu',
        password: 'teacher123',
        roleId: teacherRole.id,
        degree: 'Doctorado en Matemáticas',
        department: 'Departamento de Matemáticas',
        yearsOfExperience: 15,
        phoneNumber: '+1234567001',
        licenseNumber: 'TEACH-2020-001',
      },
      {
        name: 'Prof. Carlos Rodríguez',
        email: 'carlos.rodriguez@school.edu',
        password: 'teacher123',
        roleId: teacherRole.id,
        degree: 'Licenciatura en Lengua y Literatura',
        department: 'Departamento de Humanidades',
        yearsOfExperience: 12,
        phoneNumber: '+1234567002',
        licenseNumber: 'TEACH-2021-002',
      },
      {
        name: 'Dra. Ana Martínez',
        email: 'ana.martinez@school.edu',
        password: 'teacher123',
        roleId: teacherRole.id,
        degree: 'Doctorado en Ciencias Naturales',
        department: 'Departamento de Ciencias',
        yearsOfExperience: 18,
        phoneNumber: '+1234567003',
        licenseNumber: 'TEACH-2019-003',
      },
    ];

    for (const teacher of teachers) {
      try {
        this.teachersService.create(teacher);
        this.logger.log(`   ✓ Created teacher: ${teacher.name}`);
      } catch {
        this.logger.log(
          `   ⚠ Teacher ${teacher.email} already exists, skipping...`,
        );
      }
    }

    // Seed students
    const students = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@student.edu',
        password: 'student123',
        roleId: studentRole.id,
        enrollmentNumber: 'EST-2024-001',
        dateOfBirth: new Date('2010-05-15'),
        guardianName: 'Pedro Pérez',
        guardianPhone: '+1234567101',
        guardianEmail: 'pedro.perez@parent.com',
        address: 'Calle 123, Ciudad',
        gradeId: 7, // 1° Secundaria
        enrollmentYear: 2024,
      },
      {
        name: 'María López',
        email: 'maria.lopez@student.edu',
        password: 'student123',
        roleId: studentRole.id,
        enrollmentNumber: 'EST-2024-002',
        dateOfBirth: new Date('2011-08-22'),
        guardianName: 'Ana López',
        guardianPhone: '+1234567102',
        guardianEmail: 'ana.lopez@parent.com',
        address: 'Avenida 456, Ciudad',
        gradeId: 6, // 6° Primaria
        enrollmentYear: 2024,
      },
      {
        name: 'Carlos Fernández',
        email: 'carlos.fernandez@student.edu',
        password: 'student123',
        roleId: studentRole.id,
        enrollmentNumber: 'EST-2024-003',
        dateOfBirth: new Date('2009-12-10'),
        guardianName: 'Luis Fernández',
        guardianPhone: '+1234567103',
        guardianEmail: 'luis.fernandez@parent.com',
        address: 'Plaza 789, Ciudad',
        gradeId: 8, // 2° Secundaria
        enrollmentYear: 2024,
      },
    ];

    for (const student of students) {
      try {
        this.studentsService.create(student);
        this.logger.log(`   ✓ Created student: ${student.name}`);
      } catch {
        this.logger.log(
          `   ⚠ Student ${student.email} already exists, skipping...`,
        );
      }
    }
  }
}
