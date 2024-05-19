import { darken } from 'polished'
import styled from 'styled-components/macro'
import { ExternalLink } from 'theme'

const ResourceLink = styled(ExternalLink)`
  display: flex;
  color: ${({ theme }) => theme.mevblue};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  gap: 4px;
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${({ theme }) => darken(0.1, theme.mevorange)};
    text-decoration: none;
  }
`
export default function Resource({ name, link }: { name: string; link: string }) {
  return (
    <ResourceLink href={link}>
      {name}
      <sup>↗</sup>
    </ResourceLink>
  )
}
