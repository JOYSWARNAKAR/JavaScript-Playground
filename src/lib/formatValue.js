export function formatValue(node) {
  if (!node) return { text: 'undefined', tone: 'muted' }

  switch (node.kind) {
    case 'null':
      return { text: 'null', tone: 'keyword' }
    case 'undefined':
      return { text: 'undefined', tone: 'muted' }
    case 'nan':
      return { text: 'NaN', tone: 'number' }
    case 'infinity':
      return { text: 'Infinity', tone: 'number' }
    case 'n-infinity':
      return { text: '-Infinity', tone: 'number' }
    case 'string':
      return { text: JSON.stringify(node.value), tone: 'string' }
    case 'number':
    case 'bigint':
      return { text: String(node.value), tone: 'number' }
    case 'boolean':
      return { text: String(node.value), tone: 'keyword' }
    case 'symbol':
    case 'function':
    case 'date':
    case 'regexp':
      return { text: node.kind === 'function' ? `[Function ${node.value}]` : String(node.value), tone: 'muted' }
    case 'error':
      return { text: node.value, tone: 'error' }
    case 'circular':
      return { text: '[Circular]', tone: 'muted' }
    case 'array':
      return {
        text: `[${node.value.map((item) => formatValue(item).text).join(', ')}]`,
        tone: 'default',
      }
    case 'object': {
      const entries = Object.entries(node.value)
        .map(([key, value]) => `${key}: ${formatValue(value).text}`)
        .join(', ')
      return { text: `{ ${entries} }`, tone: 'default' }
    }
    case 'map': {
      const entries = node.value
        .map(([k, v]) => `${formatValue(k).text} => ${formatValue(v).text}`)
        .join(', ')
      return { text: `Map(${node.value.length}) { ${entries} }`, tone: 'default' }
    }
    case 'set':
      return {
        text: `Set(${node.value.length}) { ${node.value.map((item) => formatValue(item).text).join(', ')} }`,
        tone: 'default',
      }
    default:
      return { text: String(node.value ?? node.kind), tone: 'default' }
  }
}
