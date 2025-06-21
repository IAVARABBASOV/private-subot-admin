import React, { useEffect, useState } from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IChannel } from '../../types';
import WebApp from '@twa-dev/sdk';
import useFetchChannelDataFromServer from '../../hooks/useFetchChannelDataFromServer';

interface ChannelCardProps {
  channelId: number;
}

export function ChannelCard({ channelId }: ChannelCardProps) {
  const navigate = useNavigate();
  const [channel, setChannel] = useState<IChannel | undefined>(undefined);

  const { isPending, error, data } = useFetchChannelDataFromServer(channelId);

  useEffect(() => 
  {
    if(channel !== data){
      setChannel(data);
    }
    
  },[isPending, error, data, channelId]);

  const handleClick = () => {
    // navigate(`/channel/${encodeURIComponent(channel.id)}`);
    navigate("/channel", { state: { channelId: channelId }});
    console.log("Open Channel:", data);
  };

  return (
    <div>
    { channel &&
      <button 
        onClick={handleClick}
        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between"
        style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
      >
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white text-left">
            {channel.title} | {channel.type}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-[#0088cc]" />
            <span>{channel.subscribers.length} subscribers</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#0088cc]" />
      </button>
      }
    </div>
  );
}