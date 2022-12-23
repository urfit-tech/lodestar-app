import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/'
import { defineMessages } from 'react-intl'
import styled, { css } from 'styled-components'
import { desktopViewMixin } from '../../helpers'

export const messages = defineMessages({
  latest: { id: 'blog.label.latest', defaultMessage: '最新' },
  popular: { id: 'blog.label.popular', defaultMessage: '熱門' },
  relative: { id: 'blog.label.relative', defaultMessage: '相關文章' },
})

export const StyledTitle = styled.h1`
  margin-bottom: 1rem;
  ${CommonTitleMixin}
`
export const StyledPostTitle = styled.div<{ rows?: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${props => props.rows || 1};
  margin-bottom: 0.75rem;
  overflow: hidden;
  width: 100%;
  height: calc(${props => props.rows || 1} * 1.5em);
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;

  &.headline,
  &.featuring {
    color: white;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.77px;
  }
  &.list-item {
    -webkit-line-clamp: 2;
    font-size: 16px;
    font-weight: bold;
  }

  ${desktopViewMixin(css`
    font-weight: bold;

    &.headline {
      font-size: 20px;
      font-weight: bold;
    }
    &.featuring {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    &.list-item {
      // -webkit-line-clamp: 1;
      min-height: 1.5em;
      font-size: 20px;
    }
  `)}
`
export const StyledPostMeta = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;

  i,
  span {
    line-height: 20px;
  }

  ${desktopViewMixin(css`
    > div {
      display: inline;
    }
  `)}
`
