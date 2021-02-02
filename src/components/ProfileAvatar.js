import React from 'react'
import { Avatar } from 'rsuite'
import { getNameInitials } from '../misc/helper'

const ProfileAvatar = ({name, ...avatarProps}) => (
        <Avatar circle {...avatarProps}>
            {getNameInitials(name)}
        </Avatar>
    )

export default ProfileAvatar
