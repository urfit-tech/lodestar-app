import { Icon } from '@chakra-ui/icons'
import { Popover } from 'antd'
import { useState } from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import { BsShareFill } from 'react-icons/bs'
import {
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from 'react-share'

const SocialSharePopover: React.VFC<{ url: string }> = ({ url }) => {
  const [visible, setVisible] = useState(false)
  const size = 37
  const round = true
  const shareData = {
    title: '',
    text: '',
    url,
  }
  const handleVisibleOnChange = async (newVisible: boolean) => {
    if (window.navigator.share) {
      try {
        await window.navigator.share(shareData)
      } catch (e) {
        console.error(e)
      }
    } else {
      setVisible(newVisible)
    }
  }
  const ShareButtons = (
    <>
      <Icon as={AiOutlineLink} boxSize={size + 'px'} />
      <FacebookShareButton url={url}>
        <FacebookIcon size={size} round={round} />
      </FacebookShareButton>
      <LineShareButton url={url}>
        <LineIcon size={size} round={round} />
      </LineShareButton>
      <RedditShareButton url={url}>
        <RedditIcon size={size} round={round} />
      </RedditShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon size={size} round={round} />
      </TelegramShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size={size} round={round} />
      </TwitterShareButton>
    </>
  )
  return (
    <>
      <Popover
        content={ShareButtons}
        placement="bottomLeft"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleOnChange}
      >
        <Icon as={BsShareFill} style={{ cursor: 'pointer' }} />
      </Popover>
    </>
  )
}
export default SocialSharePopover
