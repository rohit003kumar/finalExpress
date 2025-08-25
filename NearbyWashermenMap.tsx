// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix Leaflet marker icon issue for webpack/Vite
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// // Haversine distance formula
// const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371e3; // Earth's radius in meters
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// // Types
// type Washerman = {
//   _id: string;
//   name: string;
//   contact: string;
//   range?: number;
//   location: {
//     lat: number;
//     lng: number;
//   };
// };

// const NearbyWashermenMap: React.FC = () => {
//   const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [washermen, setWashermen] = useState<Washerman[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         setCustomerLocation({ lat: latitude, lng: longitude });
//         await fetchNearbyWashermen(latitude, longitude);
//         setLoading(false);
//       },
//       (err) => {
//         setError('📍 Location access denied. Please enable location services and refresh.');
//         setLoading(false);
//       }
//     );
//   }, []);

//   const fetchNearbyWashermen = async (lat: number, lng: number) => {
//     try {
//       const res = await fetch(`/api/washer/nearby?lat=${lat}&lng=${lng}`);
//       if (!res.ok) throw new Error("Failed to fetch washermen.");
//       const data = await res.json();
//       setWashermen(data);
//     } catch (err: any) {
//       setError(err.message || "Something went wrong.");
//     }
//   };

//   return (
//     <div style={{ height: '100vh', width: '100%' }}>
//       {loading && <div>Loading map...</div>}
//       {error && <div style={{ color: 'red' }}>{error}</div>}

//       {!loading && customerLocation && (
//         <MapContainer center={customerLocation} zoom={15} style={{ height: '100%', width: '100%' }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {/* Customer Marker */}
//           <Marker position={customerLocation}>
//             <Popup>You are here</Popup>
//           </Marker>

//           {/* Washermen Markers */}
//           {washermen
//             .filter(w => w.location?.lat != null && w.location?.lng != null)
//             .map((washerman) => {
//               const distance = getDistanceFromLatLonInMeters(
//                 customerLocation.lat,
//                 customerLocation.lng,
//                 washerman.location.lat,
//                 washerman.location.lng
//               );

//               const inRange = distance <= (washerman.range || 500);

//               return (
//                 <React.Fragment key={washerman._id}>
//                   <Marker
//                     position={{ lat: washerman.location.lat, lng: washerman.location.lng }}
//                     opacity={inRange ? 1 : 0.4}
//                   >
//                     <Popup>
//                       <strong>{washerman.name}</strong>
//                       <br />📞 {washerman.contact}
//                       <br />📏 {distance.toFixed(0)} meters
//                       <br />{inRange ? '✅ Available' : '❌ Out of range'}
//                     </Popup>
//                   </Marker>

//                   <Circle
//                     center={{ lat: washerman.location.lat, lng: washerman.location.lng }}
//                     radius={washerman.range || 500}
//                     pathOptions={{ color: inRange ? 'green' : 'gray', fillOpacity: 0.1 }}
//                   />
//                 </React.Fragment>
//               );
//             })}
//         </MapContainer>
//       )}
//     </div>
//   );
// };

// export default NearbyWashermenMap;
