import type { TicketResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type SearchParams = {
  bbox: string;
  status: string;
  stationCode: string;
  utilityType: string;
};

export async function searchTickets(
  params: SearchParams,
): Promise<TicketResponse> {
  const query = new URLSearchParams();

  query.set('bbox', params.bbox);

  if (params.status) query.set('status', params.status);
  if (params.stationCode) query.set('stationCode', params.stationCode);
  if (params.utilityType) query.set('utilityType', params.utilityType);

  const response = await fetch(`${API_URL}/api/tickets/search?${query}`);

  if (!response.ok) {
    throw new Error('Unable to search tickets. Please try again.');
  }

  return response.json();
}