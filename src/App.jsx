import { useState } from 'react'
import CodeEditor from './components/CodeEditor'
import ConsoleOutput from './components/ConsoleOutput'
import { useJsRunner } from './hooks/useJsRunner'

const DEFAULT_CODE = `const greeting = "Hello, world";
console.log(greeting);

function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));
`

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const { logs, isRunning, status, run, stop, clearLogs } = useJsRunner()

  return (
    <div className="flex h-dvh min-h-[32rem] flex-col gap-4 overflow-hidden bg-[#0f1115] px-4 py-4 font-sans text-[#e8edf7] sm:px-6 sm:py-5">
      <header className="flex shrink-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8b95a8] ">Made by Joy Swarnakar </p>
          <h1 className="text-2xl font-semibold tracking-tight">JavaScript Compiler Playground 🚀</h1>
        </div>
        <div className="flex gap-2">
          {isRunning ? (
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-[#ff6b7a] px-4 py-2 text-sm font-semibold text-[#1a0d10] transition-colors hover:bg-[#ff8290] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b7a]"
              onClick={stop}
            >
              Stop
            </button>
          ) : (
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-[#5b7cff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7c9cff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c9cff]"
              onClick={() => run(code)}
            >
              Run
            </button>
          )}
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-[#2a3346] px-4 py-2 text-sm font-semibold text-[#e8edf7] transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c9cff]"
            onClick={clearLogs}
          >
            Clear
          </button>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(10rem,0.7fr)] gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:grid-rows-1">
        <CodeEditor value={code} onChange={setCode} onRun={() => run(code)} />
        <ConsoleOutput logs={logs} status={status} />
      </main>
    </div>
  )
}
