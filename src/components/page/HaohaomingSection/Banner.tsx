import { Button, Rate } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Content } from './util'

const StyledSection = styled.section`
  padding: 120px 0;
  background-image: url(https://static.kolable.com/images/haohaoming/banner.png);
  background-size: cover;

  .content {
    margin-bottom: 32px;
    color: white;
    text-align: justify;
  }

  @media (max-width: 768px) {
    text-align: center;
    .content {
      text-align: center;
    }
  }
`

const Slogan = styled.div`
  position: relative;
  padding: 40px;
  color: white;
  font-size: 56px;
  line-height: 1.14;
  text-align: center;

  &::before {
    content: ' ';
    width: 40px;
    height: 40px;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    position: absolute;
    left: 0;
    top: 0;
  }

  &::after {
    content: ' ';
    width: 40px;
    height: 40px;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 32px;
    padding: 20px;
    .sub-title {
      font-size: 24px;
    }
  }
`

const RateBlock = styled.div`
  color: #fff;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const StyledButton = styled(Button)`
  padding: 10px 40px;

  &:hover {
    color: #eb527a;
    background-color: #ffffff;
  }
`

const StyledMask = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);

  & > div {
    width: 100%;
    max-width: 600px;
    height: 100vh;
    background-image: url(https://static.kolable.com/images/haohaoming/modal.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`

const Banner = () => {
  const [visible, setVisible] = useState(false)

  return (
    <StyledSection>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
            <Slogan>
              <div>97%用戶</div>
              <div className="sub-title">覺得測算很準</div>
            </Slogan>
          </div>

          <div className="col-12 col-md-6">
            <RateBlock className="d-flex align-items-center mb-2">
              <div className="mr-2">滿意度</div>
              <Rate allowHalf disabled defaultValue={5} />
            </RateBlock>
            <RateBlock className="d-flex align-items-center mb-4">
              <div className="mr-2">準確度</div>
              <Rate allowHalf disabled defaultValue={4.5} />
            </RateBlock>

            <Content className="content">
              <p>
                {'紫微斗數就是你的人生說明書'}
                <br />
                {
                  '摸索了生命很久，但還是充滿了迷惘，不知道自己的方向，不知道怎麼快樂，不知道怎麼成功，其實你只是 沒找到說明書，打開他，你就能獲得新生，迎向光明。'
                }
              </p>
            </Content>

            <StyledButton
              type="primary"
              onClick={() => {
                setVisible(!visible)
              }}
            >
              立即測算
            </StyledButton>

            {visible && (
              <StyledMask
                className="d-flex justify-content-center align-items-center"
                onClick={() => {
                  setVisible(false)
                }}
              >
                <div />
              </StyledMask>
            )}
          </div>
        </div>
      </div>
    </StyledSection>
  )
}

export default Banner
