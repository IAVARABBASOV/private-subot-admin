import { useQuery } from '@tanstack/react-query';
import { getAllMembersOfChannelDataFromServer } from '../server/serverApi';

function useFetchAllMembersDataFromServer(telegramChannelId: number) {

    const { isPending, error, data} = useQuery({
        queryKey: ['getAllChannelMembers'],
        queryFn: async () => await getAllMembersOfChannelDataFromServer(telegramChannelId),
    });
    
  return{
     isPendingMembers: isPending,
     errorMembers: error, 
     membersData: data
  };
}

export default useFetchAllMembersDataFromServer