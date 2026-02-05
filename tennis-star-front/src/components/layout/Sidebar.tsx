'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  Home,
  ShoppingCart,
  Tags,
  Package,
  Users,
  BarChart3,
  Percent,
  Gift,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  Store,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ('ADMIN' | 'STAFF' | 'CLIENTE')[];
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['ADMIN', 'STAFF', 'CLIENTE']
  },
  {
    title: 'Ventas',
    href: '/dashboard/sales',
    icon: ShoppingCart,
    roles: ['ADMIN', 'STAFF']
  },
  {
    title: 'Categorías',
    href: '/dashboard/categories',
    icon: Tags,
    roles: ['ADMIN']
  },
  {
    title: 'Marcas',
    href: '/dashboard/brands',
    icon: Package,
    roles: ['ADMIN']
  },
  {
    title: 'Productos',
    href: '/dashboard/products',
    icon: Package,
    roles: ['ADMIN', 'CLIENTE']
  },
  {
    title: 'Clientes',
    href: '/dashboard/customers',
    icon: Users,
    roles: ['ADMIN']
  },
  {
    title: 'Estadísticas',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: ['ADMIN']
  },
  {
    title: 'Descuentos',
    href: '/dashboard/discounts',
    icon: Percent,
    roles: ['ADMIN']
  },
  {
    title: 'Puntos de Lealtad',
    href: '/dashboard/loyalty',
    icon: Gift,
    roles: ['ADMIN']
  },
  {
    title: 'Membresías',
    href: '/dashboard/memberships',
    icon: CreditCard,
    roles: ['ADMIN']
  },
  {
    title: 'Notificaciones',
    href: '/dashboard/notifications',
    icon: Bell,
    roles: ['ADMIN', 'STAFF', 'CLIENTE']
  },
  {
    title: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['ADMIN']
  },
  {
    title: 'Ayuda',
    href: '/dashboard/help',
    icon: HelpCircle,
    roles: ['ADMIN', 'STAFF', 'CLIENTE']
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, isStaff, isCliente } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // ACCESO TOTAL PARA ADMIN - Lógica de filtrado mejorada
  const filteredItems = sidebarItems.filter(item => {
    // Si es ADMIN, tiene acceso a TODO sin excepción
    if (isAdmin) return true;
    
    // Para otros roles, aplicar filtrado normal
    if (!item.roles) return true;
    if (isStaff) return item.roles.includes('STAFF');
    if (isCliente) return item.roles.includes('CLIENTE');
    return false;
  });

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title}>
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground',
            level > 0 && 'pl-6'
          )}
          onClick={hasChildren ? (e) => {
            e.preventDefault();
            toggleExpanded(item.title);
          } : undefined}
        >
          <item.icon className="h-4 w-4" />
          <span className="flex-1">{item.title}</span>
          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">TS</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Tennis Star</h1>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'ADMIN' && 'Administrador'}
              {user?.role === 'STAFF' && 'Staff'}
              {user?.role === 'CLIENTE' && 'Cliente'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map(item => renderSidebarItem(item))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
