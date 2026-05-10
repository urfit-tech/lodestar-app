import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useGetEbookTrialPercentage } from './ebook'

let mockQueryData: any

jest.mock('@apollo/client', () => ({
  gql: jest.fn((strings: TemplateStringsArray) => strings.join('')),
  useQuery: () => ({
    data: mockQueryData,
  }),
}))

describe('useGetEbookTrialPercentage', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
  })

  it('returns 0 when the program content has no ebook trial row', () => {
    mockQueryData = {
      program_content_ebook: [],
    }

    const Consumer = () => {
      const percentage = useGetEbookTrialPercentage('390559cb-037e-4f1f-b4d2-10490940f053')

      return <span>{percentage}</span>
    }

    act(() => {
      render(<Consumer />, container)
    })

    expect(container.textContent).toBe('0')
  })
})
