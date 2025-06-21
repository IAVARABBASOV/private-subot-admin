import WebApp from "@twa-dev/sdk";
import { Link as LinkIcon, Tv, Users, Share2 } from "lucide-react"; // Import Share2 icon
import React, { useEffect, useState } from "react";

interface ChannelHeaderProps {
  title: string;
  membersCount: number;
  inviteLink: string;
  inviteLinkVisibleCount?: number;
}

const ChannelHeader = ({
  title,
  membersCount,
  inviteLink,
  inviteLinkVisibleCount = 36,
}: ChannelHeaderProps) => {
  const [invitelinkTrimmed, setInviteLinkTrimmed] = useState("");

  function openInviteLink() {
    WebApp.openTelegramLink(inviteLink);
  }

  async function shareInviteLink() {
    await inviteNewUserInTelegram('Hi, I invite you to subscribe my Channel', inviteLink);
  }

  useEffect(() => {
    const trimmedText =
      inviteLink.length > inviteLinkVisibleCount
        ? inviteLink.substring(0, inviteLinkVisibleCount) + "..."
        : inviteLink;
    setInviteLinkTrimmed(trimmedText);
  }, [inviteLink]);

  return (
    <div className="mb-4">
      <div className="flex flex-row">
        <Tv className="translate-y-2 w-4 h-4 text-[#0088cc]" />
        <h1 className="text-2xl font-bold dark:text-white translate-x-2">
          {title}
        </h1>
      </div>

      <div className="flex flex-row">
        <Users className="w-4 h-4 text-[#0088cc]" />
        <div className="text-sm text-gray-600 dark:text-gray-300 translate-x-2">
          {membersCount}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <LinkIcon className="w-4 text-[#0088cc]" />
        <a onClick={openInviteLink} className="hover:text-telegram-blue">
          {invitelinkTrimmed}
        </a>
      </div>
      <button
          onClick={shareInviteLink}
          className="ml-0 flex items-center gap-1 text-sm text-[#0088cc] hover:text-telegram-blue"
        >
          <Share2 className="w-4 h-4" />
          Share Invite Link in Telegram
        </button>
    </div>
  );
};

export function getShareUrl(shareMessage, link){
  return `https://t.me/share/url?url=${encodeURIComponent(shareMessage)}&text=${encodeURIComponent(link)}`;
}

export async function inviteNewUserInTelegram(message, inviteLink){
      
  // Copy referral link to clipboard
  await navigator.clipboard.writeText(inviteLink).then(function() {
      // Open Telegram with a message
      const telegramShareUrl = getShareUrl(message, inviteLink);
     // window.open(telegramShareUrl, '_blank');
     WebApp.openTelegramLink(telegramShareUrl);
  }).catch(function(err) { console.error('Failed to copy referral link:', err); });
}

export default ChannelHeader;
