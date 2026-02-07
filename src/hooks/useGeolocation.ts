import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('❌ Geolocation not supported');
            // Use default location (New Delhi, India) as fallback
            console.log('📍 Using default location: New Delhi');
            setState({
                latitude: 28.6139,
                longitude: 77.2090,
                error: null, // Don't show error, just use default location
                loading: false,
            });
            return;
        }

        console.log('📍 Requesting geolocation...');

        const onSuccess = (position: GeolocationPosition) => {
            console.log('✅ Geolocation success:', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
            setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                loading: false,
            });
        };

        const onError = (error: GeolocationPositionError) => {
            let errorMessage = 'Unable to retrieve your location';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location permission denied. Using default location.';
                    console.warn('⚠️ Location denied, using default location (New Delhi)');
                    // Fallback to default location instead of showing error
                    setState({
                        latitude: 28.6139, // New Delhi
                        longitude: 77.2090,
                        error: null, // Don't show error to user
                        loading: false,
                    });
                    return; // Exit early
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'The request to get your location timed out.';
                    break;
            }

            console.error('❌ Geolocation error:', errorMessage, error);

            // For other errors, also use default location
            setState({
                latitude: 28.6139, // New Delhi as fallback
                longitude: 77.2090,
                error: null,
                loading: false,
            });
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // Cache position for 5 minutes
        });
    }, []);

    return state;
};
