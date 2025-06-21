import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { ClipboardCheck, ClipboardX, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { IChannel, SubscriptionPlan } from "../../types";
import React from "react";
import { useToast } from "../ui/use-toast";
import ScrollUp from "../channelUtils/ScrollUp";
import TonLogo from "../../images/TonLogo";
import useFetchChannelDataFromServer from "../../hooks/useFetchChannelDataFromServer";
import { useLocation } from "react-router-dom";
import usePostChannelData from "../../hooks/postChanneData";
import EditPlan from "./EditPlan";
import ConfirmationDialog from "./ConfirmationDialog";
import WebApp from "@twa-dev/sdk";

interface PlansProperties {
  onScrolled?: (isScrolled: boolean) => void;
}

const MIN_TON_AMOUNT = 0.01;

const emptyPlan: SubscriptionPlan = {
  id: "",
  name: "",
  duration: '',
  price: '',
  description: ""
}

const Plans = ({ onScrolled }: PlansProperties) => {

  const location = useLocation();
  const channelId = location.state?.channelId;

  const { toast } = useToast();

  const [channel, setChannel] = useState<IChannel | undefined>(undefined);

  const { isPending, error, data } = useFetchChannelDataFromServer(channelId);

  useEffect(() => 
  {
    if(channel !== data){
      setChannel(data);

      if(data !== undefined)
      {
        if(plans !== data.subscriptionPlans){
          setPlans(data.subscriptionPlans);
        }
      }
    }
    
  },[isPending, error, data, channelId]);

  const [plans, setPlans] = useState<SubscriptionPlan[] | undefined>();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState<SubscriptionPlan>(emptyPlan);
  const [isDeletePlanDialogueOpen, setDeletePlanDialogOpen] = useState(false);
  const [deletedPlan, setDeletedPlan] = useState<SubscriptionPlan | undefined>();

  const postChannelDataMutation = usePostChannelData();


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    
    if(onScrolled) onScrolled(false);
    
  }, []);
  
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan.id);
    setNewPlan(plan);
  };

  const handleUpdatePlan = async () => {
    if (!newPlan.name || !newPlan.duration || !newPlan.price) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (Number.parseInt(newPlan.duration) <= 0) {
      toast({
        title: "Error",
        description: "Your entered Day Count must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (Number.parseFloat(newPlan.price) < MIN_TON_AMOUNT) {
        toast({
          title: "Error",
          description: `Your entered Price Count must be greater than ${MIN_TON_AMOUNT} TON`,
          variant: "destructive",
        });
        return;
    }

    let _plans = plans!!.map((p) => (p.id === editingPlan ? newPlan : p));

    setPlans(_plans);

    await mutatePlans(_plans);

    setEditingPlan(null);

    toast({
      title: "Success",
      description: "Plan updated successfully",
    });
  };

  const handleDeletePlan = async (planId: string) => {

    let _plans = plans!!;

    _plans = _plans.filter(x=> x.id !== planId);
    setPlans(_plans);

    await mutatePlans(_plans);

    toast({
      title: "Success",
      description: "Plan deleted successfully",
    });
  };

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.duration || !newPlan.price) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (Number.parseInt(newPlan.duration) <= 0) {
        toast({
          title: "Error",
          description: "Your entered Day Count must be greater than 0",
          variant: "destructive",
        });
        return;
    }

    if (Number.parseFloat(newPlan.price) < 0.5) {
        toast({
          title: "Error",
          description: "Your entered Price Count must be greater than 0.5 TON",
          variant: "destructive",
        });
        return;
    }

    const planId = `plan-${Date.now()}`;
    const _plans = plans!!;

    newPlan.id = planId;
    _plans.push(newPlan);

    setPlans(_plans);
    await mutatePlans(_plans);
    console.log("CREATE NEW PLAN", channel);

    setIsCreating(false);
    setNewPlan(emptyPlan);
    
    toast({
      title: "Success",
      description: "Plan created successfully",
    });
  };

  async function mutatePlans(_plans: SubscriptionPlan[]) {
    if(channel !== undefined){

      channel.subscriptionPlans = _plans;

      const response = await postChannelDataMutation.mutateAsync(channel);

      console.log("POST NEW PLAN:", response);
    }
  }

  const handleDeletePlanYes = async () => {
    console.log("Yes Delete Plan clicked!");

    if(deletedPlan){
      await handleDeletePlan(deletedPlan.id);

      setDeletedPlan(undefined);
    }

    setDeletePlanDialogOpen(false);
  };

  function deletePlanButtonClicked(plan){

    if(plans && plans?.length > 1){ 
      setDeletedPlan(plan); 
      setDeletePlanDialogOpen(true);
    }else{
      console.log("At least 1 Plan required");
      WebApp.showAlert('At least 1 Plan required');
    }
  }

  return (
    <>
    
    <ConfirmationDialog
        isOpen={isDeletePlanDialogueOpen}
        question={`Do you want to Remove ${deletedPlan?.name} ?`}
        onYes={handleDeletePlanYes}
        onNo={() => setDeletePlanDialogOpen(false)}
    />
      {postChannelDataMutation.isPending && <div>POST CHANNEL DATA</div>}
      <div className="p-4 pb-20 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Subscription Plans</h1>
          {!isCreating && (
            <Button onClick={() => { setEditingPlan(null); setNewPlan(emptyPlan); setIsCreating(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Plan
            </Button>
          )}
        </div>

        {isCreating && (
          <Card className="p-4 mb-4">
            <EditPlan title="+NEW PLAN" confirmDialogueText='Do you want to create New Plan ?'
                nameProperties={{
                  PlaceHolder: 'Add Plan Name',
                  Value: newPlan.name,
                  onChanged(_value) { setNewPlan((prev) => ({ ...prev, name: _value }))}
                }} 

                durationProperties={{
                  PlaceHolder: 'Add (days)',
                  Value: newPlan.duration.toString(),
                  onChanged(_value) {setNewPlan((prev) => ({ ...prev, duration: _value }))}
                }}

                priceProperties={{
                  PlaceHolder: 'Add (TON)',
                  Value: newPlan.price.toString(),
                  onChanged(_value) { setNewPlan((prev) => ({ ...prev, price: _value })) }
                }}

                descriptionProperties={{
                  PlaceHolder: '',
                  Value: newPlan.description,
                  onChanged(_value) { setNewPlan((prev) => ({ ...prev, description: _value }))}
                }}

                onSaveButtonClicked={handleCreatePlan}
                onCancelButtonClicked={() => {
                  setNewPlan(emptyPlan);
                  setIsCreating(false);
                }}
              />
          </Card>
        )}

        <div className="space-y-4">
          {plans && plans.map((plan) => (
            <Card key={plan.id} className="p-4">
              {editingPlan === plan.id ? (
                <EditPlan title="EDIT PLAN" confirmDialogueText='Do you want to Update this Plan ?'
                    nameProperties={{
                      PlaceHolder: 'Edit Plan Name',
                      Value: newPlan.name,
                      onChanged(_value) { setNewPlan((prev) => ({ ...prev, name: _value }))}
                    }} 

                    durationProperties={{
                      PlaceHolder: 'Edit (days)',
                      Value: newPlan.duration.toString(),
                      onChanged(_value) {setNewPlan((prev) => ({ ...prev, duration: _value }))}
                    }}

                    priceProperties={{
                      PlaceHolder: 'Edit (TON)',
                      Value: newPlan.price.toString(),
                      onChanged(_value) { setNewPlan((prev) => ({ ...prev, price: _value })) }
                    }}

                    descriptionProperties={{
                      PlaceHolder: '',
                      Value: newPlan.description,
                      onChanged(_value) { setNewPlan((prev) => ({ ...prev, description: _value }))}
                    }}

                    onSaveButtonClicked={handleUpdatePlan}
                    onCancelButtonClicked={() => {
                      setEditingPlan(null);
                      setNewPlan(emptyPlan);
                    }}
                  />
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">{plan.name}</h2>
                      <p className="text-2xl font-bold text-telegram-blue mt-2 flex flex-row gap-1">
                      <TonLogo className={'w-5 translate-x-0'}/>  {plan.price} 
                      </p>
                      <p className="text-sm text-gray-500">{plan.duration} days</p>
                      <ul className="mt-4 space-y-2">
                        {
                          <div className="flex items-center text-sm">
                            {
                              plan.description.length > 0 && 
                              (<ClipboardCheck className="w-12 text-green-500 mr-2" />) || 
                              (<ClipboardX className="w-6 h-6 text-red-500 mr-2" />)
                            }
                            
                            {plan.description}
                        </div>
                        }
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => { handleEditPlan(plan); setIsCreating(false); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => deletePlanButtonClicked(plan)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>

        <ScrollUp threshold={100} onVisible={onScrolled} />
      </div>
    </>
  );
};

export default Plans;