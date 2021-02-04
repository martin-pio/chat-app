import React from 'react'
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite'
// eslint-disable-next-line arrow-body-style
const ConditionalBadge = ({condition,children}) => {
    return condition ? <Badge content={condition}>{children}</Badge> : children
}

// eslint-disable-next-line arrow-body-style
const IconbtnControl = ({isVisible,iconName,tooltip,onClick,badgeContent,...props}) => {

    return (
        <div className='ml-2' style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            <ConditionalBadge condition = {badgeContent}>
                <Whisper
                    placement='top'
                    delay={0}
                    delayHide={0}
                    delayShow={0}
                    trigger='hover'
                    speaker={<Tooltip>{tooltip}</Tooltip>}
                >
                    <IconButton
                        {...props}
                        onClick={onClick}
                        circle
                        size='xs'
                        icon = {<Icon icon={iconName}/>}
                    />
                </Whisper>
            </ConditionalBadge>
            
        </div>
    )
}

export default IconbtnControl
