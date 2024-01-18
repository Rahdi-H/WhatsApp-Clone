import React from 'react'
import userr from '../assets/user.png';
import { useNavigate } from 'react-router-dom';

function UserProfile({user, setSearchInput}) {
  console.log(user);
  const navigate = useNavigate()
  function goToUser(id) {
    navigate(`/${id}`)
  }
  function click(id) {
    setSearchInput('');
    goToUser(id)
  }
  return (
    <div onClick={()=> click(user.user_id)} className='flex justify-start items-center border-2 p-2 space-x-2 rounded-md cursor-pointer hover:bg-slate-300 bg-slate-100'>
        <div className=''>
            <img src={userr} alt="user image" className='h-12 w-auto rounded-full bg-zinc-300'/>
        </div>
        <div className='text-lg font-semibold'>{user.name}</div>
    </div>
  )
}

export default UserProfile;