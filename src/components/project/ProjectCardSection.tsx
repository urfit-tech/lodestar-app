import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Carousel } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/index'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as ArrowRightIcon } from '../../images/arrow-right.svg'
import Responsive, { BREAK_POINT } from '../common/Responsive'
import ProgramContentTrialPlayer from '../program/ProgramContentTrialPlayer'

const StyledSection = styled.section`
  position: relative;

  > .container {
    position: relative;
    top: -80px;
    background-color: white;

    > .wrapper {
      padding: 80px 0 0 0;
    }
  }
`
const StyledHeader = styled.header`
  padding-bottom: 40px;

  h3 {
    width: 100%;
    max-width: 425px;
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.23px;
    text-align: center;
    margin: 0 auto;
    padding-bottom: 24px;

    span {
      display: inline-block;
    }
  }
  h4 {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
    text-align: center;
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding-bottom: 60px;

    h3 {
      max-width: 615px;
      font-size: 40px;
      line-height: 1.4;
      letter-spacing: 1px;
    }
  }
`
const StyledCarousel = styled(Carousel)`
  && .slick-dots {
    li {
      margin-left: 16px;

      button {
        width: 12px;
        height: 12px;
        background: #cdcdcd;
        border-radius: 50%;
        transition: transform 0.2s ease-in-out;
      }
    }
    li:first-child {
      margin-left: 0;
    }
    li.slick-active {
      button {
        width: 12px;
        transform: scale(1.25, 1.25);
        background: #ff5760;
      }
    }
  }

  && .slick-track {
    display: flex;
  }
`
const StyledSlide = styled.div`
  max-width: 100vw;
  padding: 4px 16px 64px;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 570px;
  }
`
const StyleCard = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  height: 248px;
  width: 198px;

  h5 {
    ${CommonTitleMixin}
  }
  p {
    margin-bottom: 0px;
    height: 60px;
    line-height: 1.24;
    letter-spacing: 0.4px;
    color: #9b9b9b;
    font-size: 14px;
    font-weight: 500;
  }

  @media (min-width: ${BREAK_POINT}px) {
    width: 24%;
    margin-bottom: 20px;
  }
`
const StyledCardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  justify-content: space-between;
  padding: 24px;
  height: 100%;
`
const TrialLink = styled(Button)`
  && {
    color: #ff5760;
    :hover {
      text-decoration: none;
    }
  }
`
const StyledModalContent = styled(ModalContent)`
  && {
    max-width: 57rem;
  }
`
const StyledModalHeader = styled(ModalHeader)`
  && {
    @media (min-width: ${BREAK_POINT}px) {
      padding: 2rem 3rem 0;
      color: var(--gray-darker);
      font-size: 28px;
      letter-spacing: 0.23px;
    }
  }
`
const StyledModalBody = styled(ModalBody)`
  && {
    font-weight: 500;
    @media (min-width: ${BREAK_POINT}px) {
      padding: 0.5rem 3rem 2rem;
      color: var(--gray-darker);
      line-height: 1.5;
      letter-spacing: 0.2px;
    }
  }
`

const ProjectCardSection: React.VFC<{
  items: {
    icon?: string
    title: string
    abstract: string
    description?: string
    programContentIds?: string[]
  }[]
  title: string
  subtitle: string
}> = ({ items, title, subtitle }) => {
  const [selectedItem, setSelectedItem] = useState<{
    title: string
    abstract: string
    description?: string
    contentIds?: string[]
    index: number
  } | null>(null)

  return (
    <StyledSection>
      <div className="container">
        <div className="wrapper">
          <StyledHeader>
            <h3>
              {title.split(';').map((text, idx) => (
                <span key={idx}>{text}</span>
              ))}
            </h3>
            <h4>{subtitle}</h4>
          </StyledHeader>

          <Responsive.Default>
            <StyledCarousel dots={true} draggable={true} slidesToShow={3} slidesToScroll={1} variableWidth={true}>
              {items.map(card => (
                <StyledSlide key={card.title}>
                  <StyleCard>
                    <StyledCardWrapper>
                      <img src={card.icon} alt="card icon" />
                      <div>
                        <h5>{card.title}</h5>
                        <p>{card.abstract}</p>
                        {card.programContentIds?.length ? (
                          <div className="align-self-stretch text-right">
                            <TrialLink
                              variant="link"
                              size="sm"
                              onClick={() =>
                                setSelectedItem({
                                  title: card.title,
                                  abstract: card.abstract,
                                  description: card.description,
                                  contentIds: card.programContentIds || [],
                                  index: 0,
                                })
                              }
                            >
                              <span className="mr-2">立即試看</span>
                              <Icon as={ArrowRightIcon} />
                            </TrialLink>
                          </div>
                        ) : null}
                      </div>
                    </StyledCardWrapper>
                  </StyleCard>
                </StyledSlide>
              ))}
            </StyledCarousel>
          </Responsive.Default>

          <Responsive.Desktop>
            <div className="container d-flex flex-row flex-wrap justify-content-between">
              {items.map(card => (
                <StyleCard key={card.title}>
                  <StyledCardWrapper>
                    <img src={card.icon} alt="card icon" />
                    <div>
                      <h5>{card.title}</h5>
                      <p>{card.abstract}</p>
                      {card.programContentIds?.length ? (
                        <div className="align-self-stretch text-right">
                          <TrialLink
                            variant="link"
                            size="sm"
                            onClick={() =>
                              setSelectedItem({
                                title: card.title,
                                abstract: card.abstract,
                                description: card.description,
                                contentIds: card.programContentIds || [],
                                index: 0,
                              })
                            }
                          >
                            <span className="mr-2">立即試看</span>
                            <Icon as={ArrowRightIcon} />
                          </TrialLink>
                        </div>
                      ) : null}
                    </div>
                  </StyledCardWrapper>
                </StyleCard>
              ))}
            </div>
          </Responsive.Desktop>
        </div>
      </div>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        <ModalOverlay />
        <StyledModalContent>
          <StyledModalHeader>{selectedItem?.title}</StyledModalHeader>
          <ModalCloseButton />
          <StyledModalBody>
            <div className="mb-2">{selectedItem?.abstract}</div>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: selectedItem?.description || '' }} />
            <div className="mb-2">—</div>

            {selectedItem?.contentIds?.[selectedItem.index] && (
              <ProgramContentTrialPlayer
                programContentId={selectedItem.contentIds[selectedItem.index]}
                onPrev={
                  selectedItem.index > 0
                    ? () =>
                        setSelectedItem({
                          ...selectedItem,
                          index: selectedItem.index - 1,
                        })
                    : undefined
                }
                onNext={
                  selectedItem.contentIds[selectedItem.index + 1]
                    ? () =>
                        setSelectedItem({
                          ...selectedItem,
                          index: selectedItem.index + 1,
                        })
                    : undefined
                }
              />
            )}
          </StyledModalBody>
        </StyledModalContent>
      </Modal>
    </StyledSection>
  )
}

export default ProjectCardSection
