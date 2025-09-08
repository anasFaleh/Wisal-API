import { Body, Controller, Delete, Get, Put, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiSecurity, ApiTags, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";
import { CreateRoundDto, UpdateRoundDto } from "./dto";
import { RoundService } from "./round.service";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtGuard } from "../auth/guards";
import { RolesGuard } from "../common/guards/roles.guard";
import { Emp } from "../common/enums";

@ApiTags('Rounds (Admin, Distributer)')
@ApiSecurity('bearer')
@Controller('distributions/:distributionId/rounds')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Emp.ADMIN, Emp.DISTRIBUTER)
export class RoundController {
  constructor(private readonly roundsService: RoundService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new round for a distribution' })
  @ApiParam({ name: 'distributionId', description: 'distribution ID (UUID)' })
  @ApiBody({ type: CreateRoundDto })
  @ApiResponse({ status: 201, description: 'Round successfully created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(
    @Param('distributionId', new ParseUUIDPipe()) distributionId: string,
    @Body() createRoundDto: CreateRoundDto
  ) {
    return this.roundsService.create(distributionId, createRoundDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rounds for a distribution' })
  @ApiParam({ name: 'distributionId', description: 'distribution ID (UUID)' })
  @ApiResponse({ status: 200, description: 'List of rounds returned successfully' })
  findAll(@Param('distributionId', new ParseUUIDPipe()) distributionId: string) {
    return this.roundsService.findAll(distributionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get round by ID' })
  @ApiParam({ name: 'id', description: 'Round ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Round returned successfully' })
  @ApiResponse({ status: 404, description: 'Round not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roundsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a round' })
  @ApiParam({ name: 'id', description: 'Round ID (UUID)' })
  @ApiBody({ type: UpdateRoundDto })
  @ApiResponse({ status: 200, description: 'Round updated successfully' })
  @ApiResponse({ status: 404, description: 'Round not found' })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateRoundDto: UpdateRoundDto) {
    return this.roundsService.update(id, updateRoundDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a round' })
  @ApiParam({ name: 'id', description: 'Round ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Round deleted successfully' })
  @ApiResponse({ status: 404, description: 'Round not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roundsService.remove(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get statistics for a round' })
  @ApiParam({ name: 'id', description: 'Round ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Round statistics returned successfully' })
  getStats(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roundsService.getRoundStats(id);
  }
}
