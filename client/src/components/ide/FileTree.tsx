import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Search, Plus, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FileNode, useIDEStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fileIcons: Record<string, { icon: string; color: string }> = {
  ts: { icon: 'TS', color: 'text-blue-400' },
  tsx: { icon: 'TSX', color: 'text-blue-400' },
  js: { icon: 'JS', color: 'text-yellow-400' },
  jsx: { icon: 'JSX', color: 'text-yellow-400' },
  json: { icon: '{ }', color: 'text-yellow-500' },
  md: { icon: 'MD', color: 'text-gray-400' },
  css: { icon: '#', color: 'text-pink-400' },
  html: { icon: '<>', color: 'text-orange-400' },
};

function getFileIcon(name: string) {
  const ext = name.split('.').pop() || '';
  return fileIcons[ext] || { icon: '', color: 'text-muted-foreground' };
}

interface FileTreeItemProps {
  node: FileNode;
  path: string;
  depth: number;
}

function FileTreeItem({ node, path, depth }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { openFile, activeTabId } = useIDEStore();
  const isActive = activeTabId === node.id;
  const fileIcon = getFileIcon(node.name);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      openFile(node, path);
    }
  };

  return (
    <div>
      <motion.div
        className={cn(
          "flex items-center gap-1 px-2 py-1 cursor-pointer rounded-sm transition-colors group",
          "hover:bg-accent/50",
          isActive && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.1 }}
        data-testid={`file-item-${node.id}`}
      >
        {node.type === 'folder' ? (
          <>
            <span className="text-muted-foreground w-4 h-4 flex items-center justify-center">
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
            <span className="text-cyan w-4 h-4 flex items-center justify-center">
              {isOpen ? (
                <FolderOpen className="w-4 h-4" />
              ) : (
                <Folder className="w-4 h-4" />
              )}
            </span>
          </>
        ) : (
          <>
            <span className="w-4" />
            {fileIcon.icon ? (
              <span className={cn("text-[10px] font-bold font-mono w-4 text-center", fileIcon.color)}>
                {fileIcon.icon}
              </span>
            ) : (
              <File className="w-4 h-4 text-muted-foreground" />
            )}
          </>
        )}
        <span className="text-sm truncate flex-1">{node.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
          data-testid={`file-menu-${node.id}`}
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {node.type === 'folder' && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children.map((child) => (
              <FileTreeItem
                key={child.id}
                node={child}
                path={`${path}/${child.name}`}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileTree() {
  const { files, sidebarOpen } = useIDEStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (!sidebarOpen) return null;

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full" data-testid="file-tree">
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explorer
          </h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              data-testid="new-file-btn"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="h-7 pl-7 text-xs bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="file-search-input"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {files.map((file) => (
          <FileTreeItem
            key={file.id}
            node={file}
            path={file.name}
            depth={0}
          />
        ))}
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">collab-code</span>
          <span className="mx-2">•</span>
          <span>4 files</span>
        </div>
      </div>
    </div>
  );
}
