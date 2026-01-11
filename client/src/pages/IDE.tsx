import { motion } from 'framer-motion';
import { Toolbar } from '@/components/ide/Toolbar';
import { FileTree } from '@/components/ide/FileTree';
import { CodeEditor } from '@/components/ide/CodeEditor';
import { Terminal } from '@/components/ide/Terminal';
import { AIAssistant } from '@/components/ide/AIAssistant';
import { useIDEStore } from '@/lib/store';

export default function IDE() {
  const { terminalOpen, aiPanelOpen } = useIDEStore();

  return (
    <motion.div
      className="h-full flex flex-col bg-background overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-testid="ide-page"
    >
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <FileTree />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
          <CodeEditor />
          {terminalOpen && <Terminal />}
        </div>
        
        {aiPanelOpen && <AIAssistant />}
      </div>

      <StatusBar />
    </motion.div>
  );
}

function StatusBar() {
  const { collaborators, openTabs, activeTabId } = useIDEStore();
  const activeTab = openTabs.find(t => t.id === activeTabId);
  const onlineCount = collaborators.filter(c => c.status !== 'away').length + 1;

  return (
    <div className="h-6 bg-cyan/10 border-t border-cyan/20 flex items-center justify-between px-3 text-xs" data-testid="status-bar">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-muted-foreground">Connected</span>
        </div>
        <div className="text-muted-foreground">
          <span className="text-foreground font-medium">{onlineCount}</span> collaborators online
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {activeTab && (
          <>
            <span className="text-muted-foreground">{activeTab.language}</span>
            <span className="text-muted-foreground">UTF-8</span>
            <span className="text-muted-foreground">LF</span>
            <span className="text-muted-foreground">Ln 1, Col 1</span>
          </>
        )}
      </div>
    </div>
  );
}
