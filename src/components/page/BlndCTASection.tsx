import { Button } from '@chakra-ui/react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../auth/AuthContext'
import { AuthModalContext } from '../auth/AuthModal'

const StyledSection = styled.section`
  &.cta {
    background-image: url('https://static.kolable.com/images/blnd/bg@3x.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .join-us {
    padding: 120px 166px;
  }
  .join-us h2 {
    font-family: Noto Sans TC;
    font-size: 40px;
    font-weight: bold;
    line-height: 1;
    color: #fff;
  }
  .join-us h3 {
    font-family: Noto Sans TC;
    font-size: 18px;
    color: #fff;
  }

  @media screen and (max-width: 992px) {
    .join-us {
      padding: 60px 60px;
      text-align: center;
    }
    .join-us h2 {
      font-size: 40px;
      color: #fff;
      letter-spacing: 1px;
    }
    .join-us h3 {
      font-size: 18px;
      color: #fff;
      margin-bottom: 32px;
      letter-spacing: 0px;
    }
  }
`

const StyledButton = styled(Button)`
  && {
    width: 210px;
    height: 44px;
    margin: 32px 125px 0 0;
    padding: 10px 56px;
    border-radius: 4px;
    background-color: #4c60ff;
    color: #fff;
    margin-top: 32px;

    @media screen and (max-width: 992px) {
      margin: auto;
    }
  }
`

const BlndCTASection: React.FC = () => {
  const { currentMemberId } = useAuth()
  const { setVisible } = useContext(AuthModalContext)
  return (
    <StyledSection className="cta">
      <div className="join-us">
        <h2 className="title">JOIN US</h2>
        <h3>加入BLND，向你的專業目標邁出下一步</h3>
        {currentMemberId ? (
          <Link to="/activities?categories=272bc7d6-469e-49f2-be5c-1f4700b15ff8">
            <StyledButton variant="primary">開始我的課程</StyledButton>
          </Link>
        ) : (
          <StyledButton variant="primary" onClick={() => setVisible?.(true)}>
            開始我的課程
          </StyledButton>
        )}
      </div>
    </StyledSection>
  )
}

export default BlndCTASection
