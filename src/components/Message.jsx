import React from 'react'

function Message({msg, user, profile}) {
  return (
    <>
    {msg.sender == user.id? 
    <div className='flex justify-end'>
        <div className=' bg-white flex flex-col w-fit p-3 rounded-s-3xl rounded-b-3xl m-3 items-end'>
            <div className='text-lg'>
                <p>{msg?.text}</p>
        {msg.image_url ? <div className='w-25 h-auto'><img src={msg.image_url} alt="" /></div> : ""}
            </div>
            <div className='flex justify-end text-sm text-gray-500'>
                <p>{msg.timestamp}</p>
            </div>
        </div>
    </div>
    : 
    <div className='flex justify-start'>
        <div className=' bg-lime-300 flex flex-col w-fit p-3 rounded-e-3xl rounded-b-3xl m-3 items-end'>
            <div className='text-lg'>
                <p>{msg?.text}</p>
            {msg.image_url ? <div className='w-25 h-auto'><img src={msg.image_url} alt="" /></div> : ""}
            </div>
            <div className='flex justify-end text-sm text-gray-500'>
                <p>{msg.timestamp}</p>
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default Message;