import { useMutation } from '@tanstack/react-query';
import { IChannel } from './../types';
import { postChannelDataToServer } from '../server/serverApi';

function usePostChannelData() {
    const mutation = useMutation({
        mutationFn: (channelData: IChannel) => postChannelDataToServer(channelData),
        onSuccess: (data) => {
            console.log("Mutation succeeded:", data);
            // Add success logic here, such as showing a toast or refreshing queries
        },
        onError: (error) => {
            console.error("Mutation failed:", error);
            // Handle error logic, e.g., showing an error toast
        },
    });

    return mutation;
}


export default usePostChannelData