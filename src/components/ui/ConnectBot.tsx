import React, { useEffect } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import TgsSticker from '../../telegram/TgsSticker';
import WebApp from '@twa-dev/sdk';

const groupInviteDeepLink = 'https://t.me/private_subot?startgroup&admin=invite_users+restrict_members+pin_messages+delete_messages';
const channelInviteDeepLink = 'https://t.me/private_subot?startchannel&admin=invite_users+restrict_members+pin_messages+delete_messages';

function ConnectBot() {

  useEffect(() => {
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('h-full');
    window.scrollTo({ top: 0, behavior: "instant" });
        
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('h-full');
    };
  }, []);

  function openBot(){
    WebApp.openTelegramLink('https://t.me/private_subot?start');

    WebApp.HapticFeedback.impactOccurred('light');
  }

  function openChannelClicked(){
    WebApp.openTelegramLink(channelInviteDeepLink);

    WebApp.HapticFeedback.impactOccurred('light');
  }

  function openGroupClicked(){
    WebApp.openTelegramLink(groupInviteDeepLink);

    WebApp.HapticFeedback.impactOccurred('light');
  }

  return (
    <div className="bg-slate-900 flex items-center justify-center p-4 p-3 space-y-6 h-screen">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <TgsSticker classname={'size-44 translate-y-0'}/>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Connect bot</h2>
          <p className="mt-2 text-sm text-white">
            Add <span className="font-mono bg-slate-800 px-2 py-1 rounded text-blue-400" onClick={openBot}>@private_subot</span> as an Admin to your channel and grant permissions.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button onClick={openChannelClicked} className="group relative bg-slate-800 p-6 rounded-xl transition-all duration-300 hover:bg-slate-700 hover:shadow-xl hover:-translate-y-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
              <span className="text-white font-medium">Channel</span>
            </div>
          </button>

          <button onClick={openGroupClicked} className="group relative bg-slate-800 p-6 rounded-xl transition-all duration-300 hover:bg-slate-700 hover:shadow-xl hover:-translate-y-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <span className="text-white font-medium">Group Chat</span>
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-slate-400 mt-8">
          The bot won't anything without your consent.
        </p>

        {/* Detailed Instructions Link */}
        {/* <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open Detailed Instruction
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default ConnectBot;