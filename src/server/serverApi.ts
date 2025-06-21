import { IChannel, IData, IMember } from "../types";
import axios from 'axios';

export async function getUserDataFromServer(userid: number) : Promise<IData | undefined> {

    const getDataFromServer = async () => {
       const axiosResult = await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/user/${userid}`);
       console.log("getDataFromServer:", userid, axiosResult.data);

       if(axiosResult.data.data === 'user_not_found'){
            return undefined;
       }

       const userData = axiosResult.data as IData;

       return userData;
    }
  

    return await getDataFromServer();
}

export async function getChannelDataFromServer(channelId: number) : Promise<IChannel | undefined> {

    const getDataFromServer = async () => {
       const axiosResult = await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/channel/${channelId}`);
  
       console.log("Get Channel Data:", channelId);
       const channelData = axiosResult.data as IChannel;

       return channelData;
    }
  

    return await getDataFromServer();
}

export async function getAllMembersOfChannelDataFromServer(channelId: number) : Promise<IMember[] | undefined> {

    const getDataFromServer = async () => {
       const axiosResult = await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/channel/${channelId}/allmembers`);
  
       console.log("Get All Members Data of Channel:", channelId);
       const membersOfChannel = axiosResult.data as IMember[];

       console.log("membersOfChannel:", membersOfChannel);

       return membersOfChannel;
    }
  

    return await getDataFromServer();
}

export async function postChannelDataToServer(channelData: IChannel) {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_MAIN_SERVER_URL}/channel/${channelData.id}`, 
            channelData, // Send channelData directly
            {
                headers: {
                    "Content-Type": "application/json", // Explicit header, though Axios does this automatically
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error posting channel data:", error);
        throw error; // Re-throw to handle it at a higher level if needed
    }
}

