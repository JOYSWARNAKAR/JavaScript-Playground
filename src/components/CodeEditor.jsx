import { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

export default function CodeEditor({ value, onChange, onRun }) {
  const onRunRef = useRef(onRun)

  useEffect(() => {
    onRunRef.current = onRun
  }, [onRun])

  const handleMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current?.()
    })
    editor.focus()
  }

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#2a3346] bg-[#1b2130]">
      <div className="flex shrink-0 items-center justify-between border-b border-[#2a3346] bg-[#161a22] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b95a8]">Editor</h2>
        <span className="text-xs text-[#8b95a8]">Ctrl/⌘ + Enter to run</span>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={value}
          onChange={(next) => onChange(next ?? '')}
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace",
            lineHeight: 22,
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            renderLineHighlight: 'line',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>
    </section>
  )
}
