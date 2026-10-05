import { formatValue } from '../lib/formatValue'

const statusColors = {
  running: 'text-[#7c9cff]',
  timeout: 'text-[#ff6b7a]',
  error: 'text-[#ff6b7a]',
  stopped: 'text-[#f0c14b]',
}

const levelColors = {
  warn: 'text-[#f0c14b]',
  error: 'text-[#ff6b7a]',
  info: 'text-[#93c5fd]',
  debug: 'text-[#93c5fd]',
  log: 'text-[#93c5fd]',
}

const toneColors = {
  warn: 'text-[#f0c14b]',
  error: 'text-[#ff6b7a]',
  string: 'text-[#9ddeb0]',
  number: 'text-[#7dd3fc]',
  keyword: 'text-[#c4b5fd]',
  muted: 'text-[#8b95a8]',
  default: 'text-[#e8edf7]',
}

function LogLine({ entry }) {
  return (
    <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-2.5 border-b border-[#2a3346]/70 py-2">
      <span className={`pt-1 text-[0.68rem] uppercase tracking-[0.08em] ${levelColors[entry.level] ?? 'text-[#8b95a8]'}`}>
        {entry.level}
      </span>
      <div className="flex flex-wrap gap-2 whitespace-pre-wrap break-words">
        {entry.args.map((arg, index) => {
          const formatted = formatValue(arg)
          return <span key={`${entry.id}-${index}`} className={toneColors[formatted.tone] ?? toneColors.default}>{formatted.text}</span>
        })}
      </div>
    </div>
  )
}

export default function ConsoleOutput({ logs, status }) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#2a3346] bg-[#1b2130]">
      <div className="flex shrink-0 items-center justify-between border-b border-[#2a3346] bg-[#161a22] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b95a8]">Console</h2>
        <span className={`text-xs ${statusColors[status] ?? 'text-[#8b95a8]'}`}>{status}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-sm leading-relaxed" aria-live="polite">
        {logs.length === 0 ? (
          <p className="text-[#8b95a8]">
            {status === 'idle'
              ? 'Output will appear here after you run your code.'
              : 'No console output.'}
          </p>
        ) : (
          logs.map((entry) => <LogLine key={entry.id} entry={entry} />)
        )}
      </div>
    </section>
  )
}
