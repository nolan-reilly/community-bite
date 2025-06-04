'use client';
import { useState, useRef, useEffect } from 'react';
import { Libraries, useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries: Libraries = ['places'];

interface AddAutoProps {
  handleAddressChange: (address: string) => void, // function to return the address to parent element
}

export default function AddressAutocomplete({ handleAddressChange }: AddAutoProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY || '',
    libraries: libraries,
  })

  const [address, setAddress] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (isLoaded && !sessionToken.current) {
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
      console.log(process.env.NEXT_PUBLIC_GOOGLE_KEY);
    }
  }, [isLoaded]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setAddress(place.formatted_address);
        handleAddressChange(place.formatted_address);
        // extract other address components if needed
        console.log(place);
        sessionToken.current = new google.maps.places.AutocompleteSessionToken();
      }
    }
  };

  if (loadError) return <div>Error loading maps!</div>;
  if (!isLoaded) return <input className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#BACBA9]" type='text' disabled={true} placeholder='Address API loading...' />;

  return (
    <div>
      <Autocomplete 
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: {country: 'US'}
        }}
      >
        <input
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#BACBA9]"
          type="text"
          placeholder='Enter your address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Autocomplete>
    </div>
  );
}

