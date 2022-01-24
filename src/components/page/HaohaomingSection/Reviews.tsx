import { Carousel, Rate } from 'antd'
import styled from 'styled-components'
import { ReviewsProp } from './type'
import { Content, SectionTitle, StyledAvatar } from './util'

const StyledSection = styled.section`
  padding: 0;
  background: white;
  text-align: center;
`
const StyledCarousel = styled(Carousel)`
  && {
    padding-bottom: 50px;

    .slick-dots {
      li {
        margin: 0 5px;
      }
      li button {
        width: 10px;
        height: 10px;
        background: #ececec;
        border-radius: 50%;
      }
      li.slick-active button {
        width: 10px;
        background: ${props => props.theme['@primary-color']};
        border-radius: 50%;
      }
    }
  }
`
const Wrapper = styled.div`
  padding: 0 30px;
  color: ${props => props.theme['@heading-color']};
  text-align: justify;

  .name {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`

const Reviews: React.VFC<ReviewsProp> = ({ title, subtitle, students }) => (
  <StyledSection>
    <div className="container">
      <SectionTitle title={title || ''} subtitle={subtitle || ''} />

      <StyledCarousel
        arrows={false}
        draggable={true}
        infinite={false}
        slidesToShow={3}
        responsive={[
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
            },
          },
        ]}
      >
        {students?.map(student => (
          <Wrapper key={student.name}>
            <Content className="mb-4">
              <p>{student.reviews}</p>
            </Content>
            <div className="d-flex justify-content-start align-items-center">
              <StyledAvatar src={student.photo} size={40} className="mr-3" />
              <div className="name mr-3">{student.name}</div>
              <Rate allowHalf defaultValue={student.rate} />
            </div>
          </Wrapper>
        ))}
      </StyledCarousel>
    </div>
  </StyledSection>
)

export default Reviews
