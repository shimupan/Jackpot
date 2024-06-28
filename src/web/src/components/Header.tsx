import React, { useState } from "react";
import useCookies from "../hooks/useCookies";

const Header = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [balance, updateBalance] = useCookies("userToken", 1000) as [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ];

  const toggleEdit = () => setIsEditable(!isEditable);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newBalance = Number(e.target.value);
    if (!isNaN(newBalance)) {
      newBalance = Math.round(newBalance * 100) / 100; // Correctly round the input value
      updateBalance(newBalance);
    }
  };

  return (
    <>
        <div className="absolute">
          <div className="w-screen absolute flex overflow-hidden">

            {/* TOP BAR */}
            <div className="w-full h-14 flex flex-col justify-between">
              <header className="h-16 w-full flex items-center relative justify-end px-5 space-x-10 bg-gray-800">
                <div className="flex flex-shrink-0 items-center space-x-4 text-white">
                  <div className="flex items-center space-x-2">
                    
                    {/* TOGGLE BALANCE */}
                    <p className="text-md font-medium">Balance:</p>
                    {isEditable ? (
                      <>
                        <span className="text-white">$</span>
                        <input
                          type="number"
                          value={balance}
                          onChange={handleBalanceChange}
                          onBlur={toggleEdit}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              toggleEdit();
                            }
                          }}
                          className="w-16 p-1 rounded bg-gray-800 text-white focus:outline-none focus:ring-0 appearance-none"
                        />
                      </>
                    ) : (
                      <div
                        onDoubleClick={toggleEdit}
                        className="cursor-pointer"
                      >
                        ${balance}
                      </div>
                    )}
                  </div>

                  <div className="h-10 w-10 rounded-full cursor-pointer bg-gray-200 border-2 border-blue-400"></div>
                </div>
              </header>
            </div>
          </div>
            
          {/* LEFT BAR */}
          <div className="h-screen">
            <aside className="h-full w-16 flex flex-col space-y-10 items-center justify-center relative bg-gray-800 text-white">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white"></div>
            </aside>
          </div>
        </div>
    </>
  );
};

export default Header;
