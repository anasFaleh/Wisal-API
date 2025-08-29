import { Module } from '@nestjs/common';
import { FamilyMemberService } from './family-member.service';
import { FamilyMemberController } from './family-member.controller';

@Module({
  providers: [FamilyMemberService],
  controllers: [FamilyMemberController]
})
export class FamilyMemberModule {}
