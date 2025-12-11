import { useContext } from "react";
import { DarkModeContext } from "../functions/DarkMode.Context";

export const useMode = ()=>{
    const context =  useContext(DarkModeContext);
    if(!context){
        throw new Error("useMode must be used within an ModeProvider");
    }   
    return context;
}; 