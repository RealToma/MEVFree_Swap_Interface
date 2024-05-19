import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components/macro'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg0: Color
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color

  modalBG: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  yellow3: Color
  blue1: Color
  blue2: Color

  blue4: Color

  mevblue: Color
  mevpink: Color
  mevorange: color
  mevbggrey: color

  error: Color
  success: Color
  warning: Color

  gray50: Color
  gray100: Color
  gray200: Color
  gray300: Color
  gray400: Color
  gray500: Color
  gray600: Color
  gray700: Color
  gray800: Color
  gray900: Color
  pink50: Color
  pink100: Color
  pink200: Color
  pink300: Color
  pink400: Color
  pink500: Color
  pink600: Color
  pink700: Color
  pink800: Color
  pink900: Color
  pinkVibrant: Color
  red50: Color
  red100: Color
  red200: Color
  red300: Color
  red400: Color
  red500: Color
  red600: Color
  red700: Color
  red800: Color
  red900: Color
  redVibrant: Color
  yellow50: Color
  yellow100: Color
  yellow200: Color
  yellow300: Color
  yellow400: Color
  yellow500: Color
  yellow600: Color
  yellow700: Color
  yellow800: Color
  yellow900: Color
  yellowVibrant: Color
  gold200: Color
  goldVibrant: Color
  green50: Color
  green100: Color
  green200: Color
  green300: Color
  green400: Color
  green500: Color
  green600: Color
  green700: Color
  green800: Color
  green900: Color
  greenVibrant: Color
  blue50: Color
  blue100: Color
  blue200: Color
  blue300: Color
  blue400: Color
  blue500: Color
  blue600: Color
  blue700: Color
  blue800: Color
  blue900: Color
  blueVibrant: Color
  magentaVibrant: Color
  purple900: Color
  networkEthereum: Color
  networkOptimism: Color
  networkOptimismSoft: Color
  networkPolygon: Color
  networkArbitrum: Color
  networkPolygonSoft: Color
  networkEthereumSoft: Color
}

declare module 'styled-components/macro' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
