import { Icon } from '@chakra-ui/icons'
import { Button, Popover } from 'antd'
import React, { useContext } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import CartContext from '../../contexts/CartContext'
import { durationFullFormatter } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { usePodcastPlanIds } from '../../hooks/podcast'
import { ReactComponent as MicrophoneIcon } from '../../images/microphone.svg'
import { AvatarImage } from '../common/Image'
import Responsive, { BREAK_POINT } from '../common/Responsive'

const StyledWrapper = styled.div`
  padding: 1.25rem;
  width: 100vw;
  max-width: 272px;
  max-height: 70vh;
  overflow: auto;
  background-color: white;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 320px;
  }
`
const StyledTitle = styled.div`
  margin-bottom: 0.75rem;
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`
const StyledMeta = styled.div`
  margin-bottom: 0.75rem;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledCategory = styled.div`
  margin-bottom: 0.75rem;
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledDescription = styled.div`
  margin-bottom: 0.75rem;
  color: var(--gray-darker);
  font-size: 14px;
  letter-spacing: 0.4px;
`

export type PodcastProgramPopoverProps = {
  title: string
  duration: number
  durationSecond: number
  listPrice: number
  salePrice: number | null
  description?: string | null
  categories: {
    id: string
    name: string
  }[]
  instructor?: {
    id: string
    avatarUrl?: string | null
    name: string
  } | null
  isEnrolled?: boolean
  isSubscribed?: boolean
  onSubscribe?: () => void
}
const PodcastProgramPopover: React.FC<PodcastProgramPopoverProps & { podcastProgramId: string }> = ({
  podcastProgramId,
  title,
  duration,
  durationSecond,
  listPrice,
  salePrice,
  description,
  categories,
  instructor,
  isEnrolled,
  isSubscribed,
  onSubscribe,
  children,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const { podcastPlanIds } = usePodcastPlanIds(instructor?.id || '')

  const withPodcastPlan = podcastPlanIds.length > 0

  const onClickAddCartProduct = () => {
    return new Promise(async (resolve, reject) => {
      try {
        addCartProduct && (await addCartProduct('PodcastProgram', podcastProgramId))
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: podcastProgramId,
          name: title,
          category: 'PodcastProgram',
          price: `${listPrice}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'setAction', 'add')
        ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  const content = (
    <StyledWrapper>
      <StyledTitle>{title}</StyledTitle>
      <StyledMeta>
        <Icon as={MicrophoneIcon} className="mr-2" />
        <span>{durationFullFormatter(durationSecond)}</span>
      </StyledMeta>
      <StyledDescription>{description}</StyledDescription>
      <StyledCategory className="mb-4">
        {categories.map(category => (
          <span key={category.id} className="mr-2">
            #{category.name}
          </span>
        ))}
      </StyledCategory>

      <div className="d-flex align-items-center justify-content-between mb-3">
        {instructor && (
          <Link to={`/creators/${instructor.id}?tabkey=podcasts`} className="d-flex align-items-center">
            <AvatarImage className="mr-2" src={instructor.avatarUrl} size={36} />
            <StyledMeta className="m-0">{instructor.name}</StyledMeta>
          </Link>
        )}
        <div className="flex-grow-1 text-right">
          {withPodcastPlan && !isSubscribed && (
            <Button type="link" icon="plus" size="small" onClick={() => onSubscribe && onSubscribe()}>
              {formatMessage(commonMessages.title.podcastSubscription)}
            </Button>
          )}
        </div>
      </div>

      <div>
        {isEnrolled ? (
          <Link to={`/podcasts/${podcastProgramId}`}>
            <Button block>{formatMessage(commonMessages.button.enterPodcast)}</Button>
          </Link>
        ) : isProductInCart && isProductInCart('PodcastProgram', podcastProgramId) ? (
          <Button type="primary" onClick={() => history.push(`/cart`)} block>
            {formatMessage(commonMessages.button.cart)}
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              className="mb-2"
              block
              onClick={() => {
                onClickAddCartProduct().then(() => history.push(`/cart`))
              }}
            >
              {formatMessage(commonMessages.button.purchase)}
            </Button>
            <Button
              onClick={() => {
                onClickAddCartProduct()
              }}
              block
            >
              {formatMessage(commonMessages.button.addCart)}
            </Button>
          </>
        )}
      </div>
    </StyledWrapper>
  )

  return (
    <>
      <Responsive.Default>
        <Popover placement="bottomRight" trigger="click" content={content}>
          <div className="cursor-pointer">{children}</div>
        </Popover>
      </Responsive.Default>
      <Responsive.Desktop>
        <Popover placement="right" trigger="click" content={content}>
          <div className="cursor-pointer">{children}</div>
        </Popover>
      </Responsive.Desktop>
    </>
  )
}

export default PodcastProgramPopover
