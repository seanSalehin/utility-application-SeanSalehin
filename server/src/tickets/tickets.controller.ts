import { Controller, Get, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('search')
  search(
    @Query('bbox') bbox?: string,
    @Query('status') status?: string,
    @Query('stationCode') stationCode?: string,
    @Query('utilityType') utilityType?: string,
  ) {
    return this.ticketsService.search({
      bbox,
      status,
      stationCode,
      utilityType,
    });
  }
}