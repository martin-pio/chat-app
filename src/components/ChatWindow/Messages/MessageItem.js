import React, { memo } from 'react'
import { Button } from 'rsuite'
import TimeAgo from 'timeago-react'
import { useCurrentRoom } from '../../../context/current-room.context'
import { useHover, useMediaQuery } from '../../../misc/custom-hooks'
import { auth } from '../../../misc/firebase'
import PresenceDot from '../../PresenceDot'
import ProfileAvatar from '../../ProfileAvatar'
import IconbtnControl from './IconbtnControl'
import ImageBtnModal from './ImageBtnModal'
import ProfileInfoBtnModal from './ProfileInfoBtnModal'
// eslint-disable-next-line arrow-body-style
const renderFileMessage = (file) => {

    if(file.contentType.includes('image')){
        return (<div className='height-220'> 
                    <ImageBtnModal src = {file.url} filename = {file.name} />
                </div>)
    }
    if(file.contentType.includes('audio')){
        return(
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio controls>
                <source src={file.url} type='audio/mp3'/>
                Your Browser does not support audio element
            </audio>
        )
    }

    return <a href={file.url} >Download {file.name}</a>
}

const MessageItem = ({ message,handleAdmin,handleLike,handleDelete }) => {
    const { author, createdAt, text, file, likes, likeCount} = message
    const isAdmin = useCurrentRoom(v => v.isAdmin)
    const admins = useCurrentRoom(v => v.admins)
    
    const [selfRef,isHovered] = useHover()

    const isMobile = useMediaQuery('(max-width: 992px)')

    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid)
    const canShowIcons = isMobile || isHovered
    
    const isMsgAuthorAdmin = admins.includes(author.uid)
    const isAuthor = auth.currentUser.uid === author.uid
    const canGrantAdmin = !!isAdmin && !isAuthor    
    return (
        <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`} ref={selfRef} >
            <div className='d-flex align-items-center font-bolder mb-1'>
                <PresenceDot uid={author.uid}/>
                <ProfileAvatar src={author.avatar} name={author.name} className='ml-1' size='xs'/>                
                <ProfileInfoBtnModal profile={author} appearance='link' className='p-0 ml-1 text-black'>
                    {
                        canGrantAdmin &&
                        <Button block onClick={()=>handleAdmin(author.uid)} color='blue'>
                                {isMsgAuthorAdmin ? 'Remove admin permission' : 'Give admin in this room'}
                            </Button>
                    }
                </ProfileInfoBtnModal>
                <TimeAgo datetime={createdAt} className='font-normal text-black-45 ml-2'/>
                <IconbtnControl
                    {...(isLiked ? {color:'red'}:{})}
                    isVisible = {canShowIcons}
                    iconName = 'heart'
                    tooltip = 'like this message'
                    onClick ={()=>handleLike(message.id)}
                    badgeContent = {likeCount}
                />
                {
                    isAuthor && (
                        <IconbtnControl
                            isVisible = {canShowIcons}
                            iconName = 'close'
                            tooltip = 'delete this message'
                            onClick ={()=>handleDelete(message.id,file)}                            
                        />
                    )
                }
            </div>
            <div>
                {text && <span className='word-breal-all'>{text}</span>}
                {file && renderFileMessage(file)}
            </div>
        </li>
    )
}

export default memo(MessageItem)
