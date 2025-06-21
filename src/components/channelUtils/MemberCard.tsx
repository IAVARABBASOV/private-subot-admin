import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Clock, Ban, Shield, UserCheck, Loader2, User, UserX, StopCircle, ClockAlertIcon, ClockArrowUp, AlarmClock } from "lucide-react";

interface MemberCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  member: any;
  role: string;
  processingMember: number | null;
  onAction: (memberId: number, action: string) => Promise<void>;
}

const MemberCard = ({ member, role, processingMember, onAction }: MemberCardProps) => {
  
  function getDate(timeString: string): string {
      const timeNumeric = Number.parseInt(timeString);
      const date = new Date(timeNumeric);

      

      const min = date.getMinutes().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = String(date.getFullYear()).slice(-2);

      return `${day}/${month}/${year} - ${hour}:${min}`;
  }

  return (
    <Card className="p-3">
      <div className="flex justify-between items-start">
        <div>
          <User className=" w-4 h-4 text-[#0088cc]"/>
          <h3 className="font-semibold">@{member.username}</h3>
          <p className="text-sm text-gray-500">
            <Clock className="inline-block w-4 h-4 mr-1" />
            { `Start Date: ${getDate(member.startdate)}` }
          </p>
          <p className="text-sm text-gray-500">
           <AlarmClock className="inline-block w-4 h-4 mr-1" />
            {`End Date: ${getDate(member.enddate)}`}
          </p>
        </div>
        <div className="flex gap-2">
          {role === "subscriber" && (
            <>
              <Button
                variant="promote"
                size="sm"
                onClick={() => onAction(member.id, "promote")}
                disabled={processingMember === member.id}
              >
                {processingMember === member.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                Promote
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onAction(member.id, "ban")}
                disabled={processingMember === member.id}
              >
                {processingMember === member.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Ban className="w-4 h-4" />
                )}
                Ban
              </Button>
            </>
          )}
          {role === "banned" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onAction(member.id, "unban")}
              disabled={processingMember === member.id}
            >
              {processingMember === member.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              Unban
            </Button>
          )}
          {
            role === 'admin' && 
            (<>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onAction(member.id, "remove")}
                  disabled={processingMember === member.id}
                >
                  {processingMember === member.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserX className="w-4 h-4" />
                  )}
                  Remove
              </Button>
            </>)
          }
        </div>
      </div>
    </Card>
  );
};

export default MemberCard;