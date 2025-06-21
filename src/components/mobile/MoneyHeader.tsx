import React from 'react';
import { DollarSign, AlarmClock, DollarSignIcon, BadgeDollarSign, LucideDollarSign } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import TonLogo from '../../images/TonLogo';

interface MoneyHeaderProps {
  balanceUSD: number;
  balanceTON: number;
}

export function MoneyHeader({ balanceUSD, balanceTON }: MoneyHeaderProps) {
  const [showUSD, setShowUSD] = React.useState(true);

  const toggleCurrency = () => {
    setShowUSD(!showUSD);
  };

  return (
    <div 
      className="p-4 rounded-lg mb-4 cursor-pointer"
      style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
      onClick={toggleCurrency}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showUSD ? (
            <LucideDollarSign className="w-6 h-6 text-green-500" />
          ) : (
            <TonLogo className="w-6 h-6 text-blue-500" />
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Balance
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {showUSD 
              ? `$${balanceUSD.toFixed(2)}` 
              : `${balanceTON.toFixed(2)} TON`}
          </p>
          <p className="text-sm text-gray-500">
            {showUSD 
              ? `${balanceTON.toFixed(2)} TON` 
              : `$${balanceUSD.toFixed(2)}`}
          </p>
        </div>
      </div>
    </div>
  );
}