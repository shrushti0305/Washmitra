import React, { useEffect, useState, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  useMap, 
  useMapsLibrary,
  Pin
} from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Clock, Truck, CheckCircle2, Play } from 'lucide-react';

const API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (process.env as any).GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const START_POS = { lat: 18.50, lng: 73.80 };
const END_POS = { lat: 18.5204, lng: 73.8567 };

function RouteDisplay({ origin, destination, onPathCalculated }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  onPathCalculated: (path: google.maps.LatLngLiteral[]) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;
    polylinesRef.current.forEach(p => p.setMap(null));

    (routesLib.Route as any).computeRoutes({
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      travelMode: 'DRIVING',
      fields: ['routes.polyline.encodedPolyline', 'routes.viewport'],
    } as any).then((response: any) => {
      const routes = response.routes;
      if (routes?.[0]?.polyline?.encodedPolyline) {
        const path = google.maps.geometry.encoding.decodePath(routes[0].polyline.encodedPolyline);
        const pathLiterals = path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        onPathCalculated(pathLiterals);

        const polyline = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#F26522',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map
        });
        polylinesRef.current = [polyline];
        
        if (routes[0].viewport) {
           const viewport = routes[0].viewport;
           const bounds = new google.maps.LatLngBounds(
             { lat: viewport.low.latitude, lng: viewport.low.longitude },
             { lat: viewport.high.latitude, lng: viewport.high.longitude }
           );
           map.fitBounds(bounds, 40);
        }
      }
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

export default function CompactTrackingMap({ onStatusUpdate }: { onStatusUpdate?: (status: string) => void }) {
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [currentPos, setCurrentPos] = useState<google.maps.LatLngLiteral>(START_POS);
  const [step, setStep] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes default
  const [status, setStatus] = useState("Technician is starting the journey");

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    onStatusUpdate?.(`${status} [ETA: ${formatTime(etaSeconds)}]`);
  }, [status, etaSeconds, onStatusUpdate]);

  useEffect(() => {
    if (path.length === 0) return;
    setEtaSeconds(path.length * 2); // Simulate 2 seconds per interval step
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= path.length - 1) {
          clearInterval(interval);
          setStatus("Technician has arrived at your location");
          return prev;
        }
        const next = prev + 1;
        setCurrentPos(path[next]);
        
        // Dynamic status updates based on progress
        const progress = next / path.length;
        if (progress < 0.2) setStatus("Technician is navigating through the main terminal");
        else if (progress < 0.4) setStatus("Technician is approaching your landmark at Shivajinagar");
        else if (progress < 0.6) setStatus("Technician has crossed the central market area");
        else if (progress < 0.8) setStatus("Technician is currently in your neighborhood");
        else setStatus("Technician is turning into your street");

        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [path]);

  if (!hasValidKey) {
    return (
      <div className="w-full h-[300px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200">
        <MapPin className="h-8 w-8 text-slate-300 mb-2" />
        <p className="text-xs text-slate-500 font-medium max-w-[200px]">Provide Google Maps key to see live tracking simulation.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] bg-slate-100 rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      {/* Dynamic Status Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          key={status}
          className="bg-[#062D27]/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 w-max max-w-full mx-auto technician-status-update"
        >
          <div className="flex items-center gap-2">
            {status.includes("arrived") ? (
              <CheckCircle2 size={14} className="text-green-500" />
            ) : status.includes("starting") ? (
              <Play size={14} className="text-[#F26522]" />
            ) : status.includes("approaching") || status.includes("turning") ? (
              <Navigation size={14} className="text-[#F26522]" />
            ) : status.includes("neighborhood") ? (
              <MapPin size={14} className="text-[#F26522]" />
            ) : (
              <Truck size={14} className="text-[#F26522]" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white tracking-tight leading-tight">{status}</span>
            {etaSeconds > 0 && (
              <span className="text-[9px] font-black text-[#F26522] uppercase tracking-[0.2em] mt-0.5">
                Arrival in {formatTime(etaSeconds)}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={START_POS}
          defaultZoom={14}
          mapId="COMPACT_TRACKING"
          disableDefaultUI
          zoomControl={true}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker position={END_POS}>
            <div className="w-8 h-8 bg-[#062D27] rounded-lg flex items-center justify-center shadow-lg border border-white">
              <MapPin className="h-4 w-4 text-white" />
            </div>
          </AdvancedMarker>

          <AdvancedMarker position={currentPos}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-[#F26522]">
              <Navigation 
                className="h-5 w-5 text-[#F26522]" 
                style={{ transform: `rotate(${Math.atan2(END_POS.lat - currentPos.lat, END_POS.lng - currentPos.lng) * (180 / Math.PI) + 90}deg)` }} 
              />
            </div>
          </AdvancedMarker>

          <RouteDisplay 
            origin={START_POS} 
            destination={END_POS} 
            onPathCalculated={setPath} 
          />
        </Map>
      </APIProvider>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border border-white/50 flex items-center gap-2 pointer-events-auto">
          <Clock className="h-3 w-3 text-[#F26522] animate-pulse" />
          <span className="text-[10px] font-black text-[#062D27] uppercase tracking-wider">{formatTime(etaSeconds)} ETA</span>
        </div>
        <div className="w-1/2 h-1.5 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden pointer-events-auto">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / (path.length - 1)) * 100}%` }}
            className="h-full bg-[#F26522]"
          />
        </div>
      </div>
    </div>
  );
}
