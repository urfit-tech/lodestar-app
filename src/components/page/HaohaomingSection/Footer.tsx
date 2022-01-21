import styled from 'styled-components'

const StyledFooter = styled.footer`
  border-top: 1px solid #ececec;
  padding: 1rem 0;
  background: white;
  color: #9b9b9b;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.6px;
`

const Footer = () => {
  return <StyledFooter>© {new Date().getFullYear()} 桃桃喜</StyledFooter>
}

export default Footer
