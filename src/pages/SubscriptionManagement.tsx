import React, { useEffect, useState } from 'react';
import { getSubscriptionPlans, createSubscriptionPlan, deleteSubscriptionPlan, updateSubscriptionPlan, getChannelSubscribers } from '../server/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { PlusCircle, Trash2, Edit, AlertCircle, Check, X, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { Toast, ToastProvider, ToastViewport } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';

interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
}

interface Subscriber {
  id: string;
  username: string;
  startdate: string;
  enddate: string;
  subscriptionPlanId: string;
  role: 'admin' | 'subscriber' | 'banned';
  joinLink?: string;
}

const SubscriptionManagement: React.FC = () => {
  const [channelId, setChannelId] = useState<number | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; title: string; description: string; variant: 'success' | 'error' }>({
    open: false,
    title: '',
    description: '',
    variant: 'success'
  });
  
  // New plan form state
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<SubscriptionPlan, 'id'>>({
    name: '',
    duration: '30 days',
    price: '10',
    description: ''
  });
  
  // Edit plan form state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  
  // Load channel ID from local storage
  useEffect(() => {
    const storedChannelId = localStorage.getItem('currentChannelId');
    if (storedChannelId) {
      setChannelId(parseInt(storedChannelId));
    }
  }, []);
  
  // Load subscription plans and subscribers
  useEffect(() => {
    if (channelId) {
      loadSubscriptionPlans();
      loadSubscribers();
    }
  }, [channelId]);
  
  // Load subscription plans
  const loadSubscriptionPlans = async () => {
    if (!channelId) return;
    
    setLoading(true);
    try {
      const response = await getSubscriptionPlans(channelId);
      
      if (response.success) {
        setPlans(response.plans);
      } else {
        setError(response.message || 'Failed to load subscription plans');
      }
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      setError('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };
  
  // Load subscribers
  const loadSubscribers = async () => {
    if (!channelId) return;
    
    setLoading(true);
    try {
      const response = await getChannelSubscribers(channelId);
      
      if (response.success) {
        setSubscribers(response.subscribers);
      } else {
        console.error('Failed to load subscribers:', response.message);
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle new plan form submission
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelId) return;
    
    try {
      const response = await createSubscriptionPlan(channelId, newPlan);
      
      if (response.success) {
        setToast({
          open: true,
          title: 'Success',
          description: 'Subscription plan created successfully',
          variant: 'success'
        });
        
        // Reset form and refresh plans
        setNewPlan({
          name: '',
          duration: '30 days',
          price: '10',
          description: ''
        });
        setShowNewPlanForm(false);
        loadSubscriptionPlans();
      } else {
        setToast({
          open: true,
          title: 'Error',
          description: response.message || 'Failed to create subscription plan',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      setToast({
        open: true,
        title: 'Error',
        description: 'An error occurred while creating the subscription plan',
        variant: 'error'
      });
    }
  };
  
  // Handle edit plan form submission
  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelId || !editingPlanId || !editPlan) return;
    
    try {
      const response = await updateSubscriptionPlan(channelId, editingPlanId, editPlan);
      
      if (response.success) {
        setToast({
          open: true,
          title: 'Success',
          description: 'Subscription plan updated successfully',
          variant: 'success'
        });
        
        // Reset form and refresh plans
        setEditingPlanId(null);
        setEditPlan(null);
        loadSubscriptionPlans();
      } else {
        setToast({
          open: true,
          title: 'Error',
          description: response.message || 'Failed to update subscription plan',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      setToast({
        open: true,
        title: 'Error',
        description: 'An error occurred while updating the subscription plan',
        variant: 'error'
      });
    }
  };
  
  // Handle plan deletion
  const handleDeletePlan = async (planId: string) => {
    if (!channelId) return;
    
    if (!confirm('Are you sure you want to delete this subscription plan?')) {
      return;
    }
    
    try {
      const response = await deleteSubscriptionPlan(channelId, planId);
      
      if (response.success) {
        setToast({
          open: true,
          title: 'Success',
          description: 'Subscription plan deleted successfully',
          variant: 'success'
        });
        
        // Refresh plans
        loadSubscriptionPlans();
      } else {
        setToast({
          open: true,
          title: 'Error',
          description: response.message || 'Failed to delete subscription plan',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      setToast({
        open: true,
        title: 'Error',
        description: 'An error occurred while deleting the subscription plan',
        variant: 'error'
      });
    }
  };
  
  // Start editing a plan
  const startEditingPlan = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setEditPlan({...plan});
  };
  
  // Cancel editing a plan
  const cancelEditingPlan = () => {
    setEditingPlanId(null);
    setEditPlan(null);
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
      return dateString;
    }
  };
  
  // Check if a subscription is active
  const isSubscriptionActive = (enddate: string) => {
    try {
      const endDate = new Date(enddate);
      const now = new Date();
      return endDate > now;
    } catch (error) {
      return false;
    }
  };
  
  // Get plan name by ID
  const getPlanName = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : 'Unknown Plan';
  };
  
  // Show loading indicator
  if (loading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <ToastProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
            <button 
              className="ml-auto"
              onClick={() => setError(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <Tabs defaultValue="plans">
          <TabsList className="mb-6">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Subscription Plans</h2>
              <Button 
                onClick={() => setShowNewPlanForm(!showNewPlanForm)}
                className="flex items-center"
              >
                {showNewPlanForm ? <X className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {showNewPlanForm ? 'Cancel' : 'Add Plan'}
              </Button>
            </div>
            
            {/* New Plan Form */}
            {showNewPlanForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Create New Subscription Plan</h3>
                <form onSubmit={handleCreatePlan}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newPlan.duration}
                        onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})}
                        required
                      >
                        <option value="7 days">7 days</option>
                        <option value="14 days">14 days</option>
                        <option value="30 days">30 days</option>
                        <option value="90 days">90 days</option>
                        <option value="180 days">180 days</option>
                        <option value="365 days">1 year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (TON)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      className="mr-2 bg-gray-300 hover:bg-gray-400 text-black"
                      onClick={() => setShowNewPlanForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Plan</Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Plans List */}
            {plans.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No subscription plans created yet.</p>
                <Button 
                  onClick={() => setShowNewPlanForm(true)}
                  className="mt-4"
                >
                  Create Your First Plan
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {plans.map(plan => (
                  <div 
                    key={plan.id} 
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                  >
                    {editingPlanId === plan.id ? (
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-4">Edit Subscription Plan</h3>
                        <form onSubmit={handleUpdatePlan}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={editPlan?.name || ''}
                                onChange={(e) => setEditPlan({...editPlan!, name: e.target.value})}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={editPlan?.duration || ''}
                                onChange={(e) => setEditPlan({...editPlan!, duration: e.target.value})}
                                required
                              >
                                <option value="7 days">7 days</option>
                                <option value="14 days">14 days</option>
                                <option value="30 days">30 days</option>
                                <option value="90 days">90 days</option>
                                <option value="180 days">180 days</option>
                                <option value="365 days">1 year</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price (TON)</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={editPlan?.price || ''}
                                onChange={(e) => setEditPlan({...editPlan!, price: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows={3}
                              value={editPlan?.description || ''}
                              onChange={(e) => setEditPlan({...editPlan!, description: e.target.value})}
                              required
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              type="button" 
                              className="mr-2 bg-gray-300 hover:bg-gray-400 text-black"
                              onClick={cancelEditingPlan}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Update Plan</Button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium">{plan.name}</h3>
                            <div className="flex space-x-2">
                              <button 
                                className="p-1 rounded hover:bg-blue-600" 
                                onClick={() => startEditingPlan(plan)}
                                title="Edit Plan"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-1 rounded hover:bg-blue-600" 
                                onClick={() => handleDeletePlan(plan.id)}
                                title="Delete Plan"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-2xl font-bold mt-2">{plan.price} TON</div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center text-sm mb-2">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{plan.duration}</span>
                          </div>
                          <p className="text-gray-600 mt-2">{plan.description}</p>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{subscribers.filter(s => s.subscriptionPlanId === plan.id).length} subscribers</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="subscribers">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Subscribers</h2>
              <Button 
                onClick={loadSubscribers}
                className="flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
            
            {/* Subscribers List */}
            {subscribers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No subscribers yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Plan</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscribers.map(subscriber => (
                      <tr key={subscriber.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {subscriber.username}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {getPlanName(subscriber.subscriptionPlanId)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {formatDate(subscriber.startdate)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {formatDate(subscriber.enddate)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {isSubscriptionActive(subscriber.enddate) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <span className="h-2 w-2 mr-1 rounded-full bg-green-400"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <span className="h-2 w-2 mr-1 rounded-full bg-red-400"></span>
                              Expired
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Toast Notification */}
        {toast.open && (
          <Toast 
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => setToast({...toast, open: false})}
          />
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default SubscriptionManagement;