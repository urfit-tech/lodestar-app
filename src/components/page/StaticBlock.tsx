import styled from 'styled-components'

const StyledWrapper = styled.div<{ styles: string }>`
  ${props => props.styles}
`

const StaticBlock: React.VFC<{ options: { html: string; styles: string } }> = ({ options: { html, styles } }) => (
  <StyledWrapper dangerouslySetInnerHTML={{ __html: html }} styles={styles} />
)

export default StaticBlock
