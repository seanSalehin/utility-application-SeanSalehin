import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import type { Ticket } from './types';

type Props = {
  tickets: Ticket[];
  onBboxChange: (bbox: string) => void;
};

function BboxUpdater({ onBboxChange }: { onBboxChange: (bbox: string) => void }) {
  const map = useMapEvents({
    moveend() {
      const bounds = map.getBounds();

      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]
        .map((number) => number.toFixed(6))
        .join(',');

      onBboxChange(bbox);
    },
  });

  return null;
}

export function TicketMap({ tickets, onBboxChange }: Props) {
  return (
    <section className="map-section">
      <h2>Map</h2>
      <p>Move the map to update the bbox.</p>

      <div className="map-box">
        <MapContainer
          center={[43.27, -79.86]}
          zoom={11}
          style={{ height: '340px', width: '100%' }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <BboxUpdater onBboxChange={onBboxChange} />

          {tickets.map((ticket) => (
            <CircleMarker
              key={ticket.id}
              center={[ticket.latitude, ticket.longitude]}
              radius={8}
            >
              <Popup>
                <strong>{ticket.ticketNo}</strong>
                <br />
                {ticket.status.toLowerCase().replaceAll('_', ' ')}
                <br />
                {ticket.stationCode}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}