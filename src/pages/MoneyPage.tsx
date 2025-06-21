import React from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Anchor, ArrowUpRight, History } from 'lucide-react';
import { MoneyHeader } from '../components/mobile/MoneyHeader';
import WebApp from '@twa-dev/sdk';
import { IData, Transaction } from '../types';

interface MoneyPageProperties {
  data: IData;
}

export function MoneyPage({data}: MoneyPageProperties) {
  const userAddress = useTonAddress();
  const [amount, setAmount] = React.useState('');
  const [transactions] = React.useState<Transaction[]>(data.transactions);

  const handleWithdraw = async () => {
    if (!userAddress) {
      WebApp.showAlert('Please connect your wallet first');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      WebApp.showAlert('Please enter a valid amount');
      return;
    }

    WebApp.showConfirm(
      `Do you want to withdraw ${numAmount} TON?`,
      async (confirmed) => {
        if (confirmed) {
          try {
            // Implement withdrawal logic here
            WebApp.showAlert('Withdrawal initiated successfully');
            setAmount('');
          } catch (error) {
            WebApp.showAlert('Withdrawal failed. Please try again.');
          }
        }
      }
    );
  };

  return (
    <div className="p-3 space-y-6 dark:text-white">
      <MoneyHeader balanceUSD={100} balanceTON={10} />

      <div className="flex justify-center">
        <div 
          className="p-5 rounded-lg"
          style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Wallet Connection
          </h2>
          <TonConnectButton />
        </div>
      </div>


      {userAddress && (
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Withdraw Funds
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (TON)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                placeholder="Enter amount"
                min="0"
                step="0.1"
              />
            </div>
            <button
              onClick={handleWithdraw}
              className="w-full py-2 px-4 bg-telegram-blue text-white rounded-lg hover:bg-telegram-hover flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </div>
      )}

      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
      >
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Transaction History
          </h2>
        </div>
        <div className="space-y-3">
          { transactions && 
              transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white capitalize">
                    {tx.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tx.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === 'subscriber-paid' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'subscriber-paid' ? '+' : '-'}{tx.amount} TON
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{tx.status}</p>
                </div>
              </div>
          )) || 
          (
            <div className='flex flex-1 w-50 translate-x-0'>
              <Anchor className='w-4 h-4 text-[#0088cc] translate-y-1'/>
              <div className='translate-x-3'>History is Empty</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}