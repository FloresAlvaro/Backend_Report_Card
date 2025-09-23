import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Name of the subject',
    example: 'Mathematics',
  })
  subjectName: string;

  @ApiProperty({
    description: 'Description of the subject content',
    example: 'Advanced mathematics including algebra and geometry',
  })
  subjectDescription: string;

  @ApiProperty({
    description: 'The status of the subject (active/inactive)',
    example: true,
    default: true,
    required: false,
  })
  status?: boolean;
}
