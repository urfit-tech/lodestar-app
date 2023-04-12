import { useQuery } from '@apollo/client'
import { Icon, SkeletonText } from '@chakra-ui/react'
import { Tag } from 'antd'
import gql from 'graphql-tag'
import styled from 'styled-components'
import hasura from '../../hasura'
import { ReactComponent as AngleThinLeftIcon } from '../../images/angle-thin-left.svg'
import { ReactComponent as AngleThinRightIcon } from '../../images/angle-thin-right.svg'
import { BREAK_POINT } from '../common/Responsive'
import ProgramContentPlayer from './ProgramContentPlayer'

const StyledPlayerWrapper = styled.div`
  position: relative;

  > svg:first-child,
  > svg:last-child {
    top: 50%;
    font-size: 24px;
    position: absolute;
    cursor: pointer;
  }

  > svg:first-child {
    left: 0;
    transform: translate(-100%, -50%);
  }
  > svg:last-child {
    right: 0;
    transform: translate(100%, -50%);
  }

  @media (min-width: ${BREAK_POINT}px) {
    > svg:first-child,
    > svg:last-child {
      font-size: 48px;
    }
  }
`

const StyledVideoTitle = styled.span`
  color: var(--gray-darker);
  font-weight: bold;
  letter-spacing: 0.2px;
`

const ProgramContentTrialPlayer: React.VFC<{
  programContentId: string
  onPrev?: () => void
  onNext?: () => void
}> = ({ programContentId, onPrev, onNext }) => {
  const { data } = useQuery<hasura.GET_PROGRAM_CONTENT_TRIAL, hasura.GET_PROGRAM_CONTENT_TRIALVariables>(
    gql`
      query GET_PROGRAM_CONTENT_TRIAL($programContentId: uuid!) {
        program_content_by_pk(id: $programContentId) {
          id
          title
          program_content_section {
            id
            program {
              id
              title
            }
          }
          program_content_body {
            id
            data
          }
        }
      }
    `,
    { variables: { programContentId } },
  )

  if (!data || !data.program_content_by_pk) {
    return <SkeletonText noOfLines={4} spacing="4" />
  }

  return (
    <>
      <div className="mb-3">
        <Tag color="#585858" className="mr-2">
          試看
        </Tag>
        <StyledVideoTitle>
          {data.program_content_by_pk.program_content_section.program.title} - {data.program_content_by_pk.title}
        </StyledVideoTitle>
      </div>

      <StyledPlayerWrapper className="text-center">
        {onPrev && <Icon as={AngleThinLeftIcon} onClick={() => onPrev()} />}
        <ProgramContentPlayer programContentId={programContentId} />
        {onNext && <Icon as={AngleThinRightIcon} onClick={() => onNext()} />}
      </StyledPlayerWrapper>
    </>
  )
}

export default ProgramContentTrialPlayer
