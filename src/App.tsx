/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { MobileHeader } from './components/mobile/MobileHeader';
import { BottomNav } from './components/mobile/BottomNav';
import { Dashboard } from './components/mobile/Dashboard';
import { ChannelSubscribers } from './components/mobile/ChannelSubscribers';
import { MoneyPage } from './pages/MoneyPage';
import { Toaster } from './components/ui/toaster';
import ConnectBot from './components/ui/ConnectBot';
import useFetchDataFromServer from './hooks/useFetchDataFromServer';
import { IData } from './types';
import Plans from './components/plans/Plans';
import SubscriptionManagement from './pages/SubscriptionManagement';

function App() {
  const { isReady, telegramUserID } = useTelegramWebApp();

  const {isPending, error, data} = useFetchDataFromServer(telegramUserID);

  const [isNavbarVisible, setNavbarVisible] = useState(true);

  const [userData, setUserData] = useState<IData | undefined>(undefined);
  
  const onScrolled = (isScrolled: boolean) => {
    setNavbarVisible(!isScrolled);
  }

  useEffect(() =>{
    if(userData !== data){
      setUserData(data);
    }
  }, [isPending, error, data]);

  if(isPending) {
    return <h1 className='text-3xl text-center my-8 font-bold text-gray-400'>Loading...</h1>
  }

  if (!isReady) {
    console.log("Is Not Ready...");
    return null;
  }

  if(userData === undefined){
    return (
      <ConnectBot/>
    );
  }

  return (
    <TonConnectUIProvider manifestUrl="https://yaver-496.github.io/IA-Entertainment-Dapp/tonconnect-manifest.json">
      <Toaster/>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <>
                <MobileHeader username={userData ? userData.username : 'username'} title="Private Subot Admin" />
                <Dashboard data={userData} onScrolled={onScrolled} />
              </>
            } />
            <Route path="/channel" element={
              <>
                <MobileHeader title="Channel Subscribers"/>
                <ChannelSubscribers onScrolled={onScrolled} />
              </>
            } />
            <Route path="/plan" element={
              <>
                <MobileHeader title="Channel Plan"/>
                <Plans onScrolled={onScrolled}/>
              </>
            } />
            <Route path="/money" element={
              <>
                <MobileHeader title="Money Management"/>
                <MoneyPage data={userData}/>
              </>
            } />
            <Route path="/subscriptions" element={
              <>
                <MobileHeader title="Subscription Management"/>
                <SubscriptionManagement />
              </>
            } />
          </Routes>
          <BottomNav isVisible={isNavbarVisible}/>
      </BrowserRouter>
    </TonConnectUIProvider>
  );
}

export default App;