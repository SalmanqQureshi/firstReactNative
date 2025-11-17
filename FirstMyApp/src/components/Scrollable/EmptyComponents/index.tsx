import React from "react";
import { Block } from "../../Layout";
import { Image } from "../../Image";
import { Text } from "../../Text";

const EmptyImage = require("./assets/Empty.png")

export const ListEmptyComponent = ()=>{
    return(
    <Block flex align='middle'>
    <Image source={EmptyImage} />
    <Text size="H4" font="SemiBold">No Data Found</Text>
         </Block>
        )
}