import { useQuery } from '@tanstack/react-query';
import { getChannelDataFromServer } from '../server/serverApi';

function useFetchChannelDataFromServer(telegramChannelId: number) {

    const { isPending, error, data} = useQuery({
        queryKey: [`getChannelData:${telegramChannelId}`],
        queryFn: async () => await getChannelDataFromServer(telegramChannelId),
    });
    
  return{
    isPending, error, data
  };
}

export default useFetchChannelDataFromServer