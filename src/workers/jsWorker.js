function serialize(value, seen = new WeakSet()) {
  if (value === null) return { kind: 'null' }
  if (value === undefined) return { kind: 'undefined' }

  const type = typeof value

  if (type === 'string' || type === 'boolean') {
    return { kind: type, value }
  }

  if (type === 'number') {
    if (Number.isNaN(value)) return { kind: 'nan' }
    if (value === Infinity) return { kind: 'infinity' }
    if (value === -Infinity) return { kind: 'n-infinity' }
    return { kind: 'number', value }
  }

  if (type === 'bigint') {
    return { kind: 'bigint', value: `${value}n` }
  }

  if (type === 'symbol') {
    return { kind: 'symbol', value: value.toString() }
  }

  if (type === 'function') {
    return { kind: 'function', value: value.name || 'anonymous' }
  }

  if (value instanceof Error) {
    return {
      kind: 'error',
      value: value.stack || `${value.name}: ${value.message}`,
    }
  }

  if (value instanceof Date) {
    return { kind: 'date', value: value.toISOString() }
  }

  if (value instanceof RegExp) {
    return { kind: 'regexp', value: value.toString() }
  }

  if (typeof value === 'object') {
    if (seen.has(value)) return { kind: 'circular' }
    seen.add(value)

    if (Array.isArray(value)) {
      return { kind: 'array', value: value.map((item) => serialize(item, seen)) }
    }

    if (value instanceof Map) {
      return {
        kind: 'map',
        value: [...value.entries()].map(([k, v]) => [
          serialize(k, seen),
          serialize(v, seen),
        ]),
      }
    }

    if (value instanceof Set) {
      return {
        kind: 'set',
        value: [...value.values()].map((item) => serialize(item, seen)),
      }
    }

    const obj = {}
    for (const key of Object.keys(value)) {
      try {
        obj[key] = serialize(value[key], seen)
      } catch {
        obj[key] = { kind: 'unknown', value: '[unserializable]' }
      }
    }
    return { kind: 'object', value: obj }
  }

  return { kind: 'unknown', value: String(value) }
}

self.onmessage = async (event) => {
  const { id, code } = event.data

  const emit = (level, args) => {
    self.postMessage({
      id,
      type: 'log',
      level,
      args: args.map((arg) => serialize(arg)),
    })
  }

  const consoleProxy = {
    log: (...args) => emit('log', args),
    info: (...args) => emit('info', args),
    warn: (...args) => emit('warn', args),
    error: (...args) => emit('error', args),
    debug: (...args) => emit('debug', args),
    table: (...args) => emit('log', args),
    dir: (...args) => emit('log', args),
    clear: () => self.postMessage({ id, type: 'clear' }),
  }

  try {
    const run = new Function(
      'console',
      `"use strict"; return (async () => {\n${code}\n})();`,
    )
    await run(consoleProxy)
    self.postMessage({ id, type: 'done' })
  } catch (error) {
    self.postMessage({
      id,
      type: 'runtime-error',
      error: serialize(error),
    })
    self.postMessage({ id, type: 'done' })
  }
}
