import { HTMLAttributes, SVGAttributes } from 'react'
import { DefaultTheme } from 'styled-components/macro'
import {
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
} from 'styled-system'

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    HTMLAttributes<HTMLDivElement> {}

export interface FlexProps extends BoxProps, FlexboxProps {}

export const animation = {
  WAVES: 'waves',
  PULSE: 'pulse',
} as const

export const variant = {
  RECT: 'rect',
  CIRCLE: 'circle',
} as const

export type Animation = typeof animation[keyof typeof animation]
export type Variant = typeof variant[keyof typeof variant]

export interface SkeletonProps extends SpaceProps, LayoutProps {
  animation?: Animation
  variant?: Variant
}

export interface TextProps extends SpaceProps, TypographyProps {
  color?: string
  fontSize?: string
  bold?: boolean
  small?: boolean
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize'
}

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement>, SpaceProps {
  theme?: DefaultTheme
  spin?: boolean
}
