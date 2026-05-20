import { Button } from 'antd'
import { BsArrowRightCircle } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import bannerMobile from '../../../images/banner/banner20260517-mobile.jpg'
import banner from '../../../images/banner/banner20260517.jpg'
import HaohaomingSectionMessages from './translation'

const SURVEY_URL = 'https://ttx.tw/Hpelc'

const StyledSection = styled.section`
  position: relative;
  height: 628px;
  background-image: url(${banner});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  @media (max-width: 768px) {
    padding: 0;
    height: calc(100vh - 64px);
    background-image: url(${bannerMobile});
    max-height: 100vh;
  }
`
const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  height: 100%;
  padding: 8vw 0;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    align-items: flex-start;
    padding: 30px 15px;
  }
`
const SurveyButton = styled(Button)`
  && {
    position: absolute;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 0 10px;
    right: 310px;
    bottom: 20%;
    max-width: 76%;
    height: 30px;
    border-radius: 10px;

    @media (max-width: 1200px) {
      right: 29%;
    }

    @media (max-width: 768px) {
      right: auto;
      left: 67%;
      top: 45%;
      transform: translateX(-50%);
      max-width: 90%;
    }

    span {
      line-height: 1;
    }
  }
`
const CoverBanner: React.FC = () => {
  const { formatMessage } = useIntl()
  return (
    <StyledSection>
      <StyledContainer>
        <SurveyButton
          type="primary"
          size="large"
          disabled={!SURVEY_URL}
          onClick={() => SURVEY_URL && window.open(SURVEY_URL, '_blank', 'noopener,noreferrer')}
        >
          {formatMessage(HaohaomingSectionMessages.Cover.getOffer)}
          <BsArrowRightCircle size="1.2em" />
        </SurveyButton>
      </StyledContainer>
    </StyledSection>
  )
}

export default CoverBanner
