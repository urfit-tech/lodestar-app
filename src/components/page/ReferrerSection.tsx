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
  padding: 0 1.5rem;
  width: 100%;
  max-width: 1080px;
`

const ReferrerSection: React.FC<{
  options: {
    title?: string
    infos?: Info[]
  }
}> = ({ options: { title = '' } }) => {
  const infos = [
    {
      title: '行銷',
      name: 'Letitia',
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/avatars/demo/793733e7-c270-4db1-ae71-562984265429`,
    },
    {
      title: '行銷',
      name: 'Letitia',
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/avatars/demo/793733e7-c270-4db1-ae71-562984265429`,
    },
    {
      title: '行銷',
      name: 'Letitia',
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/avatars/demo/793733e7-c270-4db1-ae71-562984265429`,
    },
    {
      title: '行銷',
      name: 'Letitia',
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/avatars/demo/793733e7-c270-4db1-ae71-562984265429`,
    },
    {
      title: '行銷',
      name: 'Letitia',
      description:
        '本身非本科生，但目前有在業界從事網頁設計實習工作。對於網頁的知識和技能都是靠高中補習遙遠的記憶和零散的自學，但一直沒有融會貫通的感覺，每個功能都只是似懂非懂，搞不太清楚“為什麼要這樣做”，無法全靠自己刻出一個完整的頁面。',
      imgSrc: `https://static.kolable.com/avatars/demo/793733e7-c270-4db1-ae71-562984265429`,
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
            <Carousel.ReferrerCard
              title={v.title}
              name={v.name}
              description={v.description}
              avatarSrc={v.imgSrc}
              customStyle={{
                card: {
                  bordered: false,
                  shadow: false,
                  mt: '0',
                  mb: '20',
                  mr: '44',
                  ml: '44',
                  pt: '0',
                  pb: '0',
                  pr: '0',
                  pl: '0',
                },
                title: {
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#585858',
                  mt: '0',
                  mb: '0',
                  mr: '0',
                  ml: '0',
                },
                paragraph: {
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 'normal',
                  lineHeight: 1.57,
                  color: '#585858',
                  mt: '0',
                  mb: '0',
                  mr: '0',
                  ml: '0',
                },
              }}
            />
          ))}
        </Carousel>
      </StyledContainer>
    </StyledSection>
  )
}

export default ReferrerSection
