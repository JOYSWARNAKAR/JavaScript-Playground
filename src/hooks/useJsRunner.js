import { useCallback, useEffect, useRef, useState } from 'react'

const RUN_TIMEOUT_MS = 5000

function createWorker() {
  return new Worker(new URL('../workers/jsWorker.js', import.meta.url), {
    type: 'module',
  })
}

export function useJsRunner() {
  const workerRef = useRef(null)
  const runIdRef = useRef(0)
  const timeoutRef = useRef(null)
  const [logs, setLogs] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState('idle')

  const resetWorker = useCallback(() => {
    workerRef.current?.terminate()
    workerRef.current = createWorker()
  }, [])

  useEffect(() => {
    workerRef.current = createWorker()
    return () => {
      workerRef.current?.terminate()
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
    setStatus('idle')
  }, [])

  const finishRun = useCallback((nextStatus) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsRunning(false)
    setStatus(nextStatus)
  }, [])

  const run = useCallback(
    (code) => {
      const worker = workerRef.current
      if (!worker || isRunning) return

      const id = runIdRef.current + 1
      runIdRef.current = id
      setIsRunning(true)
      setStatus('running')
      setLogs([])

      worker.onmessage = (event) => {
        if (event.data.id !== runIdRef.current) return

        if (event.data.type === 'log') {
          setLogs((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              level: event.data.level,
              args: event.data.args,
            },
          ])
          return
        }

        if (event.data.type === 'clear') {
          setLogs([])
          return
        }

        if (event.data.type === 'runtime-error') {
          setLogs((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              level: 'error',
              args: [event.data.error],
            },
          ])
          return
        }

        if (event.data.type === 'done') {
          finishRun('done')
        }
      }

      worker.onerror = (event) => {
        setLogs((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            level: 'error',
            args: [
              {
                kind: 'error',
                value: event.message || 'Worker error',
              },
            ],
          },
        ])
        resetWorker()
        finishRun('error')
      }

      timeoutRef.current = window.setTimeout(() => {
        resetWorker()
        setLogs((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            level: 'error',
            args: [
              {
                kind: 'error',
                value: `Execution timed out after ${RUN_TIMEOUT_MS / 1000}s. The worker was stopped.`,
              },
            ],
          },
        ])
        finishRun('timeout')
      }, RUN_TIMEOUT_MS)

      worker.postMessage({ id, code })
    },
    [finishRun, isRunning, resetWorker],
  )

  const stop = useCallback(() => {
    if (!isRunning) return
    resetWorker()
    setLogs((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        level: 'warn',
        args: [{ kind: 'string', value: 'Execution stopped.' }],
      },
    ])
    finishRun('stopped')
  }, [finishRun, isRunning, resetWorker])

  return { logs, isRunning, status, run, stop, clearLogs }
}
