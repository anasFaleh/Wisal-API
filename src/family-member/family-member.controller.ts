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
import {
  ApiBearerAuth,
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Family Members')
@ApiSecurity('bearer')
@UseGuards(AuthGuard('jwt'))
@Controller('beneficiaries/:beneficiaryId/family-members')
export class FamilyMemberController {
  constructor(private readonly familyMemberService: FamilyMemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new family member for a beneficiary' })
  @ApiParam({ name: 'beneficiaryId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Family member created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(
    @Param('beneficiaryId', new ParseUUIDPipe()) beneficiaryId: string,
    @Body() dto: CreateFamilyMemberDto,
  ) {
    return this.familyMemberService.create(beneficiaryId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all family members of a beneficiary' })
  @ApiParam({ name: 'beneficiaryId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of family members returned' })
  async findAll(@Param('beneficiaryId') beneficiaryId: string) {
    return this.familyMemberService.findAll(beneficiaryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a family member by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Family member returned' })
  @ApiResponse({ status: 404, description: 'Family member not found' })
  async findOne(@Param('id') id: string) {
    return this.familyMemberService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a family member by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Family member updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Family member not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateFamilyMemberDto) {
    return this.familyMemberService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a family member by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Family member deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Family member not found' })
  async remove(@Param('id') id: string) {
    return this.familyMemberService.remove(id);
  }
}
