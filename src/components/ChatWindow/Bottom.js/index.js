import React, { useCallback, useState } from 'react'
import firebase from 'firebase/app'
import { Alert, Icon, Input, InputGroup } from 'rsuite'
import { useParams } from 'react-router'
import { useProfile } from '../../../context/profile.context'
import { database } from '../../../misc/firebase'

function assembleMessage (profile,chatId){
    return{
        roomId: chatId,
        author:{
            name : profile.name,
            uid : profile.uid,
            createdAt : profile.createdAt,
            ...(profile.avatar ? { avatar : profile.avatar } : {})
        },
        createdAt : firebase.database.ServerValue.TIMESTAMP,
    }
}
const ChatBottom = () => {
    const [input,setInput] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const {profile} = useProfile()
    const {chatId} = useParams()
    const onInputChange = useCallback((value) =>{
        setInput(value)
    },[])
    const onSendClick = async () => {
        if(input.trim() === ''){
            // eslint-disable-next-line no-useless-return
            return
        }
        const msgData = assembleMessage(profile,chatId)
        msgData.text = input

        const updates = {}
        const messageId = database.ref('messages').push().key

        updates[`/messages/${messageId}`] = msgData
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...msgData,
            msgId : messageId,
        }
        setIsLoading(true)
        try{
            await database.ref().update(updates)
            setIsLoading(false)
        }
        catch(err){
            setIsLoading(false)
            Alert.error(err.message,3000)
        }
    }
    const onKeyDown = e => {
        e.preventDefault()
        if(e.target.value === 13){
            onSendClick()
        }
    }
    
    return (
        <div>
            <InputGroup>
                <Input placeholder='Write a Message here' value={input} onChange={onInputChange} onKeyDown={onKeyDown}/>
                <InputGroup.Button color='blue' appearance='primary' onClick={onSendClick} disabled={isLoading}>
                    <Icon icon='send'/>
                </InputGroup.Button> 
            </InputGroup>
        </div>
    )
}

export default ChatBottom
 