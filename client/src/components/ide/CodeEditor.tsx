import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { X, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIDEStore, findFileById } from '@/lib/store';
import { Button } from '@/components/ui/button';

const languageMap: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  md: 'markdown',
  css: 'css',
  html: 'html',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  go: 'go',
};

export function CodeEditor() {
  const { openTabs, activeTabId, files, setActiveTab, closeTab, updateFileContent, collaborators } = useIDEStore();
  const editorRef = useRef<any>(null);

  const activeFile = activeTabId ? findFileById(files, activeTabId) : null;
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (editorRef.current && activeFile?.content) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== activeFile.content) {
        editorRef.current.setValue(activeFile.content);
      }
    }
  }, [activeTabId, activeFile?.content]);

  const activeCollaborators = collaborators.filter(
    c => c.activeFile === activeTabId && c.status !== 'away'
  );

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden" data-testid="code-editor">
      <div className="flex items-center bg-card border-b border-border overflow-x-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {openTabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, width: 0 }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer transition-colors min-w-max",
                "hover:bg-accent/30",
                activeTabId === tab.id && "bg-background border-b-2 border-b-cyan"
              )}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              <span className="text-xs font-mono text-blue-400">
                {tab.language === 'typescript' ? 'TS' : tab.language === 'json' ? '{}' : ''}
              </span>
              <span className="text-sm">{tab.name}</span>
              {tab.isDirty && (
                <Circle className="w-2 h-2 fill-cyan text-cyan" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                data-testid={`close-tab-${tab.id}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activeCollaborators.length > 0 && (
          <div className="ml-auto flex items-center gap-1 px-3">
            {activeCollaborators.map((user) => (
              <motion.div
                key={user.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: `${user.color}20` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: user.color }}
                />
                <span style={{ color: user.color }}>{user.name}</span>
                {user.status === 'typing' && (
                  <span className="text-muted-foreground">typing...</span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        {activeFile ? (
          <>
            <Editor
              height="100%"
              language={languageMap[activeFile.name.split('.').pop() || ''] || 'plaintext'}
              value={activeFile.content || ''}
              theme="vs-dark"
              onMount={handleEditorMount}
              onChange={(value) => {
                if (activeTabId && value) {
                  updateFileContent(activeTabId, value);
                }
              }}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                lineHeight: 1.6,
                padding: { top: 16 },
                minimap: { enabled: true, scale: 1 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                renderLineHighlight: 'all',
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
              }}
            />
            
            {activeCollaborators.map((user) => (
              user.cursorPosition && (
                <motion.div
                  key={user.id}
                  className="absolute pointer-events-none z-10"
                  style={{
                    left: `${60 + user.cursorPosition.column * 8.4}px`,
                    top: `${16 + (user.cursorPosition.line - 1) * 22.4}px`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="w-0.5 h-5 animate-cursor-blink"
                    style={{ backgroundColor: user.color }}
                  />
                  <div
                    className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap"
                    style={{ backgroundColor: user.color, color: '#0a0f1a' }}
                  >
                    {user.name}
                  </div>
                </motion.div>
              )
            ))}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-10 font-display">{'</>'}</div>
              <p className="text-muted-foreground">No file open</p>
              <p className="text-sm text-muted-foreground/50 mt-1">
                Select a file from the explorer to start editing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
