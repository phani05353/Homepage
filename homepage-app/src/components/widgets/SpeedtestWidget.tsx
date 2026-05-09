import { useState } from 'react';
import { Gauge, Download, Upload, Activity, Play, Square, AlertCircle, ChevronDown } from 'lucide-react';
import { useSpeedtest } from '../../hooks/useSpeedtest';

function formatSpeed(mbps: number | null | undefined): string {
  if (typeof mbps !== 'number' || mbps === 0) return '—';
  if (mbps < 1)   return `${(mbps * 1000).toFixed(0)} Kbps`;
  if (mbps < 100) return `${mbps.toFixed(1)} Mbps`;
  return `${mbps.toFixed(0)} Mbps`;
}

function formatMs(ms: number | null | undefined): string {
  if (typeof ms !== 'number') return '—';
  return `${ms.toFixed(ms < 10 ? 1 : 0)} ms`;
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000)     return 'just now';
  if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function SpeedtestWidget() {
  const { result, running, error, progress, start, stop } = useSpeedtest();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setExpanded((p) => !p);
  };

  const handleWidgetClick = () => {
    if (!expanded) setExpanded(true);
  };

  const handleAction = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    if (running) stop(); else start();
  };

  const display = running ? progress : result;
  const status  = running ? 'Testing' : result ? formatTimeAgo(result.timestamp) : 'Idle';

  return (
    <div
      onClick={handleWidgetClick}
      className={`glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 widget-shadow widget-hover flex flex-col gap-2.5 sm:gap-3 ${
        expanded ? 'min-h-[200px] sm:min-h-[220px]' : 'min-h-[110px] cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 ring-1 ring-cyan-300/20 flex items-center justify-center shrink-0">
            <Gauge size={13} className="text-cyan-200" />
          </div>
          <span className="text-white/70 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase truncate">
            Network Speed
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-cyan-300 ${running ? 'pulse-soft' : ''}`} />
            <span className="text-cyan-200/80 text-[10px] uppercase tracking-wider">{status}</span>
          </span>
          <button onClick={toggleExpanded} className="text-white/40 hover:text-white p-1 -m-1">
            <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Collapsed preview — Down + Up + Latency in a tight row */}
      {!expanded && (display || running) && (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3 tabular-nums">
            <span className="text-white text-base font-semibold leading-tight">
              <Download size={10} className="inline text-cyan-200/70 mr-1 -translate-y-px" />
              {formatSpeed(display?.download)}
            </span>
            <span className="text-white/80 text-base font-semibold leading-tight">
              <Upload size={10} className="inline text-cyan-200/70 mr-1 -translate-y-px" />
              {formatSpeed(display?.upload)}
            </span>
          </div>
          {display?.latency != null && (
            <p className="text-white/55 text-[11px] tabular-nums">
              Latency {formatMs(display.latency)} · Jitter {formatMs(display.jitter)}
            </p>
          )}
        </div>
      )}
      {!expanded && !display && !running && error && (
        <p className="text-red-200/80 text-xs">{error}</p>
      )}
      {!expanded && !display && !running && !error && (
        <p className="text-white/40 text-xs">Not tested yet</p>
      )}

      {/* Expanded body */}
      {expanded && (
        <>
          <div className="flex-1 flex flex-col justify-center">
            {error && !running && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-400/20">
                <AlertCircle size={14} className="text-red-300 shrink-0" />
                <p className="text-red-200/90 text-xs leading-tight">{error}</p>
              </div>
            )}

            {!display && !running && !error && (
              <p className="text-white/40 text-xs text-center">Tap Start to test your connection</p>
            )}

            {(display || running) && !error && (
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-cyan-200/70 text-[10px] uppercase tracking-wider">
                    <Download size={9} /> Down
                  </div>
                  <p className="text-white text-lg font-semibold tabular-nums leading-tight">
                    {formatSpeed(display?.download)}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-cyan-200/70 text-[10px] uppercase tracking-wider">
                    <Upload size={9} /> Up
                  </div>
                  <p className="text-white text-lg font-semibold tabular-nums leading-tight">
                    {formatSpeed(display?.upload)}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 text-cyan-200/70 text-[10px] uppercase tracking-wider">
                    <Activity size={9} /> Latency
                  </div>
                  <p className="text-white text-sm tabular-nums leading-tight">
                    {formatMs(display?.latency)}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-cyan-200/70 text-[10px] uppercase tracking-wider">Jitter</span>
                  <p className="text-white text-sm tabular-nums leading-tight">
                    {formatMs(display?.jitter)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAction}
            className="flex items-center gap-1.5 text-white/40 hover:text-cyan-200 transition-colors text-[11px] uppercase tracking-wider self-end"
          >
            {running ? <Square size={11} /> : <Play size={11} />}
            {running ? 'Stop' : result ? 'Retest' : 'Start'}
          </button>
        </>
      )}
    </div>
  );
}
