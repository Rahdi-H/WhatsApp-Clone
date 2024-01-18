import React, { useEffect, useRef, useState } from 'react'
import userr from '../assets/user.png';
import MoreVert from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import Message from './Message';
import Picker from 'emoji-picker-react';
import supabase from '../supabseConfig';

function ChatContainer({profile, user}) {
  const [message, setMessage] = React.useState("")
  const [file, setFile] = React.useState(null)
  const [image, setImage] = React.useState(null)
  const [messages, setMessages] = React.useState([])
  const [emojiBox, setEmojiBox] = React.useState(false)
  const [publicurl, setPublicUrl] = useState(null)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file)
    const reader = new FileReader();

    reader.onloadend = () => {
      // Set the image in state as a data URL
      setFile(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const getMsg = async () => {
    try{
      const {data: getData, error: getError} = await supabase
      .from("Chats")
      .select('*')
      .eq('sender', user.id)
      .eq('receiver', profile.user_id);
      console.log(getData[0]);
      console.log(getError);
      if (getData[0]){
        setMessages(getData[0]?.message)
      }
    } catch(error) {
      console.log("Error occured retrieving he message");
    }
  }
  const send = async (e) => {
    e.preventDefault()
    if (message == "" && file == null) {
      return;
    }
    function getFormattedDateTime() {
      const now = new Date();
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      return `${now.toLocaleTimeString([], options)}`;
    }
    
    const formattedDateTime = getFormattedDateTime();
    const payload = {
      id : 1,
      text: message,
      sender: user.id,
      receiver: profile.user_id,
      timestamp: formattedDateTime
    }
    if (image != null){
      try{
        const { data: udata, error: uerror } = await supabase
        .storage
        .from('Images')
        .upload(`${user.id}/${image.name}`, image);
        console.log("image --- ", udata);
        console.log("image error --- ", uerror);
        if (udata && uerror == null) {
          const {data: gdata, error: gerror} = await supabase
          .storage
          .from('Images')
          .getPublicUrl(udata.path);
          console.log("Ret", gdata);
          console.log("ret", gerror);
          if (gdata) {
            setPublicUrl(gdata.publicUrl)
            payload.image_url = gdata.publicUrl
          }
        }
      } catch (err) {
        console.log(err.message);
      }
      setFile(null)
    }
    // sender 
    const {data: getData, error} = await supabase
    .from("Chats")
    .select('*')
    .eq('sender', user.id)
    .eq('receiver', profile.user_id);
    console.log(getData[0]);
    console.log(error);
    if (error == null && getData[0] == undefined){
      try{
        console.log('inside try');
        const {data: sData, error: sError} = await supabase
        .from('Chats')
        .insert([
          {sender: user.id, receiver: profile.user_id, message: [payload]},
          {sender: profile.user_id, receiver: user.id, message: [payload]},
        ])
        .select();
        try {
          const {data: getFriendData2, error: getFriendError2} = await supabase
          .from('Friends')
          .select('*')
          .eq('user_id', user.id);
          console.log(getFriendData2[0]);
          if (getFriendData2[0] != undefined && getFriendError2 == null){
            const {data: friendData1, error: friendError1} = await supabase
            .from('Friends')
            .update({"last_message": message, 'last_message_time': formattedDateTime})
            .eq('id', getFriendData2[0].id)
            .select();
            console.log(friendError1);
          } else {
            const {data: friendData1, error: friendError1} = await supabase
            .from('Friends')
            .insert({'user_id': user.id, 'friend_id': profile.user_id, "last_message": message, 'last_message_time': formattedDateTime, 'name': profile.name})
            .select();
            console.log(friendData1);
          }
        } catch (error) {
          console.log(error.message);
        }
        try{
          const {data:getFriendData1, error:getFriendError1} = await supabase
          .from('Friends')
          .select('*')
          .eq('user_id', profile.user_id);
          console.log(getFriendData1[0]);
          console.log(getFriendData1, getFriendError1);
          if (getFriendData1[0] != undefined && getFriendError1 == null){
            const {data: friendData2, error: friendError2} = await supabase
            .from('Friends')
            .update({"last_message": message, 'last_message_time': formattedDateTime})
            .eq('id', getFriendData1[0].id)
            .select();
            console.log(friendData2);
          } else {
            const {data: friendData2, error: friendError2} = await supabase
            .from('Friends')
            .insert({"user_id": profile.user_id, "friend_id": user.id,"last_message": message, 'last_message_time': formattedDateTime, "name": user.user_metadata.name})
            .select();
            console.log(friendError2.message);
  
          }
        } catch(error) {
          console.log('error in friend list');
        }
        console.log(sData, sError);
      } catch (error) {
        console.log('inside catch');
        console.log(error.message);
      }
    } else if (getData[0] != undefined && error == null) {   
      console.log([...getData[0].message, payload]);   
      try{
        const { data: suData, error: suError } = await supabase
      .from('Chats')
      .update({ message: [...getData[0].message, payload]},)
      .eq('sender', user.id)
      .eq('receiver', profile.user_id)
      .select();
      } catch (error) {
        console.log(error.message);
      }
      try{
        const { data: ruData, error: ruError } = await supabase
      .from('Chats')
      .update({ message: [...getData[0].message, payload]},)
      .eq('sender', profile.user_id)
      .eq('receiver', user.id)
      .select();
      } catch (error) {
        console.log(error.message);
      }
      try {
        const {data: getFriendData2, error: getFriendError2} = await supabase
        .from('Friends')
        .select('*')
        .eq('user_id', user.id);
        console.log(getFriendData2[0]);
        if (getFriendData2[0] != undefined && getFriendError2 == null){
          const {data: friendData1, error: friendError1} = await supabase
          .from('Friends')
          .update({"last_message": message, 'last_message_time': formattedDateTime})
          .eq('id', getFriendData2[0].id)
          .select();
          console.log(friendError1);
        } else {
          const {data: friendData1, error: friendError1} = await supabase
          .from('Friends')
          .insert({'user_id': user.id, 'friend_id': profile.user_id, "last_message": message, 'last_message_time': formattedDateTime, 'name': profile.name})
          .select();
          console.log(friendData1);
        }
      } catch (error) {
        console.log(error.message);
      }
      try{
        const {data:getFriendData1, error:getFriendError1} = await supabase
        .from('Friends')
        .select('*')
        .eq('user_id', profile.user_id);
        console.log(getFriendData1[0]);
        console.log(getFriendData1, getFriendError1);
        if (getFriendData1[0] != undefined && getFriendError1 == null){
          const {data: friendData2, error: friendError2} = await supabase
          .from('Friends')
          .update({"last_message": message, 'last_message_time': formattedDateTime})
          .eq('id', getFriendData1[0].id)
          .select();
          console.log(friendData2);
        } else {
          const {data: friendData2, error: friendError2} = await supabase
          .from('Friends')
          .insert({"user_id": profile.user_id, "friend_id": user.id,"last_message": message, 'last_message_time': formattedDateTime, "name": user.user_metadata.name})
          .select();
          console.log(friendError2.message);

        }
      } catch(error) {
        console.log('error in friend list');
      }
      console.log('after uupdate');
    }
    setMessage('')
    getMsg()
  }
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(()=> {
    const Chats = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Chats' },
      (payload) => {
        console.log('Change received!', payload)
        setMessages(payload.new.message)
      }
    )
    .subscribe()
    getMsg()
  },[user, profile])
  useEffect(()=> {
    scrollToBottom()
  },[messages])
  console.log("messages", messages);
  return (
    <div className='flex h-screen flex-col w-3/4'>
        <div className='header flex bg-slate-300 h-50 p-3 justify-between items-center'>
            <div className='flex items-center space-x-2 cursor-pointer'>
                <img src={userr} alt="user image" className=' h-10 w-auto bg-zinc-400 rounded-full'/>
                <h3 className=' font-semibold'>{profile.name}</h3>
            </div>
            <div>
                <MoreVert className=' cursor-pointer'/>
            </div>
        </div>
        <div className='h-full bg-gray-200 overflow-y-scroll scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-slate-400'>
          {messages.length > 0 ? 
          messages.map((msg)=>(
          <Message   msg={msg} user={user} profile={profile}/>
          ))
          : ""
          }
          <div ref={messagesEndRef}/>
        </div>
        {file && 
        <div className='flex justify-between items-start bg-zinc-100'>{console.log(file)}
          <img className=' m-2 rounded-md shadow-md w-auto h-20' src={file}  alt="image"/>
          <button onClick={()=> setFile(null)} className='p-3 hover:bg-slate-400'>X</button>
        </div> }
        <div className='input flex justify-between p-3 bg-zinc-300 space-x-2'>
          {emojiBox && <Picker className='!absolute bottom-16' onEmojiClick={(event, emojiObject)=> setMessage(message+event.emoji)}/>}
          <div className='flex justify-center items-center space-x-2 text-gray-600'>
            <InsertEmoticonIcon onClick={()=> setEmojiBox(!emojiBox)} className=' cursor-pointer' />
            <label htmlFor="file">
              <AttachFileIcon className=' cursor-pointer'/>
            </label>
            <input onChange={handleImageChange} type="file" name="file" id="file" hidden />
          </div>
          <form className='flex-1' onSubmit={send}>
            <input value={message} onChange={(e)=> setMessage(e.target.value)} type="text" placeholder='Type a message' className='outline-none p-2 rounded-full w-full' onClick={()=> {setEmojiBox(false)}}/>
          </form>
          <div onClick={send} className='flex justify-center items-center bg-green-500 rounded-full p-2 text-white'>
            <SendIcon className=' cursor-pointer'/>
          </div>
        </div>
    </div>
  )
}

export default ChatContainer;