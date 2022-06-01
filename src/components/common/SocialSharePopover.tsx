import { Icon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { Popover } from 'antd'
import { useState } from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import { BsShareFill } from 'react-icons/bs'
import { FacebookIcon, FacebookShareButton, LineIcon, LineShareButton } from 'react-share'
import styled from 'styled-components'

const StyledIconButton = styled(IconButton)`
  border: 1px solid var(--gray-light);
  border-radius: 50% !important;
  background: white;
`

const StyledPopperContent = styled.div`
  padding: 11px 12px;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
`

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
    if (window.navigator.userAgent) {
      const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent,
      )
      if (isMobile) {
        try {
          await window.navigator.share(shareData)
        } catch (e) {
          console.error(e)
          setVisible(newVisible)
        }
      } else {
        setVisible(newVisible)
      }
    }
  }
  const handleCopyLink = () => {
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(url)
    }
  }
  const ShareButtons = (
    <StyledPopperContent>
      <FacebookShareButton url={url}>
        <FacebookIcon size={size} round={round} />
      </FacebookShareButton>
      <LineShareButton url={url}>
        <LineIcon size={size} round={round} />
      </LineShareButton>
      <Icon as={AiOutlineLink} boxSize={size + 'px'} onClick={handleCopyLink} className="cursor-pointer" />
    </StyledPopperContent>
  )

  return (
    <Popover
      content={ShareButtons}
      placement="bottom"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleOnChange}
    >
      <StyledIconButton variant="ghost" icon={<Icon as={BsShareFill} color="#4c5b8f" />} className="mr-2" />
    </Popover>
  )
}
export default SocialSharePopover
