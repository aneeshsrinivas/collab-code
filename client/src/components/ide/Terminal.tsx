import { useRef, useEffect, useState } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function Terminal() {
  const { terminalOutput, terminalOpen, toggleTerminal, addTerminalLine, clearTerminal, isExecuting } = useIDEStore();
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    addTerminalLine({ type: 'input', content: `$ ${input}` });
    
    if (input === 'clear') {
      clearTerminal();
    } else if (input.startsWith('echo ')) {
      addTerminalLine({ type: 'output', content: input.slice(5) });
    } else if (input === 'help') {
      addTerminalLine({ type: 'output', content: 'Available commands: clear, help, npm run dev, npm test' });
    } else if (input === 'npm run dev') {
      setTimeout(() => {
        addTerminalLine({ type: 'output', content: 'Compiling...' });
      }, 200);
      setTimeout(() => {
        addTerminalLine({ type: 'success', content: '✓ Server started on port 3000' });
      }, 800);
    } else if (input === 'npm test') {
      setTimeout(() => {
        addTerminalLine({ type: 'output', content: 'Running tests...' });
      }, 200);
      setTimeout(() => {
        addTerminalLine({ type: 'success', content: '✓ 3 tests passed' });
      }, 1000);
    } else {
      addTerminalLine({ type: 'error', content: `Command not found: ${input}` });
    }
    
    setInput('');
  };

  if (!terminalOpen) return null;

  return (
    <motion.div
      className={cn(
        "border-t border-border bg-card flex flex-col",
        isMaximized ? "absolute inset-0 z-50" : "h-52"
      )}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isMaximized ? '100%' : 208, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      data-testid="terminal"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-cyan" />
          <span className="text-xs font-medium">Terminal</span>
          {isExecuting && (
            <motion.div
              className="flex items-center gap-1.5 text-xs text-cyan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              Running...
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => addTerminalLine({ type: 'output', content: '' })}
            data-testid="new-terminal-btn"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={clearTerminal}
            data-testid="clear-terminal-btn"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setIsMaximized(!isMaximized)}
            data-testid="maximize-terminal-btn"
          >
            {isMaximized ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={toggleTerminal}
            data-testid="close-terminal-btn"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-3 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence mode="popLayout">
          {terminalOutput.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "leading-relaxed",
                line.type === 'input' && "text-cyan",
                line.type === 'output' && "text-foreground/80",
                line.type === 'error' && "text-destructive",
                line.type === 'success' && "text-green-400"
              )}
            >
              {line.content}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
          <span className="text-cyan">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-foreground"
            placeholder="Type a command..."
            autoFocus
            data-testid="terminal-input"
          />
        </form>
      </div>
    </motion.div>
  );
}
