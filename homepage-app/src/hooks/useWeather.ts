import { useEffect, useState } from 'react';
import { LOCATION } from '../config';

export interface Weather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windspeed: number;
  weathercode: number;
  isDay: number;
}

const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Clear Sky', emoji: '☀️' },
  1: { label: 'Mainly Clear', emoji: '🌤️' },
  2: { label: 'Partly Cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Icy Fog', emoji: '🌫️' },
  51: { label: 'Light Drizzle', emoji: '🌦️' },
  53: { label: 'Drizzle', emoji: '🌦️' },
  55: { label: 'Heavy Drizzle', emoji: '🌧️' },
  61: { label: 'Light Rain', emoji: '🌧️' },
  63: { label: 'Rain', emoji: '🌧️' },
  65: { label: 'Heavy Rain', emoji: '🌧️' },
  71: { label: 'Light Snow', emoji: '🌨️' },
  73: { label: 'Snow', emoji: '❄️' },
  75: { label: 'Heavy Snow', emoji: '❄️' },
  80: { label: 'Rain Showers', emoji: '🌦️' },
  81: { label: 'Showers', emoji: '🌧️' },
  82: { label: 'Heavy Showers', emoji: '⛈️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  99: { label: 'Thunderstorm w/ Hail', emoji: '⛈️' },
};

export function getWeatherInfo(code: number) {
  return WMO_CODES[code] ?? { label: 'Unknown', emoji: '🌡️' };
}

const REFRESH_MS = 5 * 60 * 1000; // re-fetch weather every 5 minutes

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

    let cancelled = false;

    const fetchWeather = async (silent: boolean) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        const c = data.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          windspeed: Math.round(c.wind_speed_10m),
          weathercode: c.weather_code,
          isDay: c.is_day,
        });
        setError(null);
      } catch {
        if (!cancelled) setError('Unable to fetch weather');
      } finally {
        if (!cancelled && !silent) setLoading(false);
      }
    };

    // Initial fetch shows the loading state; subsequent polls update silently
    fetchWeather(false);
    const id = setInterval(() => fetchWeather(true), REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { weather, loading, error };
}
