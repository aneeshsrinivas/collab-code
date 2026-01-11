import { create } from 'zustand';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursorPosition?: { line: number; column: number };
  activeFile?: string;
  status: 'online' | 'away' | 'typing';
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  language: string;
  isDirty: boolean;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface IDEState {
  files: FileNode[];
  openTabs: Tab[];
  activeTabId: string | null;
  terminalOutput: TerminalLine[];
  collaborators: User[];
  currentUser: User;
  aiMessages: AIMessage[];
  aiPanelOpen: boolean;
  terminalOpen: boolean;
  sidebarOpen: boolean;
  isExecuting: boolean;
  workspaceMode: 'standard' | 'interview' | 'mentor' | 'competitive';
  timer: number | null;

  setActiveTab: (id: string) => void;
  openFile: (file: FileNode, path: string) => void;
  closeTab: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  addTerminalLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  clearTerminal: () => void;
  toggleAIPanel: () => void;
  toggleTerminal: () => void;
  toggleSidebar: () => void;
  addAIMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  runCode: () => void;
  setExecuting: (executing: boolean) => void;
}

const sampleFiles: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'src/index.ts',
        name: 'index.ts',
        type: 'file',
        language: 'typescript',
        content: `import express from 'express';
import { createServer } from 'http';
import { setupWebSocket } from './websocket';
import { router } from './routes';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use('/api', router);

// WebSocket setup for real-time collaboration
setupWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
      },
      {
        id: 'src/websocket.ts',
        name: 'websocket.ts',
        type: 'file',
        language: 'typescript',
        content: `import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function setupWebSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('code-change', (data) => {
      socket.to(data.roomId).emit('code-update', data);
    });

    socket.on('cursor-move', (data) => {
      socket.to(data.roomId).emit('cursor-update', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}`
      },
      {
        id: 'src/routes.ts',
        name: 'routes.ts',
        type: 'file',
        language: 'typescript',
        content: `import { Router } from 'express';
import { executeCode } from './execution';

export const router = Router();

router.post('/execute', async (req, res) => {
  const { code, language } = req.body;
  
  try {
    const result = await executeCode(code, language);
    res.json({ success: true, output: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});`
      }
    ]
  },
  {
    id: 'tests',
    name: 'tests',
    type: 'folder',
    children: [
      {
        id: 'tests/index.test.ts',
        name: 'index.test.ts',
        type: 'file',
        language: 'typescript',
        content: `import { describe, it, expect } from 'vitest';

describe('Server', () => {
  it('should start without errors', () => {
    expect(true).toBe(true);
  });
  
  it('should handle WebSocket connections', async () => {
    // Test WebSocket connection handling
    const mockSocket = { id: 'test-socket' };
    expect(mockSocket.id).toBeDefined();
  });
});`
      }
    ]
  },
  {
    id: 'package.json',
    name: 'package.json',
    type: 'file',
    language: 'json',
    content: `{
  "name": "collab-code-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2"
  }
}`
  },
  {
    id: 'README.md',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# Collab-Code Server

Real-time collaborative code editor backend.

## Features

- 🔄 Real-time code synchronization
- 👥 Multi-user collaboration
- Code execution engine
- 🔒 Secure sandboxed environments

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`
`
  }
];

const collaborators: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'SC',
    color: '#00d4ff',
    status: 'typing',
    activeFile: 'src/index.ts',
    cursorPosition: { line: 12, column: 8 }
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    avatar: 'AR',
    color: '#a855f7',
    status: 'online',
    activeFile: 'src/websocket.ts',
    cursorPosition: { line: 5, column: 15 }
  },
  {
    id: 'user-3',
    name: 'Jordan Kim',
    avatar: 'JK',
    color: '#22c55e',
    status: 'away'
  }
];

export const useIDEStore = create<IDEState>((set, get) => ({
  files: sampleFiles,
  openTabs: [
    { id: 'src/index.ts', name: 'index.ts', path: 'src/index.ts', language: 'typescript', isDirty: false }
  ],
  activeTabId: 'src/index.ts',
  terminalOutput: [
    { id: '1', type: 'output', content: '$ npm run dev', timestamp: new Date() },
    { id: '2', type: 'success', content: 'Server running on port 3000', timestamp: new Date() },
    { id: '3', type: 'output', content: 'Watching for file changes...', timestamp: new Date() }
  ],
  collaborators,
  currentUser: {
    id: 'current-user',
    name: 'You',
    avatar: 'ME',
    color: '#f59e0b',
    status: 'online',
    activeFile: 'src/index.ts'
  },
  aiMessages: [],
  aiPanelOpen: false,
  terminalOpen: true,
  sidebarOpen: true,
  isExecuting: false,
  workspaceMode: 'standard',
  timer: null,

  setActiveTab: (id) => set({ activeTabId: id }),

  openFile: (file, path) => {
    const { openTabs } = get();
    const existingTab = openTabs.find(tab => tab.id === file.id);

    if (existingTab) {
      set({ activeTabId: file.id });
    } else {
      const newTab: Tab = {
        id: file.id,
        name: file.name,
        path,
        language: file.language || 'plaintext',
        isDirty: false
      };
      set({
        openTabs: [...openTabs, newTab],
        activeTabId: file.id
      });
    }
  },

  closeTab: (id) => {
    const { openTabs, activeTabId } = get();
    const newTabs = openTabs.filter(tab => tab.id !== id);
    let newActiveId = activeTabId;

    if (activeTabId === id) {
      const closedIndex = openTabs.findIndex(tab => tab.id === id);
      newActiveId = newTabs[closedIndex - 1]?.id || newTabs[0]?.id || null;
    }

    set({ openTabs: newTabs, activeTabId: newActiveId });
  },

  updateFileContent: (id, content) => {
    const { openTabs } = get();
    set({
      openTabs: openTabs.map(tab =>
        tab.id === id ? { ...tab, isDirty: true } : tab
      )
    });
  },

  addTerminalLine: (line) => {
    const { terminalOutput } = get();
    set({
      terminalOutput: [...terminalOutput, {
        ...line,
        id: Date.now().toString(),
        timestamp: new Date()
      }]
    });
  },

  clearTerminal: () => set({ terminalOutput: [] }),

  toggleAIPanel: () => set(state => ({ aiPanelOpen: !state.aiPanelOpen })),

  toggleTerminal: () => set(state => ({ terminalOpen: !state.terminalOpen })),

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  addAIMessage: (message) => {
    const { aiMessages } = get();
    set({
      aiMessages: [...aiMessages, {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date()
      }]
    });
  },

  runCode: () => {
    const { addTerminalLine, setExecuting } = get();
    setExecuting(true);
    addTerminalLine({ type: 'input', content: '$ npm run dev' });

    setTimeout(() => {
      addTerminalLine({ type: 'output', content: 'Compiling TypeScript...' });
    }, 300);

    setTimeout(() => {
      addTerminalLine({ type: 'success', content: '✓ Build completed in 234ms' });
      addTerminalLine({ type: 'success', content: 'Server running on port 3000' });
      setExecuting(false);
    }, 1200);
  },

  setExecuting: (executing) => set({ isExecuting: executing })
}));

export const findFileById = (files: FileNode[], id: string): FileNode | null => {
  for (const file of files) {
    if (file.id === id) return file;
    if (file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  return null;
};
