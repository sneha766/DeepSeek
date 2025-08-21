"use client"
import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { assets } from "@/assests/assets";
import Promptbox from "@/components/Promptbox";
import Message from "@/components/Message";

export default function Home() {

  const [expand,setexpand] = useState(false);
  const [messages,setmessages] = useState([]);
  const [isloading,setisloading] = useState(false);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar  expand={expand} setexpand={setexpand}/>
         <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative" >
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full ">
            <Image onClick={()=>(expand? setexpand(false):setexpand(true))} className="rotate-180" src={assets.menu_icon} alt="" />
            <Image className="opacity-70" src={assets.chat_icon} alt="" />
          </div>
          {messages.length ===0 ? 
          (
          <>
          <div className="flex items-center gap-3">
            <Image src={assets.logo_icon} alt="" className="h-16"></Image>
            <p className="font-medium  text-2xl">Hi, I am DeepSeek.</p>
          </div>
          <p className="text-sm mt-2">How can I help you today ?</p>
          </>):
          (<div>
            <Message role='user' content='What is Next js' />
          </div>)
          }
          <Promptbox isloading={isloading} setisloading={setisloading} />
          <p className="text-xs absolute bottom-1 text-gray-500">AI-generated ,for reference only. </p>
         </div>
      </div>
    </div>
  );
}
