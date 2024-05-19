import React, { useMemo } from 'react'
import { Text, TextProps as TextPropsOriginal } from 'rebass'
import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components/macro'

import { Colors } from './styled'

export * from './components'

type TextProps = Omit<TextPropsOriginal, 'css'>

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

// Migrating to a standard z-index system https://getbootstrap.com/docs/5.0/layout/z-index/
// Please avoid using deprecated numbers
export enum Z_INDEX {
  deprecated_zero = 0,
  deprecated_content = 1,
  dropdown = 1000,
  sticky = 1020,
  fixed = 1030,
  modalBackdrop = 1040,
  offcanvas = 1050,
  modal = 1060,
  popover = 1070,
  tooltip = 1080,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

function colors(): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: '#FFFFFF',
    text2: '#C3C5CB',
    text3: '#8F96AC',
    text4: '#B2B9D2',
    text5: '#2C2F36',

    // backgrounds / greys
    bg0: '#191B1F',
    bg1: '#212429',
    bg2: '#2C2F36',
    bg3: '#40444F',
    bg4: '#565A69',
    bg5: '#6C7284',
    bg6: '#1A2028',

    //specialty colors
    modalBG: 'rgba(0,0,0,.425)',
    advancedBG: 'rgba(0,0,0,0.1)',

    //primary colors
    primary1: '#2172E5',
    primary2: '#3680E7',
    primary3: '#4D8FEA',
    primary4: '#376bad70',
    primary5: '#153d6f70',

    // color text
    primaryText1: '#5090ea',

    // secondary colors
    secondary1: '#2172E5',
    secondary2: '#17000b26',
    secondary3: '#17000b26',

    // other
    red1: '#FF4343',
    red2: '#F82D3A',
    red3: '#D60000',
    green1: '#27AE60',
    yellow1: '#E3A507',
    yellow2: '#FF8F00',
    yellow3: '#F3B71E',
    blue1: '#2172E5',
    blue2: '#5199FF',
    error: '#FD4040',
    success: '#27AE60',
    warning: '#FF8F00',

    // dont wanna forget these blue yet
    blue4: '#153d6f70',
    // blue5: '#153d6f70' : '#EBF4FF',

    mevblue: '#00A3FF',
    mevpink: '#DB00FF',
    mevorange: '#FFAB5E',
    mevbggrey: '#121219',

    gray50: '#F5F6FC',
    gray100: '#E8ECFB',
    gray200: '#C9D0E7',
    gray300: '#99A1BD',
    gray400: '#7C85A2',
    gray500: '#5E6887',
    gray600: '#404963',
    gray700: '#293249',
    gray800: '#141B2B',
    gray900: '#0E111A',
    pink50: '#F9ECF1',
    pink100: '#FFD9E4',
    pink200: '#FBA4C0',
    pink300: '#FF6FA3',
    pink400: '#FB118E',
    pink500: '#C41969',
    pink600: '#8C0F49',
    pink700: '#55072A',
    pink800: '#350318',
    pink900: '#2B000B',
    pinkVibrant: '#F51A70',
    red50: '#FAECEA',
    red100: '#FED5CF',
    red200: '#FEA79B',
    red300: '#FD766B',
    red400: '#FA2B39',
    red500: '#C4292F',
    red600: '#891E20',
    red700: '#530F0F',
    red800: '#380A03',
    red900: '#240800',
    redVibrant: '#F14544',
    yellow50: '#F6F2D5',
    yellow100: '#DBBC19',
    yellow200: '#DBBC19',
    yellow300: '#BB9F13',
    yellow400: '#A08116',
    yellow500: '#866311',
    yellow600: '#5D4204',
    yellow700: '#3E2B04',
    yellow800: '#231902',
    yellow900: '#180F02',
    yellowVibrant: '#FAF40A',
    // TODO: add gold 50-900
    gold200: '#EEB317',
    goldVibrant: '#FEB239',
    green50: '#E3F3E6',
    green100: '#BFEECA',
    green200: '#76D191',
    green300: '#40B66B',
    green400: '#209853',
    green500: '#0B783E',
    green600: '#0C522A',
    green700: '#053117',
    green800: '#091F10',
    green900: '#09130B',
    greenVibrant: '#5CFE9D',
    blue50: '#EDEFF8',
    blue100: '#DEE1FF',
    blue200: '#ADBCFF',
    blue300: '#869EFF',
    blue400: '#4C82FB',
    blue500: '#1267D6',
    blue600: '#1D4294',
    blue700: '#09265E',
    blue800: '#0B193F',
    blue900: '#040E34',
    blueVibrant: '#587BFF',
    // TODO: add magenta 50-900
    magentaVibrant: '#FC72FF',
    purple900: '#1C0337',
    // TODO: add all other vibrant variations
    networkEthereum: '#627EEA',
    networkOptimism: '#FF0420',
    networkOptimismSoft: 'rgba(255, 4, 32, 0.16)',
    networkPolygon: '#A457FF',
    networkArbitrum: '#28A0F0',
    networkPolygonSoft: 'rgba(164, 87, 255, 0.16)',
    networkEthereumSoft: 'rgba(98, 126, 234, 0.16)',
  }
}

function getTheme(): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: '#000',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeObject = useMemo(() => getTheme(), [])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

/**
 * Preset styles of the Rebass Text component
 */
export const ThemedText = {
  Main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  Link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  Label(props: TextProps) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />
  },
  Black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  White(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  Body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  LargeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  MediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  SubHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  Small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  Blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  Yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow3'} {...props} />
  },
  Red(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'red1'} {...props} />
  },
  DarkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  Gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  Italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  Error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
}

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background: url("./images/mev-bg2.jpg"), #000000;
  height: 100vh;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

body:before {
	content: " ";
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	background: -webkit-gradient(linear, left top, right top, from(#0ed7ff), color-stop(57%, #3535ff), to(#ff00a1));
  background: linear-gradient(90deg, #0ed7ff, #3535ff 57%, #ff00a1);
  opacity: 0.8;
  mix-blend-mode: hue;
}

a {
 color: ${({ theme }) => theme.blue1}; 
}
`
