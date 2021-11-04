import { CraftCarousel } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Slide } from './CustomCoverSection'

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
    sectionHeight?: { desktopHeight?: string; mobileHeight?: string }
  }
}> = ({ options }) => {
  const history = useHistory()

  return (
    <section>
      <CraftCarousel
        dots
        infinite
        arrows={false}
        autoplay
        autoplaySpeed={5000}
        variant="cover"
        customStyle={{
          height: options.sectionHeight?.mobileHeight,
        }}
        // FIXME: Carousel props
        responsive={
          {
            desktop: {
              customStyle: {
                height: options.sectionHeight?.desktopHeight,
              },
            },
          } as any
        }
      >
        {options.coverInfos.map(v => (
          <Slide
            srcDesktop={v.srcDesktop}
            srcMobile={v.srcMobile}
            title={v.title}
            subtitle={v.subtitle}
            buttonText={v.link && v.buttonText ? <Link to={v.link}>{v.buttonText}</Link> : undefined}
            onClick={() => {
              if (v.buttonText) {
                return
              }
              if (!v.link) return
              v.external ? window.open(v.link) : history.push(v.link)
            }}
            sectionHeight={options.sectionHeight}
          />
        ))}
      </CraftCarousel>
    </section>
  )
}

export default CoverSection
