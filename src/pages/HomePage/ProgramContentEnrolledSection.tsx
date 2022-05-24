import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'
import ProgramContentCard from './ProgramContentCard'

const StyledWelcome = styled.h3`
  font-weight: 500;
  font-size: 20px;
  color: #585858;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 28px;
  }
`

const ProgramContentEnrolledSection: React.FC<{
  programContents: Array<{
    programId: string
    id: string
    title: string
    coverUrl: string | null
    type: 'video' | 'text' | null
    duration: number
    progress: number
    role: {
      name: string
      pictureUrl: string
    }
  }>
}> = ({ programContents }) => {
  const { currentMemberId, currentMember } = useAuth()
  return (
    <section>
      <div className="container">
        <div className="d-flex justify-content-between">
          {<StyledWelcome className="mb-4">{currentMember?.name} 歡迎回來</StyledWelcome>}
          <Link to={`/members/${currentMemberId}`}>我的主頁</Link>
        </div>
        <div className="row">
          {programContents.map(programContent => (
            <div key={programContent.id} className="col-12 col-lg-6 mb-4">
              <Link to={`/programs/${programContent.programId}/contents/${programContent.id}`}>
                <ProgramContentCard
                  title={programContent.title}
                  coverUrl={programContent.coverUrl}
                  type={programContent.type}
                  duration={programContent.duration}
                  progress={programContent.progress}
                  role={programContent.role}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProgramContentEnrolledSection
