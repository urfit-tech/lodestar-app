import React from 'react'
import styled from 'styled-components'

type OnSaleIntroductionSectionProp = {
  introduction: string
}

const StyleSection = styled.section`
  .decoration {
    display: none;
  }

  .introduction {
    position: relative;
    background-color: #47293d;
  }

  .wrapper {
    color: white;
  }

  .feature {
    height: 260px;
    margin-bottom: 40px;
  }

  .feature h4 {
    width: 206px;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.2px;
    text-align: center;
    color: #ffffff;
  }

  .wrapper {
    padding: 80px 20px;
  }

  h3 span {
    display: block;
    text-align: center;
    color: #ffffff;
    font-size: 28px;
  }

  .slogan {
    position: relative;
    margin: 54px auto 64px;
    max-width: 359px;
    height: 50px;
    line-height: 50px;
    background-color: #ffc129;
    color: #47293d;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.77px;
    color: #47293d;
  }

  .arrow.left {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-left: 10px solid #47293d;
  }

  .arrow.right {
    position: absolute;
    top: 0;
    right: 0;
    height: 0;
    width: 0;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-right: 10px solid #47293d;
  }

  .button {
    display: none;
    margin: 0 auto;
    width: 177px;
    height: 44px;
    line-height: 44px;
    border-radius: 4px;
    background-color: #ff5760;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
  }

  .button:hover {
    cursor: pointer;
    text-decoration: none;
    color: #ffffff;
  }

  @media (min-width: 992px) {
    .introduction {
      display: flex;
      margin: 0;
      height: 1256px;
      align-items: center;
      overflow: hidden;
    }

    .decoration {
      display: block;
    }

    .decoration.left {
      position: absolute;
      bottom: 10px;
      left: 48px;
      width: 338px;
    }

    .decoration.right {
      position: absolute;
      bottom: 145px;
      right: -40px;
      width: 397px;
    }

    .feature {
      height: auto;
    }

    .feature img {
      margin-bottom: 20px;
    }

    .button {
      display: block;
    }

    h3 span {
      font-size: 40px;
    }
  }
`

const OnSaleIntroductionSection: React.FC<OnSaleIntroductionSectionProp> = ({ introduction }) => (
  <StyleSection>
    <div dangerouslySetInnerHTML={{ __html: introduction }} />
  </StyleSection>
)

export default OnSaleIntroductionSection
