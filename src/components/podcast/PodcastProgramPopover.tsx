import { Button, Icon } from '@chakra-ui/react'
import { Popover } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { BsPlus } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import CartContext from '../../contexts/CartContext'
import { durationFullFormatter } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { usePodcastPlanIds } from '../../hooks/podcast'
import { ReactComponent as MicrophoneIcon } from '../../images/microphone.svg'
import { Category } from '../../types/general'
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
  ${CommonTitleMixin}
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
  categories: Category[]
  instructor?: {
    id: string
    avatarUrl?: string | null
    name: string
  } | null
  isEnrolled?: boolean
  isSubscribed?: boolean
  onSubscribe?: () => void
  isIndividuallySale?: boolean
}
const PodcastProgramPopover: React.FC<
  PodcastProgramPopoverProps & {
    podcastProgramId: string
  }
> = ({
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
  isIndividuallySale,
  children,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const { settings } = useApp()
  const { podcastPlanIds } = usePodcastPlanIds(instructor?.id || '')

  const withPodcastPlan = podcastPlanIds.length > 0

  const handleClick = async () => {
    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
        content_name: title || podcastProgramId,
        value: listPrice,
        currency: 'TWD',
      })
    }

    if (settings['tracking.ga_id']) {
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
    }

    return await addCartProduct?.('PodcastProgram', podcastProgramId).catch(() => {})
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
            <Button
              colorScheme="primary"
              variant="ghost"
              size="sm"
              leftIcon={<BsPlus />}
              onClick={() => onSubscribe?.()}
            >
              {formatMessage(commonMessages.title.podcastSubscription)}
            </Button>
          )}
        </div>
      </div>

      <div>
        {isEnrolled ? (
          <Link to={`/podcasts/${podcastProgramId}?instructorId=${instructor?.id}`}>
            <Button variant="outline" isFullWidth>
              {formatMessage(commonMessages.button.enterPodcast)}
            </Button>
          </Link>
        ) : !isIndividuallySale ? null : isProductInCart && isProductInCart('PodcastProgram', podcastProgramId) ? (
          <Button colorScheme="primary" isFullWidth onClick={() => history.push(`/cart`)}>
            {formatMessage(commonMessages.button.cart)}
          </Button>
        ) : (
          <>
            <Button
              colorScheme="primary"
              className="mb-2"
              isFullWidth
              onClick={() => handleClick().then(() => history.push(`/cart`))}
            >
              {formatMessage(commonMessages.ui.purchase)}
            </Button>
            <Button variant="outline" isFullWidth onClick={() => handleClick()}>
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
