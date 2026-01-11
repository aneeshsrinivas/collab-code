import { Play, Square, Sparkles, Terminal, PanelLeftClose, PanelLeft, Settings, Share2, Users, Clock, GitBranch, Check, ChevronDown, Search, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIDEStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function Toolbar() {
  const { 
    toggleAIPanel, 
    toggleTerminal, 
    toggleSidebar, 
    sidebarOpen,
    aiPanelOpen,
    terminalOpen,
    runCode,
    isExecuting,
    collaborators,
    workspaceMode
  } = useIDEStore();

  const onlineCount = collaborators.filter(c => c.status !== 'away').length + 1;

  return (
    <div className="h-12 bg-card border-b border-border flex items-center justify-between px-3" data-testid="toolbar">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={toggleSidebar}
              data-testid="toggle-sidebar-btn"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle Sidebar</TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center text-xs font-bold text-background">
            {'</>'}
          </div>
          <span className="font-display font-semibold text-sm">Collab-Code</span>
        </div>

        <div className="h-6 w-px bg-border ml-2" />

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs h-7"
          data-testid="project-dropdown"
        >
          <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
          <span>main</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs h-7 text-green-400"
          data-testid="sync-status"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Saved</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-7 text-xs hidden sm:flex"
          data-testid="command-palette-btn"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <div className="flex items-center gap-0.5 ml-1 text-muted-foreground">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2 mr-2">
          {collaborators.slice(0, 3).map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <motion.div
                  className={cn(
                    "w-7 h-7 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold cursor-pointer",
                    user.status === 'away' && "opacity-50"
                  )}
                  style={{ backgroundColor: user.color }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  data-testid={`collaborator-${user.id}`}
                >
                  {user.avatar}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="text-xs">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground capitalize">{user.status}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          {collaborators.length > 3 && (
            <div className="w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium">
              +{collaborators.length - 3}
            </div>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-7"
              data-testid="online-count"
            >
              <Users className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs">{onlineCount}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{onlineCount} online</TooltipContent>
        </Tooltip>

        {workspaceMode === 'interview' && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/20 text-orange-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">45:00</span>
          </div>
        )}

        <div className="h-6 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={terminalOpen ? "secondary" : "ghost"}
              size="icon"
              className="w-8 h-8"
              onClick={toggleTerminal}
              data-testid="toggle-terminal-btn"
            >
              <Terminal className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle Terminal</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={aiPanelOpen ? "secondary" : "ghost"}
              size="icon"
              className={cn("w-8 h-8", aiPanelOpen && "text-cyan")}
              onClick={toggleAIPanel}
              data-testid="toggle-ai-btn"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">AI Assistant</TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-border" />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className={cn(
              "gap-2 h-8 bg-gradient-to-r from-cyan to-blue-500 hover:from-cyan/90 hover:to-blue-500/90 text-background font-medium",
              isExecuting && "opacity-80"
            )}
            onClick={runCode}
            disabled={isExecuting}
            data-testid="run-btn"
          >
            {isExecuting ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run</span>
              </>
            )}
          </Button>
        </motion.div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              data-testid="share-btn"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Share Workspace</TooltipContent>
        </Tooltip>

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          data-testid="settings-btn"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
