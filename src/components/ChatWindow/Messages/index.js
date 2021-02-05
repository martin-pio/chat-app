/* eslint-disable no-alert */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {useParams } from 'react-router'
import { Alert, Button } from 'rsuite'
import { auth, database, storage } from '../../../misc/firebase'
import { groupBy, transformToArrayWithId } from '../../../misc/helper'
import MessageItem from './MessageItem'

const PAGE_SIZE = 15
const messageRef = database.ref('/messages')

function shouldScrollBottom(node, threshold = 30){
    const percentage = (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0
    return percentage > threshold
}

const Messages = () => {
    const { chatId } =useParams()
    const [messages,setMessages] = useState(null)
    const [limit,setLimit] = useState(PAGE_SIZE)
    const selfRef = useRef()

    const isChatEmpty = messages && messages.length === 0
    const canShowMessages = messages && messages.length > 0
    
    const loadMessages = useCallback((limitToLast) => {
        const node = selfRef.current
        messageRef.off()
        messageRef.orderByChild('roomId').equalTo(chatId).limitToLast(limitToLast || PAGE_SIZE).on('value',(snap) => {
            const data = transformToArrayWithId(snap.val())
            setMessages(data)
            
            if(shouldScrollBottom(node)){
                node.scrollTop = node.scrollHeight
            }

        })
        setLimit(p => p + PAGE_SIZE)
    },[chatId])

    const onLoadMore = useCallback(() => {
        const node = selfRef.current
        const oldHeight = node.scrollHeight

        loadMessages(limit)
        
        setTimeout(() => {
            const newHeight = node.scrollHeight
            node.scrollTop = newHeight-oldHeight
        }, 200);
    },[loadMessages,limit])

    useEffect(()=>{
        const node = selfRef.current
    
        loadMessages()
        setTimeout(() => {        
            node.scrollTop = node.scrollHeight
        }, 200);

        return () =>{
            messageRef.off('value')
        }
    },[loadMessages])

    const handleDelete = useCallback(async (msgId,file) => {
        if (!window.confirm('Delete this Message ?')){
            return
        }
        const isLast = messages[messages.length - 1].id === msgId
        const updates = {}
        updates[`/messages/${msgId}`] = null
        if(isLast && messages.length>1){
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length-2],
                msgId : messages[messages.length -2].id
            }
        }
        if(isLast && messages.length === 1){
            updates[`/rooms/${chatId}/lastMessage`] = null
        }

        try{
            await database.ref().update(updates)
            Alert.info('Message has been deleted...',3000)
        }
        catch(err){
            // eslint-disable-next-line consistent-return
            return Alert.error(err.message,3000)
        }

        if(file){
            try {
                const fileRef = await storage.refFromURL(file.url)
                await fileRef.delete()
            } catch (err) {
                Alert.error(err.message)
            }
        }
    },[chatId,messages])

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
        // eslint-disable-next-line no-shadow
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
    const renderMessages = () =>{
        const groups = groupBy(messages, item=> new Date(item.createdAt).toDateString())
        const items = []

        Object.keys(groups).forEach((date) => {
            items.push(<li key={date} className='text-center mb-1 padded'>{date}</li>)

            const msgs = groups[date].map(msg => (
                <MessageItem key={msg.id} 
                message={msg} 
                handleAdmin={handleAdmin} 
                handleLike={handleLike}
                handleDelete = {handleDelete}
                />)
            )
            items.push(...msgs) 
        })
        return items
    }

    return (
        <ul ref = {selfRef} className='msg-list custom-scroll'>
            {messages && messages.length >= PAGE_SIZE && (
                <li className='text-center mt-2 mb-2'>
                    <Button onClick={onLoadMore} color='green'>Load more</Button>
                </li>                
            )}
            {isChatEmpty && <li>No Messages yet</li>}
            {canShowMessages && renderMessages()}
        </ul>
    )
}

export default Messages
