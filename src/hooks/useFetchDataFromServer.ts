import { useQuery } from '@tanstack/react-query';
import { getUserDataFromServer } from '../server/serverApi';

function useFetchDataFromServer(telegramUserID: number) {

    const { isPending, error, data} = useQuery({
        queryKey: ['getUserData'],
        queryFn: async () => await getUserDataFromServer(telegramUserID),
    });
    
  return{
    isPending, error, data
  };
}

export default useFetchDataFromServer