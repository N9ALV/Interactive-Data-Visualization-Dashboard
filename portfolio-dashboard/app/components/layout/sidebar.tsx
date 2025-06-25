
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  PieChart,
  BarChart3,
  Shield,
  Brain,
  Settings,
  Menu,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Portfolio overview and key metrics',
  },
  {
    name: 'Portfolio Deep Dive',
    href: '/portfolio',
    icon: PieChart,
    description: 'Detailed portfolio composition analysis',
  },
  {
    name: 'Financial Metrics',
    href: '/metrics',
    icon: BarChart3,
    description: 'Performance and financial analysis',
  },
  {
    name: 'Risk Analysis',
    href: '/risk',
    icon: Shield,
    description: 'Risk assessment and stress testing',
  },
  {
    name: 'NLP Insights',
    href: '/insights',
    icon: Brain,
    description: 'AI-powered sentiment and theme analysis',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configuration and preferences',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('pb-12 w-64', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Portfolio Dashboard
              </h2>
              <p className="text-xs text-muted-foreground">
                Liquidity Income Analytics
              </p>
            </div>
          </div>
        </div>
        <div className="px-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      'sidebar-nav-item group',
                      isActive && 'active'
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
