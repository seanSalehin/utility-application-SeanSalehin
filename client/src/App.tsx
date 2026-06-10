import { useEffect, useState } from 'react';
import { searchTickets } from './api';
import type { Ticket, TicketResponse } from './types';
import { TicketMap } from './TicketMap';
import './App.css';

const statusOptions = [
  { text: 'Any', value: '' },
  { text: 'Pre completed', value: 'pre_completed' },
  { text: 'Office clear', value: 'office_clear' },
  { text: 'Completed', value: 'completed' },
];

const stationOptions = [
  { text: 'Any', value: '' },
  { text: 'HLTNW02', value: 'HLTNW02' },
  { text: 'HLTST01', value: 'HLTST01' },
  { text: 'HLDT01', value: 'HLDT01' },
  { text: 'HLDN-T01', value: 'HLDN-T01' },
  { text: 'HLTRD01', value: 'HLTRD01' },
  { text: 'HLTGS01', value: 'HLTGS01' },
];

const utilityOptions = [
  { text: 'Any', value: '' },
  { text: 'Water', value: 'water' },
  { text: 'Sanitary', value: 'sanitary' },
  { text: 'Telecom', value: 'telecom' },
  { text: 'Sanitary telecom', value: 'sanitary_telecom' },
  { text: 'Road', value: 'road' },
  { text: 'Gas', value: 'gas' },
];

function cleanText(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function App() {
  const [bbox, setBbox] = useState('-80.10,43.15,-79.70,43.40');
  const [status, setStatus] = useState('');
  const [stationCode, setStationCode] = useState('');
  const [utilityType, setUtilityType] = useState('');

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [summary, setSummary] = useState<TicketResponse['summary']>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadTickets() {
    setLoading(true);
    setError('');

    try {
      const result = await searchTickets({
        bbox,
        status,
        stationCode,
        utilityType,
      });

      setTickets(result.tickets);
      setSummary(result.summary);
    } catch {
      setTickets([]);
      setSummary(undefined);
      setError('Could not load tickets. Please check the filters and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <main className="page">
      <section className="card">
        <h1 >Utility Application - Sean Salehin </h1>
        <p className="intro">
          Search tickets by area, status, station code, and utility type.
        </p>

        <form className="filters" onSubmit={(event)=>{
          event.preventDefault();
          loadTickets();
        }}>

          <label>
            Bbox
            <input
              value={bbox}
              onChange={(event) => setBbox(event.target.value)}
              placeholder="minLng,minLat,maxLng,maxLat"
            />
          </label>

          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
            </select>
          </label>

          <label>
            Station code
            <select value={stationCode} onChange={(event) => setStationCode(event.target.value)}>
              {stationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
            </select>
          </label>

          <label>
            Utility type
            <select value={utilityType} onChange={(event) => setUtilityType(event.target.value)}>
              {utilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
            </select>
          </label>

          <button disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="summary">
          <div className="summary-total">
            <strong>Total:</strong>
            <span>{summary?.total ?? 0}</span>
          </div>

          <div className="summary-items">
            {summary &&
              Object.entries(summary.byStatus).map(([key, value]) => (
                <span key={key}>{cleanText(key)}: {value}</span>
              ))}
          </div>
        </div>

        <TicketMap tickets={tickets} onBboxChange={setBbox} />

        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Station</th>
              <th>Utility</th>
              <th>Longitude</th>
              <th>Latitude</th>
            </tr>
          </thead>

          <tbody>
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  No tickets found.
                </td>
              </tr>
            )}

            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.ticketNo}</td>
                <td>{cleanText(ticket.status)}</td>
                <td>{cleanText(ticket.priority)}</td>
                <td>{ticket.stationCode}</td>
                <td>{ticket.utilityType}</td>
                <td>{ticket.longitude.toFixed(4)}</td>
                <td>{ticket.latitude.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;