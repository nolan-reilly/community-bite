'use client';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface Coordinate {
  lat: number,
  lng: number
};

interface EmbMapProps {
  center: Coordinate,
  db_pantries: any[],
  goog_pantries: any[],
  selectedPantry: any,
  setSelectedPantry: (pantry: any) => void
};

const MapPinHouseSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-house">
  <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/>
  <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/><path d="M18 22v-3"/>
  <circle cx="10" cy="10" r="3"/>
</svg>`;

const MapPinCheckSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-check">
  <path d="M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728"/>
  <circle cx="12" cy="10" r="3"/>
  <path d="m16 18 2 2 4-4"/>
</svg>`;

const MapPinPlusSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="purple" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-plus">
  <path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738"/>
  <circle cx="12" cy="10" r="3"/>
  <path d="M16 18h6"/>
  <path d="M19 15v6"/>
</svg>`;

export default function EmbeddedMap({center, db_pantries, goog_pantries, selectedPantry, setSelectedPantry}: EmbMapProps) {
  // const [ selectedPantry, setSelectedPantry ] = useState<any | null>(null);
  const [ mapCenter, setMapCenter ] = useState<Coordinate>(center)
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY || ''
  });

  // MapPinHouse data url
  let centerPin: any = {
    url: `data:image/svg+xml;base64,${btoa(MapPinHouseSVG)}`
  }
  // MapPinCheck data url
  let commBitesPin: any = {
    url: `data:image/svg+xml;base64,${btoa(MapPinCheckSVG)}`
  }
  // MapPinPlus data url
  let additionalPin: any = {
    url: `data:image/svg+xml;base64,${btoa(MapPinPlusSVG)}`
  }

  let mapOptions: any = {
    streetViewControl: false,
    zoomControl: true,
    fullscreenControl: false,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  const calculateBoundsAndZoom = () => {
    if (!isLoaded || (!db_pantries?.length && !goog_pantries?.length)) return;

    const bounds = new google.maps.LatLngBounds();

    bounds.extend(new google.maps.LatLng(center.lat, center.lng));

    db_pantries?.forEach(pantry => {
      bounds.extend(new google.maps.LatLng(
        pantry.location.latitude,
        pantry.location.longitude
      ));
    });

    goog_pantries?.forEach(pantry => {
      bounds.extend(new google.maps.LatLng(
        pantry.location.latitude,
        pantry.location.longitude
      ));
    });

    return bounds;
  };

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (isLoaded && mapRef.current && (db_pantries?.length > 0 || goog_pantries?.length > 0)) {
      const bounds = calculateBoundsAndZoom();
      if (bounds) {
        // Apply the bounds with padding
        mapRef.current.fitBounds(bounds, {
          top: 75,
          right: 75,
          bottom: 30,
          left: 450
        });
        
        // Add a listener to adjust zoom if necessary for Chicago area
        const listener = google.maps.event.addListenerOnce(mapRef.current, 'idle', function() {
          if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom() || 12; // If somehow still undefined, 12 is default
            if (currentZoom > 17) mapRef.current.setZoom(17); // Max zoom
            if (currentZoom < 10) mapRef.current.setZoom(10); // Min zoom
          }
        });
      }
    }
  }, [isLoaded, db_pantries, goog_pantries, center]);

  const handleSelect = (pantry: any) => {
    setSelectedPantry(pantry);
  }

  const handleClose = () => {
    setSelectedPantry(null);
  }

  if (loadError) {
    return (
      <p>Error loading map...</p>
    )
  }
  if (!isLoaded) {
    return (
      <p>Map is Loading...</p>
    )
  }
  if (isLoaded) {
    mapOptions = {
      ...mapOptions,
      mapTypeControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT
      }
    };
    centerPin = {...centerPin, scaledSize: new google.maps.Size(50, 50)};
    commBitesPin = {...commBitesPin, scaledSize: new google.maps.Size(50, 50)};
    additionalPin = {...additionalPin, scaledSize: new google.maps.Size(50, 50)};
  }

  return (
    <div className="w-full h-full" >
      <GoogleMap
        mapContainerStyle={{width: '100%', height: '100%'}}
        center={mapCenter}
        zoom={12}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={mapOptions}
      >
        {/* Center Location Marker */}
        <Marker key={"center"} position={center} icon={centerPin} />

        {/* Community Bites Database Pantries */}
        {db_pantries && db_pantries.map((pantry) => (
          <Marker key={pantry.id} position={{lat: pantry.location.latitude, lng: pantry.location.longitude}} icon={commBitesPin} onClick={() => handleSelect(pantry)}/>
        ))}

        {/* Google Search Pantries */}
        {goog_pantries && goog_pantries.map((pantry) => (
          <Marker key={pantry.id} position={{lat: pantry.location.latitude, lng: pantry.location.longitude}} icon={additionalPin} onClick={() => handleSelect(pantry)}/>
        ))}

        {selectedPantry &&
          <InfoWindow
            position={{lat: selectedPantry.location.latitude, lng: selectedPantry.location.longitude}}
            onCloseClick={handleClose}
            options={{
              pixelOffset: new google.maps.Size(0, -40),
              maxWidth: 400,
              disableAutoPan: false,
            }}
          >
            <div className="p-3">
              <h1 className="font-bold text-xl text-gray-900 mb-1" >{selectedPantry.name}</h1>
              <h2 className="font-medium text-lg mb-2 text-gray-700">{selectedPantry.address}</h2>
              {db_pantries?.includes(selectedPantry) && (
                  <div className="inline-flex items-center gap-1 text-green-600 font-medium mt-1">
                    <span>✓</span>
                    <span>Community Bites Certified</span>
                  </div>
              )}
              {/* Only display inventory for certified pantries */}
              {db_pantries?.includes(selectedPantry) && selectedPantry.inventory && (
                <div className="mt-3 mb-3">
                  <h3 className="font-medium text-sm text-gray-600 mb-1">Currently Available:</h3>
                  <div className="max-h-32 overflow-y-auto rounded p-2">
                    {selectedPantry.inventory.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedPantry.inventory.map((item: any, index: number) => (
                          <span 
                            key={index} 
                            className="inline-block bg-green-100 text-green-900 text-xs px-2 py-1 rounded-full"
                          >
                            {item.produce_name}
                            {item.quantity && ` (${item.quantity})`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No inventory information available</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Link 
                  href={selectedPantry.mapsURL} 
                  target="_blank" 
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium" 
                >
                  <span>Get Directions</span>
                  <span className="text-xs">↗</span>
                </Link>
              </div>
            </div>
          </InfoWindow>
        }
      </GoogleMap>
    </div>
  )
}
