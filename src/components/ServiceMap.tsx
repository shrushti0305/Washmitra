import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Users, Calendar, IndianRupee, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from '@/components/ui/badge';
import logoImg from '../assets/images/icon.jpg';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Custom WashMitra Icon - Pointing to /public folder
const washMitraIcon = new L.Icon({
  iconUrl: logoImg, // No quotes here! This uses the imported image variable
  iconSize: [24,24 ],
  iconAnchor: [12, 12],
});;

interface Location {
  id: string; name: string; lat: number; lng: number; type: string; 
  videoUrl: string; tradeProgram: string; duration: string; trainingFee: string;
}

const locations: Location[] = [
  { id: '1', name: 'Pune', lat: 18.5204, lng: 73.8567, type: 'Training Center', videoUrl: '#', tradeProgram: 'WASH Tech', duration: '4 Days', trainingFee: '1,800' },
  { id: '2', name: 'Nashik', lat: 19.9975, lng: 73.7898, type: 'Training Center', videoUrl: '#', tradeProgram: 'Plumbing', duration: '10 Days', trainingFee: '2,500' },
  { id: '3', name: 'Nandurbar', lat: 21.3653, lng: 74.2386, type: 'Training Center', videoUrl: '#', tradeProgram: 'Water Tech', duration: '5 Days', trainingFee: '2,000' },
  { id: '4', name: 'Sambhaji Nagar', lat: 19.8762, lng: 75.3433, type: 'Training Center', videoUrl: '#', tradeProgram: 'Solar Tech', duration: '7 Days', trainingFee: '2,200' },
  { id: '5', name: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'Training Center', videoUrl: '#', tradeProgram: 'WASH Mitra', duration: '15 Days', trainingFee: '5,000' },
  { id: '6', name: 'Satara', lat: 17.6805, lng: 73.9803, type: 'Training Center', videoUrl: '#', tradeProgram: 'Filter Tech', duration: '4 Days', trainingFee: '1,500' },
  { id: '7', name: 'Kolhapur', lat: 16.7050, lng: 74.2433, type: 'Training Center', videoUrl: '#', tradeProgram: 'Plumbing', duration: '8 Days', trainingFee: '2,000' },
  { id: '8', name: 'Indapur', lat: 18.1130, lng: 75.0326, type: 'Training Center', videoUrl: '#', tradeProgram: 'CCTV Tech', duration: '6 Days', trainingFee: '2,000' },
  { id: '9', name: 'Wardha', lat: 20.7453, lng: 78.6022, type: 'Training Center', videoUrl: '#', tradeProgram: 'General Tech', duration: '5 Days', trainingFee: '1,800' },
  { id: '10', name: 'Ahilyanagar', lat: 19.0948, lng: 74.7480, type: 'Training Center', videoUrl: '#', tradeProgram: 'Wiring Tech', duration: '5 Days', trainingFee: '1,800' },
  { id: '11', name: 'Chhattisgarh', lat: 21.2787, lng: 81.8661, type: 'Regional Hub', videoUrl: '#', tradeProgram: 'Advanced WASH', duration: '20 Days', trainingFee: '8,000' }
];
export default function ServiceMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    // Added z-10 here so it stays behind your Navbar
    <div className="relative z-10 w-full h-[700px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-slate-200">
      
      <MapContainer center={[19.5, 76.5]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]} 
            icon={washMitraIcon}
            eventHandlers={{ click: () => setSelectedLocation(loc) }} 
          />
        ))}
      </MapContainer>

      <AnimatePresence>
        {selectedLocation && (
           <div className="absolute inset-0 z-50 bg-[#062D27]/80 backdrop-blur-md flex items-center justify-center p-4">
             <motion.div 
               initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
               className="bg-white p-8 rounded-[40px] max-w-sm w-full shadow-2xl relative"
             >
               <button onClick={() => setSelectedLocation(null)} className="absolute top-4 right-4"><X /></button>
               <h2 className="text-2xl font-black mb-4">{selectedLocation.name}</h2>
               <div className="space-y-3">
                  <div className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> {selectedLocation.tradeProgram}</div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {selectedLocation.duration}</div>
                  <div className="flex items-center gap-2"><IndianRupee className="w-4 h-4"/> {selectedLocation.trainingFee}</div>
               </div>
               <Button className="w-full mt-6" onClick={() => setSelectedLocation(null)}>Close</Button>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}