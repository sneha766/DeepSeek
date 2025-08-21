"use client"
import React from 'react'
import { assets } from '@/assests/assets'
import { useState } from 'react';
import Image from 'next/image';
import { useContext } from 'react';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Promptbox = ({isloading,setisloading}) => {

    const [prompt,setprompt] = useState('');
    const {user,chats,setChats,selectedChat,setselectedChat} = useAppContext();

    const sendprompt = async (e)=>{
        const promptCopy = prompt;

        try{
            e.preventDefault();
            if(!user) return toast.error('Login to send message');
            if(isloading) return toast.error('Wait for the response');

            setisloading(true);
            setprompt("");

            const userprompt = {
                role : "user",
                content : prompt,
                timestamp : Date.now(),
            }
            setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id ? {
                ...chat,
                messages:[
                    ...chat.messages,userprompt
                ]
            }:chat))

            setselectedChat((prev)=>({
                ...prev,
                messages:[...prev.messages,userprompt]
            }))

            const {data} = await axios.post('/api/chat/ai',{
                chatId : selectedChat._id,
                prompt
            })

            if(data.success){
                setChats((prevChats)=>prevChats.map((chat)=> chat._id === selectedChat._id ? {
                    ...chat,messages:[...chat.messages,data.data]
                }:chat))

                if (!data.success || !data.data || !data.data.content) {
                    toast.error("AI response missing content");
                    return;
                }
                
                const message = data.data.content;
                const messageTokens = message.split(" ");
                let assistantMessage = {
                    role : 'assistant',
                    content : "",
                    timestamp : Date.now(),
                }

                setselectedChat((prev)=>({
                    ...prev,
                    messages  : [...prev.messages,assistantMessage],
                }))

                for(let i=0;i<messageTokens.length;i++){
                    setTimeout(()=>{
                        assistantMessage.content = messageTokens.slice(0,i+1).join(" ");
                        setselectedChat((prev)=>{
                            const updatedMessages = [
                                ...prev.messages.slice(0,-1),
                                assistantMessage
                            ]
                            return {...prev,messages :updatedMessages};
                        })
                    },i*100)
                }
            }
            else{
                toast.error(data.message);
                setprompt(promptCopy);
            }
        }
        catch(error){
            toast.error(error.message);
            setprompt(promptCopy);
        } finally{
            setisloading(false);
        }
    }

    const handleKeyDown = (e)=>{
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            sendprompt(e);
        }
    }

  return (
    <form onSubmit={sendprompt} className={`w-full ${selectedChat?.messages.length>0 ? "max-w-3xl" : "max-w-2xl"}  bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
        <textarea 

        onKeyDown={handleKeyDown}
        className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
        rows={2}
        placeholder='Message Deepseek'
        required
        value={prompt}
        onChange={(e)=>setprompt(e.target.value)}
        ></textarea>

        <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2'>
                <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                    <Image src={assets.deepthink_icon} alt='' className='h-5' />
                    DeepThink (R1)
                </p>
                <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                    <Image src={assets.search_icon} alt='' className='h-5' />
                    Search
                </p>
            </div>

            <div className='flex items-center gap-2'>
                <Image src={assets.pin_icon} alt='' className='w-4 cursor-pointer' />
                <button className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                    <Image src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt='' className='w-3.5 aspect-square' />
                </button>
            </div>
        </div>
    </form>
  )
}

export default Promptbox
