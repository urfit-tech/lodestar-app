import { Box, Button, Link, Stack } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { LodestarWindow } from 'lodestar-app-element/src/types/lodestar.window'
import React from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { desktopViewMixin } from '../../helpers'
import authMessages from './translation'

declare let window: LodestarWindow

const CenteredBox = styled.div`
  margin: 1rem;
  width: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);

  ${desktopViewMixin(
    css`
      width: calc(100% / 3);
    `,
  )}
`

const TOSModal: React.VFC<{ onConfirm?: () => void }> = ({ onConfirm }) => {
  const theme = useAppTheme()
  const { currentMemberId, currentMember } = useAuth()
  const { formatMessage } = useIntl()

  const handleClick = () => {
    axios
      .post(
        `${process.env.REACT_APP_KOLABLE_SERVER_ENDPOINT}/tos`,
        {
          email: window.lodestar.getCurrentMember()?.email || currentMember?.email,
          product: 'kolable',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .catch(
        error =>
          process.env.NODE_ENV === 'development' &&
          console.error(`can not post kolable-server tos api, error:${error}`),
      )
      .finally(() => {
        Cookies.set(
          'tos',
          JSON.stringify({
            memberId: currentMemberId,
            checkTime: new Date().getTime(),
          }),
          {
            expires: 1,
          },
        )
        onConfirm?.()
      })
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      backgroundColor="rgba(255, 255, 255, 0.6)"
      pos="absolute"
      zIndex="100"
    >
      <CenteredBox>
        <Box p="2.5rem 2rem" textAlign="center" color="#585858">
          <Box fontSize="18px" fontWeight="bold" letterSpacing="0.8px" color="#585858">
            {formatMessage(authMessages.TOSModal.title)}
          </Box>
          <Box m="1.25rem 0 2rem 0" fontSize="16px" letterSpacing="0.2px" lineHeight="24px" color="#585858">
            您將進入「天下學習MastetCheers」網站，此天下雜誌群帳號享有天下學習的會員服務（天下學習品牌下包含「天下學習MasterCheers」及「Cheers快樂工作人」），若想了解更多，請點此
            <Link
              href="https://member.cwg.tw/register-rule"
              isExternal
              color={theme.colors.primary[500]}
              textDecoration="underline"
            >
              連結
            </Link>
            。
          </Box>
          <Button
            w="100px"
            h="40px"
            cursor="pointer"
            color="#fff"
            borderRadius="4px"
            fontWeight="400"
            letterSpacing="0.2px"
            bg={theme.colors.primary[500]}
            _focus={{
              boxShadow: 'none',
              outline: 'none',
            }}
            onClick={handleClick}
            variant="primary"
          >
            {formatMessage(authMessages.TOSModal.confirm)}
          </Button>
        </Box>
      </CenteredBox>
    </Stack>
  )
}

export default TOSModal
