import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import WebApp from '@twa-dev/sdk';
import ChannelHeader from '../channelUtils/ChannelHeader';
import SearchBar from '../channelUtils/SearchBar';
import MemberCard from '../channelUtils/MemberCard';
import ScrollUp from '../channelUtils/ScrollUp';
import { IChannel, IMember } from '../../types';
import useFetchChannelDataFromServer from '../../hooks/useFetchChannelDataFromServer';
import useFetchAllMembersDataFromServer from '../../hooks/useFetchAllMembersDataFromServer';
import { Button } from '../ui/button';

interface ChannelSubscribersProperties {
  onScrolled?: (isScrolled: boolean) => void;
}

export function ChannelSubscribers({ onScrolled } : ChannelSubscribersProperties) {

  const navigate = useNavigate();

  const location = useLocation();
  const channelId = location.state?.channelId;

  const [channel, setChannel] = useState<IChannel | undefined>(undefined);
  const [allMembers, setAllMembers] = useState<IMember[] | undefined>([]);

  const { isPending, error, data } = useFetchChannelDataFromServer(channelId);
  const { isPendingMembers, errorMembers, membersData } = useFetchAllMembersDataFromServer(channelId);

  useEffect(() => 
  {
    if(channel !== data){
      setChannel(data);
    }
  },[isPending, error, data, channelId]);

  useEffect(() => 
  {
    if(membersData !== allMembers){
      setAllMembers(membersData);
    }
  },[isPendingMembers, errorMembers, membersData]);

  const [processingMember, setProcessingMember] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); if(onScrolled) onScrolled(false); }, []);

  // Filter members by search query
  const filteredMembers = allMembers && allMembers.filter((member) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

    // Group members by role
  const groupedMembers = {
      admin: filteredMembers && filteredMembers.filter((m) => m.role === "admin"),
      subscriber: filteredMembers && filteredMembers.filter((m) => m.role === "subscriber"),
      banned: filteredMembers && filteredMembers.filter((m) => m.role === "banned"),
    };

    const handleAction = async (memberId: number, action: string) => {
      setProcessingMember(memberId);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // toast({
      //   title: "Action completed",
      //   description: `Successfully ${action} user`
      // });
      
      setProcessingMember(null);
    };

    function plansButtonClicked(){
      navigate('/plan', { state: { channelId: channelId }});
    }
  
    if (!channel) {
      return <div className="p-4">Channel not found</div>;
    }

    return (
      <div className="flex flex-col">
        <div
          className="p-5 bg-background sticky border-b"
          style={{ backgroundColor: WebApp.themeParams.secondary_bg_color }}
        >
          <ChannelHeader
            title={channel.title}
            membersCount={allMembers ? allMembers.length : 0}
            inviteLink={channel.inviteLink}
          />
          <Button onClick={plansButtonClicked}>Plans</Button>
        </div>
    
        {
          allMembers &&
          <>
            <div className='p-2 background sticky top-16 z-10'>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            <Tabs defaultValue="subscriber" className="flex-1 relative bottom-5 z-0">
              <TabsList className="grid grid-cols-3 ">
                <TabsTrigger value="subscriber">
                  Subscribers ({groupedMembers.subscriber!!.length})
                </TabsTrigger>
                <TabsTrigger value="admin">
                  Admins ({groupedMembers.admin!!.length})
                </TabsTrigger>
                <TabsTrigger value="banned">
                  Banned ({groupedMembers.banned!!.length})
                </TabsTrigger>
              </TabsList>
        
              <ScrollUp
                  threshold={150}
                  onVisible={onScrolled}
                />
              <div className="p-3 h pb-12">
                <TabsContent
                  value="subscriber"
                  className="space-y-4 mt-0 h-full overflow-y-auto"
                >
                  {groupedMembers.subscriber!!.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      role="subscriber"
                      processingMember={processingMember}
                      onAction={handleAction}
                    />
                  ))}
                </TabsContent>
        
                <TabsContent
                  value="admin"
                  className="space-y-4 mt-0 h-full overflow-y-auto"
                >
                  {groupedMembers.admin!!.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      role="admin"
                      processingMember={processingMember}
                      onAction={handleAction}
                    />
                  ))}
                </TabsContent>
        
                <TabsContent
                  value="banned"
                  className="space-y-4 mt-0 mb-0 h-full overflow-y-auto"
                >
                  {groupedMembers.banned!!.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      role="banned"
                      processingMember={processingMember}
                      onAction={handleAction}
                    />
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </>
        }
      </div>
    );
}