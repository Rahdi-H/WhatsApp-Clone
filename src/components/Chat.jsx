import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import ChatContainer from './ChatContainer';
import supabase from '../supabseConfig';
import { useNavigate, useParams } from 'react-router-dom';

function Chat({user}) {
  const  navigate = useNavigate()
  const [profile, setProfile] = useState({})
  const {id} = useParams()
  console.log(id);
  async function getProfile() {
    const {data, error} = await supabase.from("Profiles")
    .select("*")
    .eq('user_id', id);
    if (error == null && data) {
      setProfile(data[0])
      console.log(data);
    } else if (error) {
      navigate('/')
    }
  }
  useEffect(()=> {
    getProfile()
  },[])
  return (
    <div className='flex'>
        <div className='w-1/4 flex'>
            <Sidebar user={user}/>
        </div>
        <ChatContainer profile={profile} user={user}/>
    </div>
  )
}

export default Chat;