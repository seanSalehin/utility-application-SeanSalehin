import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.provider';

type SearchParams = {
  bbox?: string;
  status?: string;
  stationCode?: string;
  utilityType?: string;
};

type Bbox = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};

type TicketRow = {
  id: number;
  ticketNo: string;
  status: string;
  priority: string;
  stationCode: string;
  utilityType: string;
  longitude: string | number;
  latitude: string | number;
};

@Injectable()
export class TicketsService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async search(params: SearchParams) {
    const bbox = this.parseBbox(params.bbox);

    const values: Array<string | number> = [
      bbox.minLng,
      bbox.minLat,
      bbox.maxLng,
      bbox.maxLat,
    ];

    const whereParts = [
      'ST_Intersects(t.location, ST_MakeEnvelope($1, $2, $3, $4, 4326))',
    ];

    if (params.status) {
      values.push(params.status.trim().toUpperCase());
      whereParts.push(`t.status = $${values.length}`);
    }

    if (params.stationCode) {
      values.push(params.stationCode.trim().toUpperCase());
      whereParts.push(`s.code = $${values.length}`);
    }

    if (params.utilityType) {
      values.push(params.utilityType.trim().toUpperCase());
      whereParts.push(`s.utility_type = $${values.length}`);
    }

    const whereClause = whereParts.join(' AND ');

    const ticketsSql = `
      SELECT
        t.id,
        t.ticket_no AS "ticketNo",
        t.status,
        t.priority,
        s.code AS "stationCode",
        s.utility_type AS "utilityType",
        ST_X(t.location) AS longitude,
        ST_Y(t.location) AS latitude
      FROM tickets t
      INNER JOIN stations s ON s.id = t.station_id
      WHERE ${whereClause}
      ORDER BY t.id;
    `;

    const summarySql = `
      SELECT
        t.status,
        COUNT(*)::int AS count
      FROM tickets t
      INNER JOIN stations s ON s.id = t.station_id
      WHERE ${whereClause}
      GROUP BY t.status
      ORDER BY t.status;
    `;

    const ticketsResult = await this.pool.query<TicketRow>(ticketsSql, values);
    const summaryResult = await this.pool.query<{
      status: string;
      count: number;
    }>(summarySql, values);

    const tickets = ticketsResult.rows.map((ticket) => ({
      id: ticket.id,
      ticketNo: ticket.ticketNo,
      status: ticket.status,
      priority: ticket.priority,
      stationCode: ticket.stationCode,
      utilityType: ticket.utilityType,
      longitude: Number(ticket.longitude),
      latitude: Number(ticket.latitude),
    }));

    const byStatus: Record<string, number> = {};

    for (const row of summaryResult.rows) {
      byStatus[row.status] = Number(row.count);
    }

    return {
      tickets,
      summary: {
        total: tickets.length,
        byStatus,
      },
    };
  }

  private parseBbox(value?: string): Bbox {
    if (!value) {
      throw new BadRequestException(
        'bbox is required. Use minLng,minLat,maxLng,maxLat',
      );
    }

    const parts = value.split(',').map((part) => Number(part.trim()));

    if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
      throw new BadRequestException(
        'bbox must be four numbers: minLng,minLat,maxLng,maxLat',
      );
    }

    const [minLng, minLat, maxLng, maxLat] = parts;

    if (minLng >= maxLng || minLat >= maxLat) {
      throw new BadRequestException(
        'bbox minimum values must be smaller than maximum values',
      );
    }

    if (minLng < -180 || maxLng > 180 || minLat < -90 || maxLat > 90) {
      throw new BadRequestException('bbox values are outside valid coordinates');
    }

    return {
      minLng,
      minLat,
      maxLng,
      maxLat,
    };
  }
}