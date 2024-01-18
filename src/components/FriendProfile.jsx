import React from 'react'
import userr from '../assets/user.png';
import { useNavigate } from 'react-router-dom';

function FriendProfile({user}) {
  console.log(user);
  const navigate = useNavigate()
  function goToUser(id) {
    navigate(`/${id}`)
  }
  return (
    <div onClick={()=> goToUser(user.friend_id)} className='flex justify-start items-center border-2 p-2 space-x-2 rounded-md cursor-pointer hover:bg-slate-300 bg-slate-100'>
        <div className=''>
            <img src={userr} alt="user image" className='h-12 w-auto rounded-full bg-zinc-300'/>
        </div>
        <div>
            <div className='text-lg font-semibold'>{user.name}</div>
            <p>{user.last_message}</p>
        </div>
    </div>
  )
}

export default FriendProfile;