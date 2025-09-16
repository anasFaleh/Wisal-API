import { IsUUID } from "class-validator";


export class BeneficiariesDto {
    @IsUUID("4", {each: true})
    beneficiaryIds: string[];
}