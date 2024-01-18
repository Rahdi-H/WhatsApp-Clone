import React, { useEffect } from 'react'
import Sidebar from './Sidebar';
import whatsapplogo from '../assets/whatsAppbg.png';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabseConfig';

function Home({user}) {
  async function createOrGetProfile() {
    try{
      console.log(user);
      let { data: Profiles, error } = await supabase
      .from('Profiles')
      .select('*')
      .eq('user_id', user.id);
      console.log(Profiles);
      console.log(error);
      if (Profiles[0] == undefined && error == null) {
        const { data: profileData, error: profileError } = await supabase
        .from('Profiles')
        .insert([
          { user_id: user.id, name: user.user_metadata.full_name, email: user.email, photo_url:  user.user_metadata.iss},
        ])
        .select();
        console.log(profileData);
        console.log(profileError);
        if (profileError) {
          console.log(error.message);
        } else {
          console.log(profileData);
        }
      } 
    } catch (error){
      console.log('catch section');
        
    }
  }
  useEffect(()=> {
    createOrGetProfile()
  }, [])
  return (
    <div className='home flex  '>
        <div className='home-container w-1/3'>
            <Sidebar user={user}/>
        </div>
        <div className='w-full h-screen'>
            <img src={whatsapplogo} alt="WhatsApp Logo" className=' h-full w-full object-cover'/>
        </div>
    </div>
  )
}

export default Home;