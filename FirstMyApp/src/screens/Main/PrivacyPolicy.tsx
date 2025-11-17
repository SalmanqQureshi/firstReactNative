import React, { useEffect } from 'react'
import { Block, Text } from '../../components'
import { ScrollView, StyleSheet } from 'react-native';
import { Colors, Metrics } from '../../config';

export const PrivacyPolicy = (props: any) => {
  useEffect(()=>{
    props.navigation.setOptions({
        headerTitle:()=><Text size="H4" font="SemiBold">{props.route.params.itemClickTitle}</Text>,
    })
},[])
  return (
    <Block flex scroll gradient={[Colors.background, Colors.textBackground]}>
      <ScrollView>
      <Block style={styles.container} >
        <Text style={styles.Text} size={'H6'}>
          {' '}
          Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.
          {' '}
        </Text>
        <Text style={styles.Text} size={'H6'}>
          {'The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.'}
        </Text>
        <Text style={styles.Text} size={'H6'}>
          {'The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.'}
        </Text>
      </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  Text: {
    marginLeft: 10,
    lineHeight: 28,
    marginTop: 10,
  },
  container: {
    marginHorizontal: Metrics.iPadHeightRatio(16),
    marginBottom:36
  },
});