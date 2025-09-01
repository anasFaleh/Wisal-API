import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FamilyMemberService } from './family-member.service';
import { CreateFamilyMemberDto, UpdateFamilyMemberDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('beneficiaries/:beneficiaryId/family-members')
@UseGuards(AuthGuard('jwt'))
export class FamilyMemberController {
  constructor(private readonly familyMemberService: FamilyMemberService) {}

  @Post()
  @ApiBearerAuth('jwt')
  async create(
    @Param('beneficiaryId', new ParseUUIDPipe()) beneficiaryId: string,
    @Body() dto: CreateFamilyMemberDto,
  ) {
    return this.familyMemberService.create(beneficiaryId, dto);
  }

  @Get()
  async findAll(@Param('beneficiaryId') beneficiaryId: string) {
    return this.familyMemberService.findAll(beneficiaryId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.familyMemberService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFamilyMemberDto,
  ) {
    return this.familyMemberService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.familyMemberService.remove(id);
  }
}
