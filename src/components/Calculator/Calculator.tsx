'use client';

import React, { useState } from "react";
import Draggable from "react-draggable";
import { useHotkeys } from "react-hotkeys-hook";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");

  const handleButtonClick = (value: any) => {
    if (value === "C") {
      setDisplay("0");
    } else if (value === "=") {
      try {
        setDisplay(eval(display).toString());
      } catch {
        setDisplay("Erro");
      }
    } else {
      setDisplay((prev) => (prev === "0" ? value : prev + value));
    }
  };

  const buttons = [
    "C", "/", "*",
    "7", "8", "9", "-",
    "4", "5", "6", "+",
    "1", "2", "3", "=",
    "0", "."
  ];

  // Hotkeys setup
  return (
    <Draggable>
      <div className="absolute w-64 bg-base-200 p-4 border border-1 rounded-md shadow-md z-50">
        <div className="mb-4 p-2 bg-base-100 border border-1 rounded-md text-right text-xl h-14">
          {display}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, index) => {
            if (btn === "=") {
              return (
                <button
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  className="row-span-2 p-4 text-lg border rounded-md cursor-pointer bg-primary text-white"
                >
                  {btn}
                </button>
              );
            }

            if (btn === "C") {
              return (
                <button
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  className="col-span-2 p-4 text-lg border rounded-md cursor-pointer bg-red-500 text-white hover:bg-red-300"
                >
                  {btn}
                </button>
              );
            }

            if (btn === "0") {
              return (
                <button
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  className="col-span-2 p-4 text-lg border rounded-md cursor-pointer bg-gray-300 text-black hover:bg-gray-400"
                >
                  {btn}
                </button>
              );
            }

            return (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-4 text-lg border rounded-md cursor-pointer ${
                  btn === "/" || btn === "*" || btn === "-" || btn === "+"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>
    </Draggable>
  );
};
