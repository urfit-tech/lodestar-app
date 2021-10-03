import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useOnceAnimation } from '../../helpers'
import { usePublishedProgramCollection } from '../../hooks/program'
import { BREAK_POINT } from '../common/Responsive'
import ProgramCard from '../program/ProgramCard'
import { StyledCarousel } from './TeacherSection'

const StyledColumn = styled.div<{ backgroundImage: string }>`
  position: relative;
  padding: 112px 40px;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 128px clamp(50px, 5.5vw, 110px);
  }
`
const StyledDecoration = styled.img`
  width: 110px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -33%);

  @media (min-width: ${BREAK_POINT}px) {
    left: 0;
    transform: translate(0, -33%);
    margin-left: clamp(50px, 5.5vw, 110px);
  }
`
const StyledTitle = styled.h2`
  color: #fff;
  font-weight: bold;
  font-size: 40px;
  line-height: 1.1;
  letter-spacing: 1px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: clamp(40px, 3.5vw, 60px);
    line-height: 1.35;
    letter-spacing: 1.5px;
  }
`
const StyledSubTitle = styled.h3`
  color: #fff;
  font-family: PingFangTC;

  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.23px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
    font-weight: bold;
    line-height: 1.1;
    letter-spacing: 1px;
  }
`
const StyledQuote = styled.p`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: #fff;
  max-width: 295px;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 245px;
  }
`
const StyledQuotePerson = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: #fff;
`

const StyledProgramColumn = styled.div<{ color: string }>`
  background-color: ${props => props.color};
`
const StyledProgramColumnWrapper = styled.div`
  width: 100%;
  margin: 80px auto;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 560px;
  }
  @media (min-width: 1440px) {
    max-width: 780px;
  }
`
const StyledLink = styled(Link)<{ color: string }>`
  width: 178px;
  height: 44px;
  padding: 10px 56px;
  border-radius: 4px;
  color: white;
  background-color: ${props => props.color};
`

const ProgramIntroSection: React.VFC<{
  options: {
    backgroundImage: string
    subtitle: string
    quote: string
    person: string
    backgroundColor: string
    linkColor: string
    decorationImage?: string
    title?: string
  }
}> = ({
  options: { decorationImage, backgroundImage, title, subtitle, quote, person, backgroundColor, linkColor },
}) => {
  const { ref, activated } = useOnceAnimation()
  const { programs } = usePublishedProgramCollection({
    isPrivate: false,
    limit: 6,
  })

  return (
    <section className="row m-0">
      <StyledColumn className="col-12 col-lg-4" backgroundImage={backgroundImage}>
        {decorationImage && <StyledDecoration src={decorationImage} />}
        {title && <StyledTitle className="mb-2">{title}</StyledTitle>}
        <StyledSubTitle className="mb-5">{subtitle}</StyledSubTitle>
        <StyledQuote ref={ref} className={`mb-3 ${activated ? 'animate__animated animate__fadeInRight' : ''}`}>
          {quote}
        </StyledQuote>
        <StyledQuotePerson>{person}</StyledQuotePerson>
      </StyledColumn>
      <StyledProgramColumn className="col-12 col-lg-8" color={backgroundColor}>
        <StyledProgramColumnWrapper>
          <StyledCarousel
            infinite
            arrows={true}
            autoplay
            autoplaySpeed={10000}
            slidesToShow={2}
            responsive={[
              {
                breakpoint: BREAK_POINT,
                settings: {
                  slidesToShow: 1,
                },
              },
            ]}
          >
            {programs.map(program => (
              <div className="px-5 px-lg-2">
                <ProgramCard program={program} withMeta noInstructor />
              </div>
            ))}
          </StyledCarousel>
          <div className="text-center mt-4">
            <StyledLink to="/programs" color={linkColor}>
              查看更多
            </StyledLink>
          </div>
        </StyledProgramColumnWrapper>
      </StyledProgramColumn>
    </section>
  )
}

export default ProgramIntroSection
