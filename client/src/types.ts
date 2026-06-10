export type Ticket = {
  id: number;
  ticketNo: string;
  status: string;
  priority: string;
  stationCode: string;
  utilityType: string;
  longitude: number;
  latitude: number;
};

export type TicketResponse = {
  tickets: Ticket[];
  summary: {
    total: number;
    byStatus: Record<string, number>;
  };
};