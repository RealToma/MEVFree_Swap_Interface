import './styles.css'

import AnimatedPage from 'components/AnimatedPage/AnimatedPage'
import { AutoColumn } from 'components/Column'
import { motion } from 'framer-motion'
import { GenericBodyWrapper } from 'pages/AppBody'
import { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'

import Animation from './Animation/Animation'

const BodyWrapper = styled(AutoColumn)`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  padding: 10px 16px 0px 16px;
  column-gap: 20px;
  margin: auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 10px 8px 0px 8px;
    grid-template-columns: 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px 4px 0px 4px;
    grid-template-columns: 1fr;
  `};
`

const LinkWrapper = styled(AutoColumn)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 80%;
  padding: 10px 16px 0px 16px;
  column-gap: 20px;
  margin: auto;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 10px 8px 0px 8px;
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px 4px 0px 4px;
    grid-template-columns: 1fr;
  `};
`

const InnerWrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  padding: 4px 0 4px 0;
  margin: auto;
`

export default function Home() {
  const theme = useContext(ThemeContext)
  const aboutLine0 = 'MEVFREE ECOSYSTEM'
  const aboutLine1 =
    'MEVFree is a suite of tools that protects holders and allows them to extract the maximum value on every single trade in the dark forest'

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.01,
      },
    },
  }
  const sentence2 = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.02,
      },
    },
  }
  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <AnimatedPage>
      <BodyWrapper>
        <BodyWrapper>
          <InnerWrapper>
            <Animation></Animation>
          </InnerWrapper>
          <GenericBodyWrapper>
            <motion.h2
              className="load-screen--message"
              variants={sentence}
              initial="hidden"
              animate="visible"
              style={{
                boxSizing: 'border-box',
                lineHeight: 1.2,
                margin: '0.75em',
                color: theme.mevorange,
                fontWeight: 200,
                marginTop: '0.5em',
                marginBottom: '0.5em',
                fontFamily: 'Formular, sans-serif',
                fontSize: '2em',
                letterSpacing: '0em',
                textTransform: 'none',
                textAlign: 'center',
              }}
            >
              {aboutLine0.split('').map((char, index) => {
                return (
                  <motion.span key={char + '-' + index} variants={letter}>
                    {char}
                  </motion.span>
                )
              })}
              <br />
            </motion.h2>
            <motion.h2
              className="load-screen--message"
              variants={sentence2}
              initial="hidden"
              animate="visible"
              style={{
                boxSizing: 'border-box',
                lineHeight: 1.2,
                margin: '0.75em',
                color: 'rgb(255, 255, 255)',
                fontWeight: 200,
                marginTop: '0.5em',
                marginBottom: '0.5em',
                fontFamily: 'Formular, sans-serif',
                fontSize: '2em',
                letterSpacing: '0em',
                textTransform: 'none',
                textAlign: 'center',
              }}
            >
              {aboutLine1.split('').map((char, index) => {
                return (
                  <motion.span key={char + '-' + index} variants={letter}>
                    {char}
                  </motion.span>
                )
              })}
            </motion.h2>
          </GenericBodyWrapper>
        </BodyWrapper>
        <LinkWrapper>
          <InnerWrapper>
            <div className="padding-bottom home-buttons">
              <a href="/" className="content-centered card w-inline-block" style={{ textDecoration: 'none' }}>
                <h3
                  style={{
                    boxSizing: 'border-box',
                    lineHeight: 1.2,
                    margin: '0.75em',
                    color: theme.white,
                    fontWeight: 400,
                    marginTop: '0.5em',
                    marginBottom: '0.5em',
                    fontFamily: 'Formular, sans-serif',
                    fontSize: '2em',
                    letterSpacing: '0em',
                    textTransform: 'none',
                    textAlign: 'center',
                  }}
                >
                  Trading Tools
                </h3>
                <div className="content-centered home-card-text">
                  Tools to help you get the Maximal Extractable Value
                </div>
              </a>
            </div>
          </InnerWrapper>
          <InnerWrapper>
            <div className="padding-bottom home-buttons">
              <a href="/" className="content-centered card w-inline-block" style={{ textDecoration: 'none' }}>
                <h3
                  style={{
                    boxSizing: 'border-box',
                    lineHeight: 1.2,
                    margin: '0.75em',
                    color: theme.white,
                    fontWeight: 400,
                    marginTop: '0.5em',
                    marginBottom: '0.5em',
                    fontFamily: 'Formular, sans-serif',
                    fontSize: '2em',
                    letterSpacing: '0em',
                    textTransform: 'none',
                    textAlign: 'center',
                  }}
                >
                  Resource Library
                </h3>
                <div className="content-centered home-card-text">A library of information resources</div>
              </a>
            </div>
          </InnerWrapper>
          <InnerWrapper>
            <div className="padding-bottom home-buttons">
              <a href="/" className="content-centered card w-inline-block" style={{ textDecoration: 'none' }}>
                <h3
                  style={{
                    boxSizing: 'border-box',
                    lineHeight: 1.2,
                    margin: '0.75em',
                    color: theme.white,
                    fontWeight: 400,
                    marginTop: '0.5em',
                    marginBottom: '0.5em',
                    fontFamily: 'Formular, sans-serif',
                    fontSize: '2em',
                    letterSpacing: '0em',
                    textTransform: 'none',
                    textAlign: 'center',
                  }}
                >
                  Connect with us:
                </h3>
                <div className="content-centered home-card-text">
                  Click the 3 dots in the top right corner for all of our links. Or email the Dev at dev@mevfree.com
                </div>
              </a>
            </div>
          </InnerWrapper>
        </LinkWrapper>
      </BodyWrapper>
    </AnimatedPage>
  )
}
