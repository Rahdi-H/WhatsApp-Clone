import React, { useEffect, useState } from 'react'
import supabase from '../supabseConfig';
import { useNavigate } from 'react-router-dom';

function LoginPage({setUser, user}) {
  const [userr, setUserr] = useState()
  const signIn = async ()=> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    console.log(data);
    console.log(error);
    if (data && error != null) {

    }
  }
  const navigate = useNavigate()
  useEffect(()=> {
    async function getUserData() {
      await supabase.auth.getUser().then((value)=> {
        console.log(value.data?.user);
        localStorage.setItem("user", JSON.stringify(value.data?.user))
        setUser(value.data?.user)
        setUserr(value.data?.user)
        return value.data?.user
      })
    }
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        getUserData()
        navigate('/chat')
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user')
        navigate('/')
      }
    })
  }, [user])
  return (
    <div className='flex h-screen  w-full justify-center items-center flex-col '>
      <div className='p-5 shadow-xl space-y-4 rounded-xl flex justify-center items-center flex-col'> 
        <div>
          <h2 className='font-bold text-5xl'>WhatsApp</h2>
        </div>
        <div onClick={signIn} className='hover:bg-green-600 bg-green-500  px-4 py-2 rounded-full text-white font-semibold cursor-pointer'>
          Login with Google
        </div>
      </div>
    </div>
  )
}

export default LoginPage;