import { useEffect, useRef } from 'react';
import type { HeatmapData } from '../lib/api';

interface HeatMapProps {
  data: HeatmapData[];
}

export default function HeatMap({ data }: HeatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default icon paths
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      const map = L.map(mapRef.current!, {
        center: [17.0, 80.5],
        zoom: 6,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add circle markers for heatmap
      data.forEach((point) => {
        const radius = Math.max(15000, point.count * 8000);
        const color = point.count >= 8 ? '#0d9488' : point.count >= 5 ? '#14b8a6' : '#5eead4';

        L.circle([point.lat, point.lng], {
          radius,
          color,
          fillColor: color,
          fillOpacity: 0.35,
          weight: 1.5,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: DM Sans, sans-serif; font-size: 13px;">
              <strong style="color: #0f172a;">${point.district}</strong><br/>
              <span style="color: #0d9488; font-weight: 600;">${point.count} entities</span>
            </div>`,
            { maxWidth: 200 }
          );

        // Add label
        L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            className: '',
            html: `<div style="
              background: white;
              border: 1.5px solid #0d9488;
              border-radius: 8px;
              padding: 2px 7px;
              font-size: 11px;
              font-weight: 700;
              color: #0d9488;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.12);
              font-family: DM Sans, sans-serif;
            ">${point.district} (${point.count})</div>`,
            iconSize: [120, 24],
            iconAnchor: [60, 12],
          }),
        }).addTo(map);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px', borderRadius: 12, zIndex: 0 }}
    />
  );
}
