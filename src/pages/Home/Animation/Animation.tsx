import * as React from 'react'

import { Container, LottieWrapper } from './Animation.styled'
import mevfreeAnimation from './mevfree_frame.json'

const animationOptions = {
  loop: false,
  autoplay: true,
  animationData: mevfreeAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const Animation = () => (
  <Container>
    <LottieWrapper isClickToPauseDisabled options={animationOptions} />
  </Container>
)

export default Animation
