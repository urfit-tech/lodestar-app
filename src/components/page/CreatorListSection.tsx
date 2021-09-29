import { Skeleton } from 'antd'
import styled from 'styled-components'
import { usePublishedCreator } from '../../hooks/member'
import DefaultAvatar from '../../images/avatar.svg'
import { BREAK_POINT } from '../common/Responsive'

type TitleInfo = {
  title: string
  fontSize: string
  letterSpacing: string
  color: string
  fontWeight: string | number
  mobileMargin: string
  desktopMargin: string
}

type CreatorList = {
  id: string
  titleInfo: TitleInfo
}
const StyledSection = styled.div`
  padding: 80px 0 65px 0;
  background: #f7f8f8;
`
const StyledTitle = styled.div<Pick<CreatorList, 'titleInfo'>>`
  font-size: ${props => props.titleInfo?.fontSize || '1rem'};
  font-weight: ${props =>
    props.titleInfo?.fontWeight
      ? typeof props.titleInfo?.fontWeight === 'string'
        ? `${props.titleInfo?.fontWeight}`
        : props.titleInfo?.fontWeight
      : 500};
  color: ${props => props.titleInfo?.color || '#585858'};
  margin: ${props => props.titleInfo?.mobileMargin};
`
const StyledCreatorCardWrapper = styled.div`
  margin-bottom: 40px;
  flex: 0 0 50%;
  max-width: 50%;
  @media (min-width: ${BREAK_POINT}px) {
    flex: 0 0 20%;
    max-width: 20%;
  }
`
const StyledCreatorCard = styled.div<{ url: string }>`
  width: 120px;
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  background-image: ${props => props?.url && `url(${props.url})`};
  margin: auto;

  @media (min-width: 323px) {
    width: 150px;
    height: 150px;
  }
  @media (min-width: ${BREAK_POINT}px) {
    width: 175px;
    height: 175px;
  }
`
const StyledCreatorName = styled.div`
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.77px;
`
const StyledCreatorTitle = styled.div`
  font-size: 14px;
  letter-spacing: 0.18px;
  font-weight: 500;
`
const StyledCreatorAbstract = styled.div`
  color: #9b9b9b9b;
  font-size: 14px;
  letter-spacing: 0.4px;
  font-weight: 500;
`

const CreatorListSection: React.VFC<{ options: CreatorList & { excludeIds?: string[] } }> = ({
  options: { id, titleInfo, excludeIds },
}) => {
  const { loadingCreators, creators } = usePublishedCreator()

  if (loadingCreators)
    return (
      <div className="container">
        <Skeleton />
      </div>
    )

  return (
    <StyledSection id={id}>
      <StyledTitle className="d-flex justify-content-center" titleInfo={titleInfo}>
        {titleInfo?.title}
      </StyledTitle>
      <div className="container">
        <div className="row">
          {creators
            .filter(creator => !excludeIds?.includes(creator.id || ''))
            .map(v => (
              <StyledCreatorCardWrapper key={v.id} className="col-12">
                <StyledCreatorCard url={v.pictureUrl || DefaultAvatar}></StyledCreatorCard>
                <StyledCreatorName className="mt-2 text-left">{v.name || ''}</StyledCreatorName>
                <StyledCreatorTitle className="mb-3 text-left">{v.title || ''}</StyledCreatorTitle>
                <StyledCreatorAbstract className="text-left">{v.abstract || ''}</StyledCreatorAbstract>
              </StyledCreatorCardWrapper>
            ))}
        </div>
      </div>
    </StyledSection>
  )
}

export default CreatorListSection
