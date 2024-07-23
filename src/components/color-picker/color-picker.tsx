import { useState } from "react";
import "./color-picker.css";

type ColorPickerProps = {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

export default function ColorPicker({ color, setColor }: ColorPickerProps) {
  const colors = ["blue", "green", "red", "yellow", "purple"];

  return (
    <div className="color-picker">
      {colors.map((c, index) => {
        return (
          <div
            className={`color-circle ${c} ${
              color === c ? "selected" : "unselected"
            }`}
            onClick={() => setColor(c)}
            key={c + index}
          ></div>
        );
      })}
    </div>
  );
}
