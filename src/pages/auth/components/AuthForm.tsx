import logo from "@/assets/icons/logo.svg"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


const AuthForm = () => {

    const [selectedTab, setSelectedTab] = useState("login");

    return (
        <div className="w-4/5 flex flex-col items-center justify-start mt-4 px-4 h-auto overflow-auto">
                        <img src={logo} className="size-24" alt="logo" srcSet="" />

            <p className="font-bold text-2xl text-gray-200 mb-4">
                Lottery <span className="text-[#F3BE8E]">JuniperFox</span> Game
            </p>
            <Tabs defaultValue="login" value={selectedTab} onValueChange={setSelectedTab} className="w-full flex flex-col items-center justify-center">
                <TabsList className="flex bg-gray-700  flex-row w-[90%] h-auto items-center rounded-full justify-between border-2 border-gray-600 my-4">
                <TabsTrigger
                    className={`w-full p-1 text-sm font-medium rounded-full  ${
                        selectedTab === "login" 
                            ? " text-white" 
                            : "text-gray-300 "
                    }`} 
                    value="login"
                >
                    Sign In
                </TabsTrigger>
                <TabsTrigger
                    className={`w-full  p-1 text-sm font-medium rounded-full ${
                        selectedTab === "register" 
                            ? " text-white" 
                            : "text-gray-300"
                    }`} 
                    value="register"
                >
                    Sign Up
                </TabsTrigger>
                </TabsList>
                <TabsContent className="w-full" value="login">
                    <LoginForm />
                </TabsContent>
                <TabsContent className="w-full" value="register">
                    <RegisterForm />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AuthForm;