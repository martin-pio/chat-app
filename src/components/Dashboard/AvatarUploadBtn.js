import React, { useState,useRef } from 'react'
import { Alert, Button, Modal } from 'rsuite'
import AvatarEditor from 'react-avatar-editor'
import {useModalState} from '../../misc/custom-hooks'
import { database, storage } from '../../misc/firebase'
import { useProfile } from '../../context/profile.context'
import ProfileAvatar from '../ProfileAvatar'
import '../../styles/utility.scss'
import { getUserUpdates } from '../../misc/helper'


const fileTypes = '.png, .jpeg, .jpg'
const acceptedFiles = ['image/jpeg','image/pjpeg','image/png']
const isValidFile = file => acceptedFiles.includes(file.type)

const getBlob = canvas => new Promise((resolve,reject) => {
        canvas.toBlob(blob =>{
            if(blob){
                resolve(blob)
            }
            else{
                reject(new Error('File process error'))
            }
        })
    })

// eslint-disable-next-line arrow-body-style
const AvatarUploadBtn = () => {
    const { isOpen, open, close } = useModalState()
    const [img, setImg] = useState(null)
    const avatarEditorRef = useRef()
    const [isLoading,setIsLoading]  = useState(false)
    const {profile} = useProfile()
    const onFileInputChange = ev => {
        const currFiles = ev.target.files

        if(currFiles.length === 1){
            const file = currFiles[0]

            if(isValidFile(file)){
                setImg(file)
                open()
            }
            else{
                Alert.warning(`Wrong file type : ${file.type}`,3000)
            }
        }
    }
    const onUploadClick = async () => {
        const canvas = avatarEditorRef.current.getImageScaledToCanvas()
        setIsLoading(true)
        try{
            const blob = await getBlob(canvas)

            const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar')

            const uploadAvatarResult = await avatarFileRef.put( blob,
                    {
                        cacheControl: `public, max-age=${3600 * 24 * 3}`
                    }
                )
            const downloadUrl = await uploadAvatarResult.ref.getDownloadURL()
            
            const updates = await getUserUpdates(profile.uid,'avatar',downloadUrl,database)            
            await database.ref().update(updates)
            setIsLoading(false)
            Alert.success('Avatar has been uploaded',3000)
        }
        catch(err){
            setIsLoading(false)
            Alert.error(err.message,3000)
        }
    }
    return (
        <div className='mt-3 text-center'>
            <ProfileAvatar
                src={profile.avatar} 
                name = {profile.name}
                className = 'width-200 height-200 img-fullsize font-huge'
            />
            <div>
                <label
                    htmlFor='avatar-upload'
                    className='d-block cursor-pointer padded'
                >
                    Select new avatar
                    <input 
                        id='avatar-upload'
                        type='file'
                        className='d-none'
                        accept={fileTypes}
                        onChange = {onFileInputChange}
                    />                    
                </label>

                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>Adjust and upload new Avatar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center align-items-center h-100'>
                            {img && (
                                <AvatarEditor
                                    ref={avatarEditorRef}
                                    image={img}
                                    width={200}
                                    height={200}
                                    border={10}
                                    borderRadius={100}
                                    rotate={0}
                                />                                
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance='ghost' onClick = {onUploadClick} disabled={isLoading}>
                            Upload new avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>            
        </div>
    )
}

export default AvatarUploadBtn
// permission_denied at /mesages: Client doesn't have permission to access the desired data.
