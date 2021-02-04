import React from 'react'
import {useParams} from 'react-router'
import {Loader} from 'rsuite'
import { auth } from '../../misc/firebase'
import ChatBottom from '../../components/ChatWindow/Bottom.js'
import Messages from '../../components/ChatWindow/Messages'
import ChatTop from '../../components/ChatWindow/Top'
import {useRooms} from '../../context/rooms.context'

import {CurrentRoomProvider} from '../../context/current-room.context'
import { transformToArr } from '../../misc/helper'

const Chat = () => {

    const {chatId} = useParams()
    const rooms = useRooms()
    if(!rooms){
        return <Loader center vertical size='md' content='loading' speed='slow' />
    }
    const currentRoom = rooms.find(room => room.id === chatId)
    if(!currentRoom){
        return <h6 className='text-center mt-page'>Chat {chatId} not found </h6>
    }
    const {name,descryption} = currentRoom 
    const admins = transformToArr(currentRoom.admins)
    const isAdmin = admins.includes(auth.currentUser.uid)

    const currentRoomData ={
        name, 
        descryption,
        admins,
        isAdmin
    }
    return (
        <CurrentRoomProvider data={currentRoomData}>
            <div className='chat-top'>
                <ChatTop/> 
            </div>
            <div className='chat-middle'>
                <Messages/>
            </div>
            <div className='chat-bottom'>
                <ChatBottom/>
            </div>
        </CurrentRoomProvider>
    )
}

export default Chat
