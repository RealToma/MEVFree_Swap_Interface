import React from 'react'
import styled from 'styled-components/macro'

export const BodyWrapper = styled.main<{ margin?: string; maxWidth?: string; $boldTheme?: boolean }>`
  margin-top: ${({ margin }) => margin ?? '8px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '560px'};
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.mevbggrey};
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  border: solid;
  border-radius: 24px;
  border-width: 2px;
  border-color: ${({ theme, $boldTheme }) => ($boldTheme ? theme.gray200 : theme.gray400)};
  padding: 12px 8px 12px 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 8px 6px 8px 6px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 6px 4px 6px 4px;
  `};
`

export const BodyWrapper2 = styled.main<{ margin?: string; maxWidth?: string; $boldTheme?: boolean }>`
  margin-top: ${({ margin }) => margin ?? '8px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '620px'};
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.mevbggrey};
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  border: solid;
  border-radius: 24px;
  border-width: 2px;
  border-color: ${({ theme, $boldTheme }) => ($boldTheme ? theme.gray200 : theme.gray400)};
  padding: 12px 8px 12px 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 8px 6px 8px 6px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 6px 4px 6px 4px;
  `};
`

export const BodyWrapper3 = styled.main<{ margin?: string; maxWidth?: string; $boldTheme?: boolean }>`
  margin-top: ${({ margin }) => margin ?? '8px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '840px'};
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.mevbggrey};
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  border: solid;
  border-radius: 24px;
  border-width: 2px;
  border-color: ${({ theme, $boldTheme }) => ($boldTheme ? theme.gray200 : theme.gray400)};
  padding: 12px 8px 12px 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 8px 6px 8px 6px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 6px 4px 6px 4px;
  `};
`

export const GenericBodyWrapper = styled.main<{ margin?: string; maxWidth?: string; $boldTheme?: boolean }>`
  margin-top: ${({ margin }) => margin ?? '0px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '1200px'};
  margin-top: auto;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding: 12px 8px 12px 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 8px 6px 8px 6px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 6px 4px 6px 4px;
  `};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export function AppBody({
  maxWidth,
  idString,
  boldTheme,
  children,
  ...rest
}: {
  maxWidth?: string
  idString?: string
  boldTheme?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <BodyWrapper maxWidth={maxWidth} id={idString} $boldTheme={boldTheme} {...rest}>
        {children}
      </BodyWrapper>
    </>
  )
}

export function AppBody2({
  maxWidth,
  boldTheme,
  children,
  ...rest
}: {
  maxWidth?: string
  boldTheme?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <BodyWrapper2 maxWidth={maxWidth} $boldTheme={boldTheme} {...rest}>
        {children}
      </BodyWrapper2>
    </>
  )
}

export function AppBody3({
  maxWidth,
  idString,
  boldTheme,
  children,
  ...rest
}: {
  maxWidth?: string
  idString?: string
  boldTheme?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <BodyWrapper3 maxWidth={maxWidth} id={idString} $boldTheme={boldTheme} {...rest}>
        {children}
      </BodyWrapper3>
    </>
  )
}

export function GenericBody({
  maxWidth,
  boldTheme,
  children,
  ...rest
}: {
  maxWidth?: string
  boldTheme?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <GenericBodyWrapper maxWidth={maxWidth} $boldTheme={boldTheme} {...rest}>
        {children}
      </GenericBodyWrapper>
    </>
  )
}
