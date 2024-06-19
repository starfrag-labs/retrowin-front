import React from "react";
import { CustomMouseEventType } from "../../../types/event";

export const MouseDown = ({
  children,
  setEventType,
}: {
  children: React.ReactNode;
  setEventType: React.Dispatch<React.SetStateAction<CustomMouseEventType>>;
}): React.ReactElement => {
  return (
    <div>
      {children}
    </div>
  )
}