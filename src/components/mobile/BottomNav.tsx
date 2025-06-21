import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Users, CreditCard } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

export function BottomNav({isVisible=true}) {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { to: '/channel', icon: Users, label: 'Members' },
    { to: '/money', icon: Wallet, label: 'Money' }
  ];

  return (
    <nav 
    className={`fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-transform duration-250 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ backgroundColor: WebApp.themeParams.bg_color }}
    >
      <div className="flex justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 text-xs ${
                isActive 
                  ? 'text-telegram-blue dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`
            }
          >
            <Icon className="w-6 h-6 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}