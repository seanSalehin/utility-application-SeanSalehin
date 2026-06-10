import { BadRequestException } from '@nestjs/common';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import type { QueryResult, QueryResultRow } from 'pg';
import { TicketsService } from './tickets.service';

type PgQueryMock = Mock<
  (text: string, params?: unknown[]) => Promise<QueryResult<QueryResultRow>>
>;

const queryResult = <T extends QueryResultRow>(rows: T[]): QueryResult<T> =>
  ({
    rows,
  }) as QueryResult<T>;

describe('TicketsService', () => {
  let pool: {
    query: PgQueryMock;
  };

  let service: TicketsService;

  beforeEach(() => {
    pool = {
      query: jest.fn() as unknown as PgQueryMock,
    };

    service = new TicketsService(pool as any);
  });

  it('returns tickets and summary for a valid bbox', async () => {
    pool.query
      .mockResolvedValueOnce(
        queryResult([
          {
            id: 1,
            ticketNo: '20261318930',
            status: 'PRE_COMPLETED',
            priority: 'STANDARD',
            stationCode: 'HLTNW02',
            utilityType: 'WATER',
            longitude: '-79.8711',
            latitude: '43.2557',
          },
        ]),
      )
      .mockResolvedValueOnce(
        queryResult([{ status: 'PRE_COMPLETED', count: '1' }]),
      );

    const result = await service.search({
      bbox: '-80.10,43.15,-79.70,43.40',
    });

    expect(result.summary.total).toBe(1);
    expect(result.summary.byStatus.PRE_COMPLETED).toBe(1);
    expect(result.tickets[0].ticketNo).toBe('20261318930');
    expect(result.tickets[0].longitude).toBe(-79.8711);
    expect(result.tickets[0].latitude).toBe(43.2557);
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  it('rejects missing bbox', async () => {
    await expect(service.search({})).rejects.toThrow(BadRequestException);

    expect(pool.query).not.toHaveBeenCalled();
  });

  it('rejects bbox with non numeric values', async () => {
    await expect(
      service.search({
        bbox: '-80,hello,-79,43',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(pool.query).not.toHaveBeenCalled();
  });

  it('rejects bbox when min values are greater than max values', async () => {
    await expect(
      service.search({
        bbox: '-79,43,-80,44',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(pool.query).not.toHaveBeenCalled();
  });
});