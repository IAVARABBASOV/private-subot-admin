export interface IData {
  id: number;
  username: string;
  channels: number[];
  totalChannelSubscribers: number;
  subscribedChannels: number[];
  transactions: Transaction[];
}

export interface IChannel {
  ownerId: number,
  id: number;
  title: string;
  type: string;
  inviteLink: string;
  subscribers: number[];                          // IData user Id
  subscriptionPlans: SubscriptionPlan[];
};

export interface IMember {
  id: number;
  subscribedChannelId: number;
  username: string;
  startdate: string;
  enddate: string;
  subscriptionPlanId: string;
  role: 'admin' | 'subscriber' | 'banned';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: string;        // Dollar
  description: string;
}

export interface Transaction {
  id: string;
  type: 'withdrawal' | 'subscriber-paid';
  amount: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}