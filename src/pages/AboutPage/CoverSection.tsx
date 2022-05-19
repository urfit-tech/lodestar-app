import React from 'react'
import styled from 'styled-components'

const StyledBackground = styled.div`
  position: relative;
  width: 100%;
  height: 420px;
  background-image: url('https://static.kolable.com/images/sunk/about-cover-20201026.jpg');
  background-size: cover;
  background-position: center;
`
// const StyledShield = styled.div`
//   position: relative;
//   top: 50%;
//   left: 50%;
//   max-width: 324px;
//   height: 200px;
//   background-color: white;
//   clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
//   transform: translate(-50%, -50%);
// `
// const StyledWrapper = styled.div`
//   margin-bottom: 10px;
// `
// const StyledHeading = styled(Heading)`
//   font-size: 24px;
//   font-weight: bold;
//   color: var(--gray-darker);
//   letter-spacing: 0.2px;
// `
// const StyledSubHeading = styled(Heading)`
//   font-size: 14px;
//   font-weight: 500;
//   color: ${props => props.theme['@primary-color']};
//   line-height: 1;
//   text-align: center;
//   letter-spacing: 0.4px;
// `

const CoverSection: React.FC = () => {
  return (
    <StyledBackground>
      {/* <StyledShield className="d-flex align-items-center justify-content-center">
        <StyledWrapper>
          <StyledHeading as="h2" className="mb-2">
            關於尚課
          </StyledHeading>
          <StyledSubHeading as="h3">About us</StyledSubHeading>
        </StyledWrapper>
      </StyledShield> */}
    </StyledBackground>
  )
}

export default CoverSection
