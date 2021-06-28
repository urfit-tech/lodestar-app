import Carousel from 'lodestar-app-element/src/components/Carousel'
import React from 'react'
import styled from 'styled-components'
import { StyledSection } from '../../pages/AppPage'
import { BREAK_POINT } from '../common/Responsive'

type Info = {
  avatarSrc: string
  name: string
  title: string
  description: string
}

const StyledContainer = styled.div`
  margin: 0 auto 4rem;
  padding: 0 4rem;
  width: 100%;
  max-width: 1080px;
`

const SliderSection: React.FC<{
  options: {
    title?: string
    infos?: Info[]
  }
}> = ({ options: { title = '' } }) => {
  const infos = [
    {
      title: {
        before: '行銷',
        after: '設計實習',
      },
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/images/xuemi/storyAvatar1.png`,
      name: 'Letitia',
    },
    {
      title: {
        before: '行銷',
        after: '設計實習',
      },
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/images/xuemi/storyAvatar1.png`,
      name: 'Letitia',
    },
    {
      title: {
        before: '行銷',
        after: '設計實習',
      },
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/images/xuemi/storyAvatar1.png`,
      name: 'Letitia',
    },
    {
      title: {
        before: '行銷',
        after: '設計實習',
      },
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/images/xuemi/storyAvatar1.png`,
      name: 'Letitia',
    },
  ]

  return (
    <StyledSection>
      <header>{title}</header>
      <StyledContainer>
        <Carousel
          dots
          infinite
          arrows={false}
          autoplay
          autoplaySpeed={5000}
          slidesToShow={3}
          responsive={[
            {
              breakpoint: BREAK_POINT,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {infos.map(v => (
            <Carousel.DialogCard
              title={v.title}
              description={v.description}
              avatarSrc={v.imgSrc}
              name={v.name}
              customStyle={{
                card: {
                  bordered: true,
                  shadow: true,
                  mt: '20',
                  mb: '54',
                  mr: '20',
                  ml: '20',
                  pt: '40',
                  pb: '40',
                  pr: '40',
                  pl: '40',
                },
                title: {
                  textAlign: 'left',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#585858',
                  pt: '0',
                  pb: '0',
                  pr: '0',
                  pl: '0',
                },
                paragraph: {
                  textAlign: 'left',
                  fontSize: 16,
                  fontWeight: 'normal',
                  lineHeight: 1.7,
                  color: '#585858',
                  pt: '0',
                  pb: '0',
                  pr: '0',
                  pl: '0',
                },
              }}
            />
          ))}
        </Carousel>
      </StyledContainer>
    </StyledSection>
  )
}

export default SliderSection
