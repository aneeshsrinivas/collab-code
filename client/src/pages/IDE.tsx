import { useEffect } from 'react';
import { useRoute } from 'wouter';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Toolbar } from '@/components/ide/Toolbar';
import { FileTree } from '@/components/ide/FileTree';
import { CodeEditor } from '@/components/ide/CodeEditor';
import { Terminal } from '@/components/ide/Terminal';
import { AIAssistant } from '@/components/ide/AIAssistant';
import { useIDEStore } from '@/lib/store';
import { useToast } from "@/hooks/use-toast";

let socket: any;

export default function IDE() {
  const [match, params] = useRoute("/room/:roomId");
  const roomId = params?.roomId;
  const { terminalOpen, aiPanelOpen, updateFileContent } = useIDEStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!roomId) return;

    socket = io();

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('join-room', roomId);
      toast({ title: "Connected", description: "You are live in the room.", className: "bg-green-500 text-white" });
    });

    socket.on('code-update', (data: any) => {
      if (data.fileId && data.content) {
        // Update the file content in the store
        // Note: In a real CRDT system, this would be more complex.
        // For now, we simple overwrite to show connectivity.
        updateFileContent(data.fileId, data.content);
      }
    });

    socket.on('user-joined', (userId: string) => {
      toast({ title: "New Collaborator", description: `User ${userId} joined.` });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

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

      <StatusBar roomId={roomId} />
    </motion.div>
  );
}

function StatusBar({ roomId }: { roomId?: string }) {
  const { collaborators, openTabs, activeTabId } = useIDEStore();
  const activeTab = openTabs.find(t => t.id === activeTabId);
  const onlineCount = collaborators.filter(c => c.status !== 'away').length + 1;

  return (
    <div className="h-6 bg-cyan/10 border-t border-cyan/20 flex items-center justify-between px-3 text-xs" data-testid="status-bar">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-muted-foreground">{roomId ? `Room: ${roomId}` : 'Connected'}</span>
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
