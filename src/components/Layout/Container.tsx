import { Box, BoxProps } from 'components/UIKit'

// eslint-disable-next-line react/prop-types
const Container: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box px={['16px', '24px']} mx="auto" maxWidth="1200px" {...props}>
    {children}
  </Box>
)

export default Container
