import { LucideIcon } from 'lucide-react';

export interface TabBarItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface TabBarProps {
  onTabChange?: (tabId: string) => void;
}
