import React from 'react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import styled from 'styled-components'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'

const BlockContainer = styled.section`
  width: 100%;
  padding: 24px;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  background: #9babad;
  border-radius: 4px;
`
const BlockText = styled.p`
  color: #FFFFFF;
  text-align: center;
  font-weight: 500;
  font-size: 17px;
`
const Button = styled.button`
  display: block;
  height: 42px;
  width: 96px;
  margin: 10px auto 0 auto;
  background: #019D96;
  color: #FFFFFF;
  border-radius: 42px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #09a9a1;
  }
`

const ClassCouponBlock: React.VFC = () => {
  const { currentMemberId } = useAuth()
  const { settings } = useApp()
  const handleClick = () => {
    if (settings['auth.parenting.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(JSON.stringify({ provider: 'parenting', redirect: window.location.pathname }))
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/parenting`)
      const oauthLink = `https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id=${settings['auth.parenting.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=`
      window.location.assign(oauthLink)
    } else if (settings['auth.cw.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(JSON.stringify({ provider: 'cw', redirect: window.location.pathname }))
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/cw`)
      const endpoint = settings[`auth.cw.endpoint`] || 'https://dev-account.cwg.tw'
      const oauthLink = `${endpoint}/oauth/v1.0/authorize?response_type=code&client_id=${settings['auth.cw.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=social`
      window.location.assign(oauthLink)
    }
  }

  return (
    <>
      {
        !currentMemberId ?
        <BlockContainer>
          <BlockText>立即註冊，領線上課程$200購課金、看百堂免費課</BlockText>
          <Button onClick={() => handleClick()}>立即註冊</Button>
        </BlockContainer> :
        <></>
      }
    </>
  )
}

export default ClassCouponBlock
