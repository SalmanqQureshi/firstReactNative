import React from 'react'
import { Block } from '../Layout'
import { Text } from '../Text'

export const ItemColoumn = ({title, icon,style,value,valueTextColor}: any) => {
    return (
        <Block style={style}>
            <Text
                style={{ paddingTop: 5 }}
                margin={{ Horizontal: 4 }}
                font='Medium'
                size="H5">
                {title}
            </Text>
            <Text
                style={{ paddingTop: 5 }}
                color={valueTextColor}
                margin={{ Horizontal: 4 }}
                font='Regular'
                size="H6">
                {value}
            </Text>
        </Block>
    )
}
