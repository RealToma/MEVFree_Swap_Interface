import styled, { useTheme } from 'styled-components/macro'

export const ChartContainer = styled.div`
  display: flex;
  height: 600px;
  align-items: center;
`

const LoadingChartContainer = styled(ChartContainer)`
  height: 550px;
  overflow: hidden;
`

const ChartAnimation = styled.div`
  display: flex;
  animation: wave 8s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
  overflow: hidden;

  @keyframes wave {
    0% {
      margin-left: 0;
    }
    100% {
      margin-left: -800px;
    }
  }
`
const Space = styled.div<{ heightSize: number }>`
  height: ${({ heightSize }) => `${heightSize}px`};
`

export function Wave() {
  const theme = useTheme()
  return (
    <svg width="416" height="160" xmlns="http://www.w3.org/2000/svg">
      <path d="M 0 80 Q 104 10, 208 80 T 416 80" stroke={theme.mevpink} fill="transparent" strokeWidth="2" />
    </svg>
  )
}

/* Loading State: row component with loading bubbles */
export default function LoadingWave() {
  return (
    <>
      <LoadingChartContainer>
        <div>
          <ChartAnimation>
            <Wave />
            <Wave />
            <Wave />
            <Wave />
            <Wave />
          </ChartAnimation>
        </div>
      </LoadingChartContainer>
      <Space heightSize={32} />
    </>
  )
}
