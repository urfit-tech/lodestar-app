import { Button } from 'antd'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { usePublishedProgramCollection } from '../../../hooks/program'
import ProgramCard from '../../program/ProgramCard'
import { SectionTitle } from './util'

const StyledSection = styled.section`
  position: relative;
  padding: 120px 0px 120px 0px;
  background-image: linear-gradient(to bottom, #fffcfd, #fff7f9);

  &::after {
    content: ' ';
    background-image: url(https://static.kolable.com/images/haohaoming/section2_BGIcon.png);
    background-size: 100% 100%;
    position: absolute;
    width: 168px;
    height: 306px;
    right: 0;
    bottom: -120px;
    z-index: 1;
    @media (max-width: 769px) {
      display: none;
    }
  }
`

const StyledButton = styled(Button)`
  margin-top: 56px;
  padding: 0 40px;
  border-color: ${props => props.theme['@text-color-secondary']};
  background: none;
  color: ${props => props.theme['@heading-color']};
`
const Courses: React.FC = () => {
  const history = useHistory()
  const { programs } = usePublishedProgramCollection({
    isPrivate: false,
    limit: 3,
  })

  return (
    <StyledSection>
      <div className="container">
        <SectionTitle title="最新課程" subtitle="HOT COURSES" className="text-center" />

        <div className="row">
          {programs.map(program => (
            <div key={program.id} className="col-12 col-lg-4 mb-3">
              <ProgramCard program={program} withMeta />
            </div>
          ))}
        </div>
        <div className="text-center">
          <StyledButton size="large" onClick={() => history.push('/programs')}>
            更多課程
          </StyledButton>
        </div>
      </div>
    </StyledSection>
  )
}

export default Courses
