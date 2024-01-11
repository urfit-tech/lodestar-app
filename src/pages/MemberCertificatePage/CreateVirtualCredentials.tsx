import { render } from 'mustache'
import styled from 'styled-components'

type PropsTypes = {
  html: string
  templateVars: string
  certificateRef?: React.Ref<HTMLDivElement>
  scale: number
}

export const StyledCertificateCard = styled.div<{ scale: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 1200px;
  overflow: hidden;
  white-space: nowrap;
  transform: scale(${props => props.scale});
  transform-origin: top left;
`

export const VirtualCredentials: React.FC<PropsTypes> = ({ html, templateVars, certificateRef, scale }) => {
  function getIndex(html: string, label: string, index: number): number {
    return html.indexOf(label, index)
  }

  function getLabelStatus(label: string): {
    startLabel: string
    endLabel: string
  } {
    return { startLabel: `<${label}`, endLabel: `</${label}>` }
  }

  function replaceStr(str: string, index: number, char: string) {
    return str.substring(0, index) + char + str.substring(index + 1)
  }

  function autoHandleHTML(html: string, label: string) {
    let pre = 0
    let next = 0

    let { startLabel, endLabel } = getLabelStatus(label)
    // ignore initial label
    pre = getIndex(html, 'position: relative;', 0)

    pre = getIndex(html, startLabel, pre + 'position: relative;'.length)
    next = getIndex(html, `">`, pre + 'position: relative;'.length)
    html = replaceStr(html, next, 'margin-top: 3.8%;"')

    return html
  }

  const _html = autoHandleHTML(html, 'div')

  return (
    <StyledCertificateCard
      ref={certificateRef}
      scale={scale}
      dangerouslySetInnerHTML={{ __html: render(_html, templateVars) }}
    />
  )
}
