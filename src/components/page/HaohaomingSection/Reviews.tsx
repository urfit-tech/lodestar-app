import { Carousel, Rate } from 'antd'
import styled from 'styled-components'
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

const students = [
  {
    name: '慶楠',
    rate: 5,
    reviews:
      '我是2017年參加簡老師的課程，簡老師的面相課程對我的工作和事業有了很大的幫助，因為識人能力增強，節省了大量的寶貴時間成本，業務能力也一直成倍增長，課程通俗易懂，課堂氛圍很好，學習簡老師的課程，是一件很幸福的事，期待下次再次學習',
    photo: `https://static.kolable.com/images/haohaoming/student1.png`,
  },
  {
    name: '鴻波',
    rate: 4.5,
    reviews:
      '簡少年老師非常親和，亦師亦友，授課通俗易懂，理論實踐相結合。實用又難忘！非常喜歡聽簡老師講課，通俗易懂，立意新穎，專業有深度，很贊！',
    photo: `https://static.kolable.com/images/haohaoming/student2.png`,
  },
  {
    name: '曉慧',
    rate: 4.5,
    reviews:
      '2018年我在朋友的推薦下，參加了簡少年老師的課程，老師治學嚴謹、深入淺出，教學時常會結合諸多案例，每周去聽老師的課本身已經是件很開心的事情了。對於之前從未接觸過紫微的我，課程內容也比較好理解、應用性很強，學完基礎課程即可自己練習解盤。感謝老師對我學習與生活中的幫助，期待更多學習機會！',
    photo: `https://static.kolable.com/images/haohaoming/student3.png`,
  },
  {
    name: '陳琨',
    rate: 5,
    reviews:
      '跟簡老師學習面相學，紫微斗數2年多，收獲頗豐。通過面相的學習看人識人更全面準確，對工作中面試用人有很大幫助。紫微斗數各門各派老師非常多，以前也有接觸，但跟簡老師學習之後才算真正學明白了，總而言之，跟著簡老師學習斗數真的不難，但也確實是要慢慢積累，在實踐中不斷驗證各種星系組合的事件表現。',
    photo: `https://static.kolable.com/images/haohaoming/student4.png`,
  },
]

const Reviews = () => (
  <StyledSection>
    <div className="container">
      <SectionTitle title="學生評價" subtitle="REVIEWS" />

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
        {students.map(student => (
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
