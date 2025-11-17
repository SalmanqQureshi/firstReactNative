import { ImageProps as ImagePropsBase,Image as ImageBase, ImageStyle, Animated} from 'react-native'
import React from 'react'
import { MarginPaddingType, getMarginPadding } from '../getMarginPadding';

interface ImageProps extends ImagePropsBase {
    margin?: MarginPaddingType;
    padding?: MarginPaddingType;
    size?:number,
    height?:number,
    width?:number,
    borderRadius?:number,
}

export const Image = ({style,margin,padding,height,width,borderRadius,size,...props}: ImageProps) => {
    
    const Style = [
        !!margin && getMarginPadding(margin,"margin"),
        !!padding && getMarginPadding(padding,'padding'),
        !!height&&{height},
        !!width&&{width},
        !!size&&{height:size,width:size},
        !!borderRadius&&{borderRadius},
        style
    ]

return (
    <Animated.Image {...props} style={Style}/>
  )
}
