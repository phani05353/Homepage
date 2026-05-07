import { useWeather, getWeatherInfo } from '../hooks/useWeather';
import { LOCATION } from '../config';
import { Wind, Droplets, Thermometer } from 'lucide-react';

export default function WeatherBar() {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        <span className="text-white/60 text-sm">Loading weather…</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="glass rounded-2xl px-5 py-3">
        <span className="text-white/50 text-sm">Weather unavailable</span>
      </div>
    );
  }

  const info = getWeatherInfo(weather.weathercode);

  return (
    <div className="glass rounded-2xl px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-3 sm:gap-4 flex-wrap">
      {/* Always-visible: emoji + temp + condition */}
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl">{info.emoji}</span>
        <div>
          <p className="text-white font-semibold text-base sm:text-lg leading-none">{weather.temp}°C</p>
          <p className="text-white/60 text-[10px] sm:text-xs mt-0.5">{info.label}</p>
        </div>
      </div>

      {/* Detailed metrics + location — only on sm+ to keep mobile compact */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="w-px h-8 bg-white/20" />

        <div className="flex items-center gap-3 text-white/70 text-sm">
          <span className="flex items-center gap-1">
            <Thermometer size={13} />
            Feels {weather.feelsLike}°
          </span>
          <span className="flex items-center gap-1">
            <Droplets size={13} />
            {weather.humidity}%
          </span>
          <span className="flex items-center gap-1">
            <Wind size={13} />
            {weather.windspeed} km/h
          </span>
        </div>

        <div className="w-px h-8 bg-white/20" />

        <p className="text-white/60 text-sm">{LOCATION.label}</p>
      </div>
    </div>
  );
}
