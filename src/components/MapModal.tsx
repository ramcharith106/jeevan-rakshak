import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (latlng: { lat: number; lng: number }) => void;
};

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect }: { onSelect: (latlng: { lat: number; lng: number }) => void }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function MapModal({ open, onClose, onSelect }: Props) {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-3xl h-[80vh] flex flex-col">
        <Dialog.Title className="text-xl font-semibold mb-4 text-center">📍 Select Location</Dialog.Title>
        <div className="flex-grow relative rounded overflow-hidden">
          {open && (
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="h-full w-full rounded"
              style={{ zIndex: 0 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onSelect={setSelected} />
            </MapContainer>
          )}
        </div>
        <div className="flex justify-end mt-4 space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400">Cancel</button>
          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className={`px-4 py-2 text-sm rounded text-white ${selected ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Select
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
