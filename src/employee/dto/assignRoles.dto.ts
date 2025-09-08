import { ApiProperty } from "@nestjs/swagger";
import { EmployeeRole } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";


export class AssignRolesDto {
    @ApiProperty({
        description: 'Role Of The Institution Employee',
        enum: EmployeeRole,
        example: EmployeeRole.DISTRIBUTER,
    })
    @IsEnum(EmployeeRole)
    @IsNotEmpty()
    role: EmployeeRole
}