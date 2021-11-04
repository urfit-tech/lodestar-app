import Carousel from 'lodestar-app-element/src/components/common/Carousel'
import {
  CraftButton,
  CraftParagraph,
  CraftSection,
  CraftTitle,
} from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import { useHistory } from 'react-router-dom'

const CoverSection: React.VFC<{
  options: {
    coverInfos: {
      id: number
      srcDesktop: string
      srcMobile: string
      title: string
      subtitle: string
      buttonText: string
      link: string
      external: boolean
    }[]
    sectionHeight: { desktopHeight: string; mobileHeight: string }
  }
}> = ({ options }) => {
  const history = useHistory()

  return (
    <section>
      <Carousel dots infinite arrows={false} autoplay autoplaySpeed={5000} variant="cover">
        {options.coverInfos.map(v => (
          <CraftSection
            responsive={{
              desktop: {
                customStyle: {
                  backgroundImage: `url(${v.srcDesktop})`,
                },
              },
              mobile: {
                customStyle: {
                  backgroundImage: `url(${v.srcMobile})`,
                },
              },
            }}
          >
            <CraftTitle
              title={v.title}
              customStyle={{
                fontSize: 40,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#fff',
                margin: 0,
              }}
            />
            <CraftParagraph
              content={v.subtitle}
              customStyle={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'normal',
                lineHeight: 1.5,
                color: '#fff',
                margin: 0,
              }}
            />
            <CraftButton title={v.buttonText} link={v.link} />
          </CraftSection>
        ))}
      </Carousel>
    </section>
  )
}

export default CoverSection
