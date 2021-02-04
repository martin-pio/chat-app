import React, { useCallback, useEffect, useState } from 'react'
import {useParams } from 'react-router'
import { Alert } from 'rsuite'
import { auth, database } from '../../../misc/firebase'
import { transformToArrayWithId } from '../../../misc/helper'
import MessageItem from './MessageItem'
// eslint-disable-next-line arrow-body-style
const Messages = () => {
    const { chatId } =useParams()
    const [messages,setMessages] = useState(null)

    const isChatEmpty = messages && messages.length === 0
    const canShowMessages = messages && messages.length > 0
    
    useEffect(()=>{
        const messageRef = database.ref('/messages')

        messageRef.orderByChild('roomId').equalTo(chatId).on('value',(snap) => {
            const data = transformToArrayWithId(snap.val())
            setMessages(data)
        })

        return () =>{
            messageRef.off('value')
        }
    },[chatId])

    const handleAdmin = useCallback(async (uid) =>{
        const adminsRef = database.ref(`/rooms/${chatId}/admins`)
        let alertMsg

        await adminsRef.transaction(admins => {
            if(admins){
                if(admins[uid]){
                    admins[uid] = null
                    alertMsg = 'Admin permission removed'
                }
                else{
                    admins[uid] = true
                    alertMsg = 'Admin permission granted'
                }
            }
            return admins
        })
        Alert.info(alertMsg,4000)

    },[chatId])

    const handleLike = useCallback(async (msgId) => {
        const {uid} = auth.currentUser
        const messageRef = database.ref(`/messages/${msgId}`)
        let alertMsg

        await messageRef.transaction(msg => {
            if(msg){
                if(msg.likes && msg.likes[uid]){
                    msg.likeCount -= 1
                    msg.likes[uid] = null
                    alertMsg = 'Like removed'   
                    Alert.error(alertMsg,1000)
                }
                else{
                    msg.likeCount += 1
                    if(!msg.likes){
                        msg.likes = {}
                    }
                    msg.likes[uid] = true
                    alertMsg = 'Like added'           
                    Alert.success(alertMsg,1000)
                }
            }
            return msg
        })
    },[])

    return (
        <ul className='msg-list custom-scroll'>
            {isChatEmpty && <li>No Messages yet</li>}
            {canShowMessages && messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} handleLike={handleLike}/>)}
        </ul>
    )
}

export default Messages
