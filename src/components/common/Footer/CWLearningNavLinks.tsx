import { Icon } from '@chakra-ui/icons'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import styled from 'styled-components'
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
  font-weight: 400;
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
      color: #019d96;
      svg {
        background: #019d96;
      }
    }
    svg {
      margin: -2px 5px 0 0;
      background: #9b9b9b;
      color: #ffffff;
      transition: 0.2s;
    }
  }
  @media screen and (max-width: 500px) {
    margin: 15px 0 0 0;
  }
`

interface footerLink {
  name: string
  url: string
  icon?: any
}

export const CWLearningNavLinks: React.VFC = () => {
  const { isAuthenticated } = useAuth()
  const { settings, navs } = useApp()

  /** 取得登入/註冊連結 */
  const getOauthLink = () => {
    let oauthLink = ''

    if (settings['auth.parenting.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(JSON.stringify({ provider: 'parenting', redirect: window.location.pathname }))
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/parenting`)
      oauthLink = `https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id=${settings['auth.parenting.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=`
    } else if (settings['auth.cw.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(JSON.stringify({ provider: 'cw', redirect: window.location.pathname }))
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/cw`)
      const endpoint = settings[`auth.cw.endpoint`] || 'https://dev-account.cwg.tw'
      oauthLink = `${endpoint}/oauth/v1.0/authorize?response_type=code&client_id=${settings['auth.cw.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=social`
    }
    return oauthLink
  }

  /** 登入/註冊連結 */
  const oauthLink = getOauthLink()

  /** 取得連結設定 */
  const getLinksConfig = () => {
    const footerNavs = navs.filter(nav => nav.block === 'footer')
    const linksconfig = footerNavs.map(footerNav => {
      const config = {
        groupName: footerNav.label,
        links: footerNav.subNavs.map(subNav => {
          const linkConfig: footerLink = { name: subNav.label, url: subNav.href }

          if (subNav.href.includes('facebook')) {
            linkConfig.icon = FacebookIcon
          }
          if (subNav.label === '江振誠') {
            return
          }
          if (subNav.label === '兌換課程') {
            linkConfig.url = isAuthenticated ? subNav.href : oauthLink
          }
          return linkConfig
        }),
      }
      return config
    })
    return linksconfig
  }

  const linksConfig = getLinksConfig()

  // const linksConfig: { groupName: string; links: footerLink[] }[] = [
  //   {
  //     groupName: '課程',
  //     links: [
  //       { name: '線上課程', url: '/programs' },
  //       { name: '實體課程', url: '/activities' },
  //       { name: '套裝優惠', url: '/packages' },
  //       { name: '空中講堂', url: '/podcast-albums' },
  //       { name: '大師文選', url: '/blog' },
  //     ],
  //   },
  //   {
  //     groupName: '學習',
  //     links: getProgramsLinks(),
  //   },
  //   {
  //     groupName: '服務',
  //     links: [
  //       { name: '關於天下學習', url: '/about' },
  //       { name: '兌換課程', url: isAuthenticated ? '/settings/voucher' : oauthLink },
  //       { name: '企業方案', url: 'https://www.leadercampus.com.tw/' },
  //       { name: '使用者條款', url: '/terms' },
  //       { name: '隱私權政策', url: 'https://member.cwg.tw/privacy-policy' },
  //       { name: '會員服務條款', url: '/rules' },
  //       { name: '課程FAQ', url: '/faq' },
  //       { name: '加入我們', url: 'https://careers.cwg.tw/' },
  //     ],
  //   },
  //   {
  //     groupName: '社群',
  //     links: [{ name: 'Facebook', url: 'https://www.facebook.com/cwlearning.com.tw', icon: FacebookIcon }],
  //   },
  // ]

  return (
    <div className="col-12">
      <NavLinksContainer>
        {linksConfig.map(item => {
          return (
            <NavGroup>
              <LinksGroupTitle>{item.groupName}</LinksGroupTitle>
              <LinkGroup>
                {item.links.map(link => {
                  return (
                    <>
                      {link ? (
                        <NavLinksList>
                          <a href={link.url} target={link.url.includes('https') ? '_blank' : '_self'}>
                            {link.icon && <Icon as={link.icon} />}
                            {link.name}
                          </a>
                        </NavLinksList>
                      ) : (
                        <></>
                      )}
                    </>
                  )
                })}
              </LinkGroup>
            </NavGroup>
          )
        })}
      </NavLinksContainer>
    </div>
  )
}

export default CWLearningNavLinks
