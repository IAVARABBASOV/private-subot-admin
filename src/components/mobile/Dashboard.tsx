import React, { useEffect, useRef } from 'react';
import type { IData } from '../../types';
import { StatsCard } from './StatsCard';
import { ChannelCard } from './ChannelCard';
import ScrollUp from '../channelUtils/ScrollUp';
import { Banana, BotOff, Tv } from 'lucide-react';

interface DashboardProps {
  data?: IData;
  onScrolled?: (isScrolled: boolean) => void;
}

export function Dashboard({ data, onScrolled }: DashboardProps) {
  const totalSubscribers = data ? data.totalChannelSubscribers : 0;

  const scrollableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('h-full');
    window.scrollTo({ top: 0, behavior: "instant" });
    
    if(onScrolled) onScrolled(false);
    
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('h-full');
    };
  }, []);
  

  return (
    <div className="p-3 space-y-6 h-screen">
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-2 bg-background sticky top-24 z-10">
        <StatsCard title="Channels" value={data? data.channels.length : 0} type='channel' />
        <StatsCard
          title="Subscribers"
          value={totalSubscribers.toLocaleString()}
          type='user'
        />
      </div>

      {/* Header */}
      <div className="space-y-4">
        {
          data && data.channels.length > 0 &&
          (<h2 className="text-lg font-semibold text-gray-800 dark:text-white bg-background sticky top-25 z-10 gap-0 p-0 w-full flex flex-row">
            <Tv className="translate-x-2 translate-y-1.5 w-4 h-4 text-[#0088cc]"/> 
            <div className='px-4'>Channels</div>
          </h2>) 
          || 
          (
            <div className='flex flex-row '>
              <BotOff className='w-6 h-6 text-[#0088cc] translate-x-2' />
              <div className='translate-x-3'>Channel Not Found!</div>
            </div>
          )
        }
      </div>

      {/* Scrollable list of channels */}
      <div
        ref={scrollableRef}
        className="space-y-4 overflow-y-auto pb-0"
        style={{
          maxHeight: "32vh", // Adjust for non-scrollable sections
        }}
      >
        {data && data.channels.length > 0 && data.channels.map((channelId) => (
          <ChannelCard key={channelId} channelId={channelId} />
        ))}
      </div>
      

      {/* Scroll Up Button */}
      <ScrollUp targetRef={scrollableRef} onVisible={onScrolled}/>
    </div>
  );
}