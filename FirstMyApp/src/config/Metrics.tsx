import {Dimensions, Platform} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const {width, height} = Dimensions.get('window');
const screenWidth = width < height ? width : height;
const screenHeight = width < height ? height : width;

const IPHONE_XS_HEIGHT = 812; // iPhone X and XS
const IPHONE_XR_HEIGHT = 896; // iPhone XR and XS Max
const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  Platform.isPad &&
  !Platform.isTV &&
  (screenHeight === IPHONE_XS_HEIGHT ||
    screenWidth === IPHONE_XS_HEIGHT ||
    screenHeight === IPHONE_XR_HEIGHT ||
    screenWidth === IPHONE_XR_HEIGHT);

var designedAtX = true;

const guidelineBaseWidth = designedAtX ? 375 : 414;
const guidelineBaseHeight = designedAtX ? 812 : 736;
const guidelineBaseIpadHeight = designedAtX ? 1366 : 1024;
const guidelineBaseIpadWidth = designedAtX ? 1024 : 768;

const scaleHorizontal = (size:number|string) => (screenWidth / guidelineBaseWidth) * +size;
const scaleVertical = (size:number) => (screenHeight / guidelineBaseHeight) * size;
const scaleHorizontalPad = (size:number|string) => (screenWidth / guidelineBaseIpadWidth) * +size;
const scaleVerticalPad = (size:number) => (screenHeight / guidelineBaseIpadHeight) * size;

const heightRatio = (size:number) => scaleVertical(size);
const widthRatio = (size:number|string) => scaleHorizontal(size);

const iPadHeightRatio = (size:number) => scale(size);
const iPadWidthRatio = (size:number|string) => scaleHorizontal(size);

const generatedFontSize = (size:number) => scaleVertical(size);

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;

const NAVBAR_HEIGHT = Platform.OS === 'ios' ? heightRatio(44) : heightRatio(56);
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const ISPad = Platform.OS=='ios' && Platform.isPad
const androidPlatform = Platform.OS=='android'
const iOSPlatform = Platform.OS=='ios'

export default {
  width, 
  height,
  designedAtX,
  IS_IPHONE_X,
  STATUSBAR_HEIGHT,
  NAVBAR_HEIGHT,
  heightRatio,
  widthRatio,
  screenWidth,
  screenHeight,
  generatedFontSize,
  iPadHeightRatio,
  iPadWidthRatio,
  ISPad,
  androidPlatform,
  iOSPlatform,
  searchBarHeight: heightRatio(50),
  smallMargin: heightRatio(8),
  baseMargin: heightRatio(16),
  doubleBaseMargin: heightRatio(24),
  xDoubleBaseMargin: heightRatio(32),
  horizontalLineHeight: heightRatio(1),

  statusBarHeight: STATUSBAR_HEIGHT,
  navBarHeight: NAVBAR_HEIGHT + STATUSBAR_HEIGHT,

  tabBarHeight: 49, // Default tab bar height in iOS 10

  icons: {
    tiny: heightRatio(16),
    small: heightRatio(24),
    normal: heightRatio(32),
    medium: heightRatio(48),
    large: heightRatio(64),
    xl: heightRatio(128),
  },
  images: {
    xSmall: heightRatio(15),
    small: heightRatio(20),
    medium: heightRatio(40),
    large: heightRatio(55),
    xLarge: heightRatio(70),
    avatar: heightRatio(90),
    profile: heightRatio(135),
    logo: heightRatio(200),
    radius: heightRatio(100),
    coverWidth: screenWidth,
    coverHeight: screenWidth / 2,
  },
  mediumIcon: {
    // height: heightRatio(50),
    // width: heightRatio(50),
  },
  smallIcon: {
    height: heightRatio(25),
    width: heightRatio(25),
  },
  ASPECT_RATIO,
  LATITUDE_DELTA,
};
