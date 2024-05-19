// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import DomToImage from 'dom-to-image'
import { useRef } from 'react'
import { Camera } from 'react-feather'
import styled from 'styled-components/macro'
//import { isMobile } from 'utils/userAgent'

const StyledCameraIcon = styled(Camera)`
  height: 20px;
  width: 20px;

  stroke: ${({ theme }) => theme.text1};

  :hover {
    stroke: ${({ theme }) => theme.mevblue};
    opacity: 0.7;
  }
`

const StyledCameraButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  border-radius: 0.5rem;
  height: 20px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

export default function ScreenshotTab({ targetContent }: { targetContent: string }) {
  const node = useRef<HTMLDivElement>()

  const clickScreenshotHandler = async () => {
    const element = document.getElementById(targetContent)

    if (!element) {
      console.log('Not Found')
      return null
    }
    try {
      DomToImage.toBlob(element)
        .then(function (blob) {
          navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ])
          console.log('Fetched image copied.')
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
    } catch (e) {
      console.log('error: ', e)
    }
  }

  return (
    <StyledMenu ref={node as any}>
      <StyledCameraButton onClick={clickScreenshotHandler} id="screenshot-button" aria-label={t`Screenshot Button`}>
        <StyledCameraIcon />
      </StyledCameraButton>
    </StyledMenu>
  )
}
