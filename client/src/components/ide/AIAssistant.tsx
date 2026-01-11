import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Loader2, Code, Bug, Lightbulb, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const quickActions = [
  { icon: Code, label: 'Explain code', prompt: 'Explain what this code does' },
  { icon: Bug, label: 'Find bugs', prompt: 'Find potential bugs in this code' },
  { icon: Lightbulb, label: 'Suggest improvements', prompt: 'Suggest improvements for this code' },
  { icon: Zap, label: 'Optimize', prompt: 'Optimize this code for performance' },
];

export function AIAssistant() {
  const { aiPanelOpen, toggleAIPanel, aiMessages, addAIMessage } = useIDEStore();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const handleSubmit = async (prompt?: string) => {
    const message = prompt || input;
    if (!message.trim()) return;

    addAIMessage({ role: 'user', content: message });
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const responses = [
        "I've analyzed your code. The `setupWebSocket` function creates a Socket.io server instance and handles real-time events. Here's a breakdown:\n\n1. **Connection handling**: Listens for new client connections\n2. **Room management**: The `join-room` event allows users to join specific workspaces\n3. **Code sync**: `code-change` broadcasts edits to all room members\n4. **Cursor tracking**: `cursor-move` enables multi-cursor visibility\n\nWould you like me to suggest any improvements?",
        "Looking at your Express routes, I notice a few potential issues:\n\n⚠️ **Missing error types**: The `executeCode` function should have proper TypeScript error typing\n\n⚠️ **No rate limiting**: Consider adding rate limiting to the `/execute` endpoint\n\n✅ **Good practice**: Health check endpoint is properly implemented\n\nShall I help you fix these issues?",
        "Here are some optimizations I'd suggest:\n\n```typescript\n// Use connection pooling\nconst io = new Server(server, {\n  cors: { origin: '*' },\n  connectionStateRecovery: {\n    maxDisconnectionDuration: 2 * 60 * 1000\n  }\n});\n```\n\nThis enables automatic reconnection for temporary disconnects, improving user experience.",
      ];
      
      addAIMessage({ 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)] 
      });
      setIsThinking(false);
    }, 1500);
  };

  if (!aiPanelOpen) return null;

  return (
    <motion.div
      className="w-80 border-l border-border bg-card flex flex-col h-full"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      data-testid="ai-assistant"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-cyan" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan rounded-full animate-pulse" />
          </div>
          <span className="font-medium text-sm">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6"
          onClick={toggleAIPanel}
          data-testid="close-ai-btn"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4"
      >
        {aiMessages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3 box-glow">
                <Sparkles className="w-6 h-6 text-cyan" />
              </div>
              <h3 className="font-medium mb-1">AI Pair Programmer</h3>
              <p className="text-xs text-muted-foreground">
                Ask questions about your code or get suggestions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-3 px-3 flex flex-col items-start gap-1.5 text-left"
                  onClick={() => handleSubmit(action.prompt)}
                  data-testid={`quick-action-${action.label.toLowerCase().replace(' ', '-')}`}
                >
                  <action.icon className="w-4 h-4 text-cyan" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {aiMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-lg p-3",
                  message.role === 'user'
                    ? "bg-cyan/10 border border-cyan/20 ml-4"
                    : "bg-muted/50 mr-4"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'assistant' ? (
                    <Sparkles className="w-3.5 h-3.5 text-cyan" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                      U
                    </div>
                  )}
                  <span className="text-xs font-medium">
                    {message.role === 'user' ? 'You' : 'AI'}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 className="w-4 h-4 animate-spin text-cyan" />
            <span>Thinking...</span>
          </motion.div>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your code..."
            className="min-h-[80px] pr-10 resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            data-testid="ai-input"
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 w-7 h-7 bg-cyan hover:bg-cyan/80"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isThinking}
            data-testid="ai-send-btn"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          AI can make mistakes. Verify important code.
        </p>
      </div>
    </motion.div>
  );
}
