import Carousel from 'lodestar-app-element/src/components/Carousel'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

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
          <Carousel.Slide
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
            customStyle={{
              title: {
                fontSize: 40,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#fff',
                mt: 0,
                mr: 0,
                mb: 0,
                ml: 0,
              },
              paragraph: {
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'normal',
                lineHeight: 1.5,
                color: '#fff',
                mt: 0,
                mr: 0,
                mb: 0,
                ml: 0,
              },
            }}
          />
        ))}
      </Carousel>
    </section>
  )
}

export default CoverSection
