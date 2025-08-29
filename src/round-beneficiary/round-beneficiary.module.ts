import { Module } from '@nestjs/common';
import { RoundBeneficiaryController } from './round-beneficiary.controller';
import { RoundBeneficiaryService } from './round-beneficiary.service';

@Module({
  controllers: [RoundBeneficiaryController],
  providers: [RoundBeneficiaryService]
})
export class RoundBeneficiaryModule {}
