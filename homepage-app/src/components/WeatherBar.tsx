import { useWeather, getWeatherInfo } from '../hooks/useWeather';
import { LOCATION } from '../config';
import { Wind, Droplets, Thermometer } from 'lucide-react';

export default function WeatherBar() {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        <span className="text-white/60 text-sm">Loading weather…</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="glass rounded-2xl px-4 py-3">
        <span className="text-white/50 text-sm">Weather unavailable</span>
      </div>
    );
  }

  const info = getWeatherInfo(weather.weathercode);

  return (
    <div className="glass rounded-2xl px-4 py-3 flex flex-col gap-2 min-w-[150px] sm:min-w-[180px]">
      {/* Hero — large emoji on top, big temp below */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl sm:text-4xl leading-none">{info.emoji}</span>
        <p className="text-white font-semibold text-2xl sm:text-3xl leading-none tabular-nums">
          {weather.temp}°<span className="text-base sm:text-lg text-white/70 font-normal">F</span>
        </p>
      </div>

      {/* Condition label */}
      <p className="text-white/75 text-xs sm:text-sm leading-tight">{info.label}</p>

      {/* Detailed metrics — only on sm+ so mobile stays compact */}
      <div className="hidden sm:flex flex-col gap-1 pt-1.5 border-t border-white/15">
        <div className="flex items-center gap-3 text-white/70 text-[11px]">
          <span className="flex items-center gap-1">
            <Thermometer size={11} />
            Feels {weather.feelsLike}°
          </span>
          <span className="flex items-center gap-1">
            <Droplets size={11} />
            {weather.humidity}%
          </span>
          <span className="flex items-center gap-1">
            <Wind size={11} />
            {weather.windspeed} mph
          </span>
        </div>
        <p className="text-white/50 text-[10px] uppercase tracking-wider">{LOCATION.label}</p>
      </div>
    </div>
  );
}
