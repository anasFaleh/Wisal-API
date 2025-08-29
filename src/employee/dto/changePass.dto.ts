import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'كلمة المرور القديمة' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword456', description: 'كلمة المرور الجديدة' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}