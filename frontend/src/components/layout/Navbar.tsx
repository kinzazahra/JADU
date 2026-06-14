import React from 'react';
import { Menu, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, signOut } = useAuthStore();

  return (
    <header className="h-16 glass flex items-center justify-between px-6 sticky top-4 z-40 mx-4 md:mx-8 rounded-2xl transition-all duration-300">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="font-semibold text-sm tracking-wide">VayuSync Core</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center border border-white/50 dark:border-white/10 hover:shadow-md transition-all group overflow-hidden">
              <span className="text-sm font-bold text-primary group-hover:scale-110 transition-transform">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass rounded-xl mt-2 border-white/20">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground truncate">
              {user?.email || 'Guest Session'}
            </div>
            <div className="h-px bg-border my-1" />
            <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer rounded-lg m-1 hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4 mr-2" /> Disconnect Core
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}