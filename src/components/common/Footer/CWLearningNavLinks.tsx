import React from 'react'
import styled from 'styled-components'
import { Icon } from '@chakra-ui/icons'
import { ReactComponent as FacebookIcon } from '../../../images/facebook-icon.svg'

const NavLinksContainer = styled.section`
  display: flex;
  max-width: 1024px;
  margin: auto;
  justify-content: space-between;
  flex-wrap: wrap;
`
const NavGroup = styled.ul`
  margin-top: 50px;
  @media screen and (max-width: 500px) {
    width: 100%;
    text-align: center;
  }
`
const LinksGroupTitle = styled.p`
  font-weight: 500;
  font-size: 16px;
`
const LinkGroup = styled.ol`
  display: flex;
  max-height: 160px;
  flex-direction: column;
  flex-wrap: wrap;
`
const NavLinksList = styled.li`
  margin: 15px 15px 0 0;
  list-style: none;
  font-size: 14px;
  & > a {
    corsor: pointer;
    transition: 0.2s;
    &:hover {
      color: #019D96;
      svg {
        background: #019D96;
      }
    }
    svg {
      margin: -2px 5px 0 0;
      background: #9b9b9b;
      color: #FFFFFF;
      transition: 0.2s;
    }
  }
`

export const CWLearningNavLinks: React.VFC = () => {
  const linksConfig = [
    {
      groupName: '課程',
      links: [
        { name: '線上課程', url: '/programs', icon: null },
        { name: '實體課程', url: '/activities', icon: null },
        { name: '套裝優惠', url: '/packages', icon: null },
        { name: '空中講堂', url: '/podcast-albums', icon: null },
        { name: '大師文選', url: '/blog', icon: null },
      ]
    },
    {
      groupName: '學習',
      links: [
        { name: '所有課程', url: '/programs', icon: null },
        { name: '管理領導', url: '/programs?active=5a7c757b-e007-498e-8c04-cca7edd0ff91', icon: null },
        { name: '創業開店', url: '/programs?active=5de14e33-201f-42c9-90ab-64577d56d029', icon: null },
        { name: '數位行銷', url: '/programs?active=75e9ece1-6cae-4df2-8961-0f000b7a6f4f', icon: null },
        { name: '職場心靈', url: '/programs?active=0bd24b77-29c9-4ca5-b0aa-35dd3da10570', icon: null },
        { name: '溝通表達', url: '/programs?active=8891dacc-a441-4e5b-945e-4c2322405552', icon: null },
        { name: '身心健康', url: '/programs?active=c16b9b29-45d0-4842-9977-467f9605edfb', icon: null },
        { name: '親職教育', url: '/programs?active=33185173-f877-451d-b013-4a04ea145c8c', icon: null },
      ]
    },
    {
      groupName: '服務',
      links: [
        { name: '關於天下學習', url: '/about', icon: null },
        { name: '兌換課程', url: '/settings/voucher', icon: null },
        { name: '企業方案', url: 'https://www.leadercampus.com.tw/', icon: null },
        { name: '使用者條款', url: '/terms', icon: null },
        { name: '隱私權政策', url: 'https://member.cwg.tw/privacy-policy', icon: null },
        { name: '會員服務條款', url: '/rules', icon: null },
        { name: '課程FAQ', url: '/faq', icon: null },
        { name: '加入我們', url: 'https://careers.cwg.tw/', icon: null },
      ]
    },
    {
      groupName: '社群',
      links: [
        { name: 'Facebook', url: 'https://www.facebook.com/cwlearning.com.tw', icon: FacebookIcon },
      ]
    },
  ]

  return (
    <div className="col-12">
      <NavLinksContainer>
        {
          linksConfig.map(item => {
            return (
              <NavGroup>
                <LinksGroupTitle>{item.groupName}</LinksGroupTitle>
                <LinkGroup>
                  {
                    item.links.map(link => {
                      return (
                        <NavLinksList>
                          <a href={link.url} target={link.url.includes('https') ? '_blank' : '_self'}>
                            {
                              link.icon &&
                              <Icon as={link.icon} />
                            }
                            {link.name}
                          </a>
                        </NavLinksList>
                      )
                    })
                  }
                </LinkGroup>
              </NavGroup>
            )
          })
        }
      </NavLinksContainer>
    </div>
  )
}

export default CWLearningNavLinks
