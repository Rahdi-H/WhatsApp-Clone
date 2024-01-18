import React, { useEffect, useState } from 'react'
import userIcon from '../assets/user.png';
import TollIcon from '@mui/icons-material/Toll';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import UserProfile from './UserProfile';
import FriendProfile from './friendProfile';
import supabase from '../supabseConfig';
import { useNavigate } from 'react-router-dom';

function Sidebar({user}) {
    const [allusers, setAllUsers] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [friends, setFriends] = useState([])
    const getUsers = async () => {
        let { data: Profiles, error } = await supabase
        .from('Profiles')
        .select('*');
        if (error == null) {
            setAllUsers(Profiles.filter((pro)=> pro.email !== user.email))
            console.log(Profiles.filter((pro)=> pro.email !== user.email));
        }
    }
    const getFriends = async () => {
        const {data, error} = await supabase
        .from('Friends')
        .select('*')
        .eq('user_id', user.id)
        console.log(data);
        setFriends(data)
    }
    const navigate = useNavigate()
    const signOut = async ()=> {
        const {error} = await supabase.auth.signOut()
        localStorage.removeItem('user')
        navigate('/')
        window.location.reload()
    }
    useEffect(()=> {
    //     const Friends = supabase.channel('custom-all-channel')
    //     .on(
    //   'postgres_changes',
    //   { event: '*', schema: 'public', table: 'Friends' },
    //   (payload) => {
    //     console.log('Change received!', payload)
    //     setFriends([...friends, payload.new])
    //   }
    // )
    // .subscribe()
        getUsers()
        getFriends()
    }, [])
    const searchedUser = allusers.filter((userr)=> {
        if (searchInput !== '') {
            if (userr.name.toLowerCase().includes(searchInput.toLowerCase())){
                return userr
            }
        }
    })
    const searchItem = searchedUser.map((userr)=> {
        return (
            <UserProfile user={userr} key={userr.id} setSearchInput={setSearchInput}/>
        )
    })
    const friendItem = friends.map((friend)=> {
        return (
            <FriendProfile user={friend} key={friend.id}/>
        )
    })
    
  return (
    <div className='sidebar flex flex-col h-screen w-full border-x-2'>
        <div className='sidebar-header h-50 bg-slate-300 flex p-3 justify-between items-center'>
            <div className='cursor-pointer'>
                <img src={userIcon} alt="user image" className=' h-10 w-auto bg-zinc-400 rounded-full'/>
            </div>
            <div className='flex space-x-2'>
                <TollIcon className=' cursor-pointer'/>
                <InsertCommentIcon  className=' cursor-pointer'/>
                <MoreVertIcon className=' cursor-pointer' onClick={signOut}/>
            </div>
        </div>
        <div className='search bg-slate-200 h-50 p-2'>
            <div className='search-input bg-slate-100 rounded-xl p-2 flex justify-evenly items-center'>
                <SearchIcon/>
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)} type="text" placeholder='Search' className=' bg-transparent p-1 w-full outline-none'/>               
            </div>
        </div>
        <div className=' bg-slate-200 flex-1 userChats scrollbar-thin scrollbar-thumb-slate-200 overflow-y-scroll'>
            {searchItem.length > 0 ? searchItem : friendItem  }
        </div>
    </div>
  )
}

export default Sidebar;