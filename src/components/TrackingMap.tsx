import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  useMap, 
  useMapsLibrary,
  Pin
} from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Phone, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

const API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (process.env as any).GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Standard simulation coordinates (Pune district)
const START_POS = { lat: 18.50, lng: 73.80 };
const END_POS = { lat: 18.5204, lng: 73.8567 }; // Representative of "Pune District School"

interface TrackingMapProps {
  technicianName?: string;
}

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
    
    // Clear previous route
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
          strokeWeight: 6,
          map
        });
        polylinesRef.current = [polyline];
        
        if (routes[0].viewport) {
           const viewport = routes[0].viewport;
           const bounds = new google.maps.LatLngBounds(
             { lat: viewport.low.latitude, lng: viewport.low.longitude },
             { lat: viewport.high.latitude, lng: viewport.high.longitude }
           );
           map.fitBounds(bounds, 80);
        }
      }
    });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

export default function TrackingMap({ technicianName = "Amol Deshmukh" }: TrackingMapProps) {
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [currentPos, setCurrentPos] = useState<google.maps.LatLngLiteral>(START_POS);
  const [step, setStep] = useState(0);
  const [isArrived, setIsArrived] = useState(false);
  const [eta, setEta] = useState("8 mins");

  // Simulation effect
  useEffect(() => {
    if (path.length === 0) return;

    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= path.length - 1) {
          clearInterval(interval);
          setIsArrived(true);
          return prev;
        }
        const next = prev + Math.max(1, Math.floor(path.length / 50)); // Advance progress
        const boundedNext = Math.min(next, path.length - 1);
        setCurrentPos(path[boundedNext]);
        
        // Update ETA simulation
        const remaining = path.length - boundedNext;
        if (remaining < 5) setEta("1 min");
        else if (remaining < 20) setEta("3 mins");
        else if (remaining < 40) setEta("5 mins");

        return boundedNext;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [path]);

  if (!hasValidKey) {
    return (
      <div className="w-full h-[500px] bg-slate-100 rounded-3xl flex items-center justify-center p-8 text-center">
        <p className="text-slate-500 font-medium">Please provide GOOGLE_MAPS_PLATFORM_KEY to see live tracking.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] bg-slate-200 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={START_POS}
          defaultZoom={13}
          mapId="TRACKING_MAP"
          disableDefaultUI
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Destination Marker */}
          <AdvancedMarker position={END_POS}>
             <div className="relative">
                <div className="absolute inset-0 bg-[#062D27] rounded-full blur-md opacity-20 scale-150" />
                <div className="relative w-10 h-10 bg-[#062D27] rounded-xl flex items-center justify-center shadow-lg transform -rotate-12">
                   <MapPin className="h-5 w-5 text-white" />
                </div>
             </div>
          </AdvancedMarker>

          {/* Technician Marker */}
          <AdvancedMarker position={currentPos}>
            <motion.div 
               animate={{ scale: [1, 1.1, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="relative"
            >
               <div className="absolute inset-0 bg-[#F26522] rounded-full blur-md opacity-40 scale-150" />
               <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-[#F26522]">
                  <Navigation className="h-6 w-6 text-[#F26522]" style={{ transform: `rotate(${Math.atan2(END_POS.lat - currentPos.lat, END_POS.lng - currentPos.lng) * (180 / Math.PI) + 90}deg)` }} />
               </div>
            </motion.div>
          </AdvancedMarker>

          <RouteDisplay 
            origin={START_POS} 
            destination={END_POS} 
            onPathCalculated={setPath} 
          />
        </Map>
      </APIProvider>

      {/* Floating Status UI */}
      <div className="absolute top-8 left-8 right-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pointer-events-none">
         <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white/90 backdrop-blur-md p-6 rounded-[30px] shadow-2xl flex items-center gap-6 pointer-events-auto border border-white/50 w-full md:w-auto"
         >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" alt="Amol" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-[#062D27]">{technicianName}</h4>
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
                     <ShieldCheck className="h-3 w-3 text-green-600" />
                     <span className="text-[8px] font-black uppercase text-green-600">Verified</span>
                  </div>
               </div>
               <p className="text-xs font-bold text-slate-400">Senior Technician • En route</p>
               <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                     <Clock className="h-4 w-4 text-[#F26522]" />
                     <span className="text-sm font-black text-[#F26522]">{isArrived ? 'Arriving Now' : eta}</span>
                  </div>
               </div>
            </div>
            <div className="h-12 w-[1px] bg-slate-100 hidden sm:block" />
            <button className="h-14 w-14 rounded-full bg-[#062D27] text-white flex items-center justify-center hover:bg-[#0A3D36] transition-colors shadow-lg">
               <Phone className="h-6 w-6" />
            </button>
         </motion.div>

         <AnimatePresence>
           {isArrived && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-green-600 text-white p-6 rounded-[30px] shadow-2xl flex items-center gap-4 pointer-events-auto"
             >
                <CheckCircle2 className="h-8 w-8" />
                <div>
                   <p className="text-sm font-black uppercase tracking-widest">A technician is here!</p>
                   <p className="text-xs opacity-80 font-medium">Please meet Amol at your location.</p>
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* Bottom Progress Bar Overlay */}
      <div className="absolute bottom-8 inset-x-8 h-2 bg-white/30 backdrop-blur-md rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${(step / (path.length - 1)) * 100}%` }}
           className="h-full bg-gradient-to-r from-[#F26522] to-orange-400"
         />
      </div>
    </div>
  );
}
