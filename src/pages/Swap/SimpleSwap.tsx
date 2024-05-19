import styled from 'styled-components/macro'

import SimpleTokenSwap from './SimpleTokenSwap'

const Wrapper = styled.div`
  display: auto;
  width: 100%;
  height: 100%;
`

const SimpleSwap = () => {
  return (
    <Wrapper>
      <SimpleTokenSwap />
    </Wrapper>
  )
}
export default SimpleSwap
