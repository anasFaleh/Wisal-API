import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Emp } from "../../common/enums";


export class AssignRolesDto {
    @ApiProperty({
        description: 'Role Of The Institution Employee',
        enum: Emp,
        example: Emp.DISTRIBUTER,
    })
    @IsEnum(Emp)
    @IsNotEmpty()
    role: Emp
}