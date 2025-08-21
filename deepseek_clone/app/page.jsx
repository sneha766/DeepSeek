"use client"
import { useState,useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { assets } from "@/assests/assets";
import Promptbox from "@/components/Promptbox";
import Message from "@/components/Message";
import { useAppContext } from "@/context/AppContext";
import { useRef } from "react";

export default function Home() {

  const [expand,setexpand] = useState(false);
  const [messages,setmessages] = useState([]);
  const [isloading,setisloading] = useState(false);
  const {selectedChat} = useAppContext();
  const containerRef = useRef(null)

  useEffect(()=>{
    if(selectedChat){
      setmessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behaviour : "smooth",
      })
    }
  },[messages])
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
          (<div ref={containerRef} className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto">
            <p className="fixed top-8 border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">{selectedChat.name}</p>
            {messages.map((msg,index)=>(
              <Message key={index} role={msg.role} content={msg.content}/>
            ))}
            {
              isloading && (
                <div className="flex gap-4 max-w-3xl w-full py-3">
                  <Image className="h-9 w-9 p-1 border border-white/15 rounded-full" src={assets.logo_icon} alt="logo" />
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                  </div>

                </div>
              )
            }
          </div>)
          }
          <Promptbox isloading={isloading} setisloading={setisloading} />
          <p className="text-xs absolute bottom-1 text-gray-500">AI-generated ,for reference only. </p>
         </div>
      </div>
    </div>
  );
}
