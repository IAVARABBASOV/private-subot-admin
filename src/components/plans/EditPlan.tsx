import React, { useState } from 'react'
import AnimatedText from './AnimatedText';
import { Input } from '../ui/input';
import LimitedTextArea from './LimitedTextArea';
import { Button } from '../ui/button';
import ConfirmationDialog from './ConfirmationDialog';


interface EditPlanProperty {

    title: string;
    nameProperties: PlanInputProperty;
    durationProperties: PlanInputProperty;
    priceProperties: PlanInputProperty;
    descriptionProperties: PlanInputProperty;

    onSaveButtonClicked: () => void;
    onCancelButtonClicked: () => void;

    confirmDialogueText: string;
}

interface PlanInputProperty {
    PlaceHolder: string;
    Value: string;
    onChanged: (_value: string) => void;
}

const MAX_DESCRIPTION_CHARACTERS_COUNT=150;

function EditPlan({ 
    title,
    nameProperties, 
    durationProperties, 
    priceProperties, 
    descriptionProperties, 
    onSaveButtonClicked, 
    onCancelButtonClicked,
    confirmDialogueText
} : EditPlanProperty) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleYes = () => {
      console.log("Yes clicked!");
      onSaveButtonClicked();
      setIsDialogOpen(false); // Close dialog
    };
  
    const handleNo = () => {
      console.log("No clicked!");
      setIsDialogOpen(false); // Close dialog
    };

  return (
    <div>
        <ConfirmationDialog
            isOpen={isDialogOpen}
            question={confirmDialogueText}
            onYes={handleYes}
            onNo={handleNo}
        />
        <div className="space-y-4">
            <AnimatedText text={title}/>

            <div className="space-y-2">
            <h3 className="text-sm font-medium">Plan Name:</h3>
            <Input
                placeholder={nameProperties.PlaceHolder}
                value={nameProperties.Value}
                onChange={(e) => nameProperties.onChanged(e.target.value) }
                maxLength={32}
            />
            </div>

            <div className="space-y-2">
            <h3 className="text-sm font-medium">Duration:</h3>
            <Input
                type="number"
                placeholder={durationProperties.PlaceHolder}
                value={durationProperties.Value}
                onChange={(e) => durationProperties.onChanged(e.target.value)}
            />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Price:</h3>
                <Input
                type="number"
                placeholder={priceProperties.PlaceHolder}
                value={priceProperties.Value}
                onChange={(e) => priceProperties.onChanged(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Description:</h3>
                <LimitedTextArea 
                        _placeholder={`Description (max ${MAX_DESCRIPTION_CHARACTERS_COUNT} characters)`}
                        _value={descriptionProperties.Value}
                        _maxCharactersLength={MAX_DESCRIPTION_CHARACTERS_COUNT}
                        _onTextChanged={(e) => descriptionProperties.onChanged(e) }
                        _isTextLengthVisible={true}/>
                </div>
                <div className="flex gap-2">
                <Button onClick={() => setIsDialogOpen(true)}>Save</Button>
                <Button variant="outline" onClick={onCancelButtonClicked}> Cancel</Button>
            </div>
        </div>
    </div>
  )
}

export default EditPlan