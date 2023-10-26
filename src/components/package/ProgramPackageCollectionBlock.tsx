import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SkeletonText,
  Text,
  useRadioGroup,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { Fragment, useState } from 'react'
import { BiSearch, BiSort } from 'react-icons/bi'
import { FiGrid, FiList } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import { commonMessages, productMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageEnrollment } from '../../types/programPackage'
import RadioCard from '../RadioCard'

const StyledCard = styled.div<{ view?: string }>`
  ${props =>
    props.view === 'List' &&
    `
    display:flex;
    align-items:center;
  `}
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`

const StyledDescription = styled.div<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${props =>
    props.view === 'List' &&
    `
    margin-top:4px;
  `}
  font-size: 12px;
  color: var(--gray-dark);
  letter-spacing: 0.4px;
`

const StyledMeta = styled.div<{ view?: string }>`
  ${props =>
    props.view === 'List'
      ? `
      width:80%;
      `
      : `padding: 1.25rem;`}
`

const StyledTitle = styled.div<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${CommonTitleMixin}
  ${props =>
    props.view === 'List'
      ? `
      margin-bottom:0px;
      display:block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      `
      : `
      margin-bottom: 1.25rem;
      height: 3rem;
      `}
`

const StyledSelect = styled(Select)`
  padding-left: 35px !important;
`

const ProgramTab = ({ onProgramTabClick, tab }: { onProgramTabClick: (tab: string) => void; tab: string }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Flex cursor="pointer">
        <HStack spacing="10px">
          <Text
            fontSize="2xl"
            as="b"
            onClick={() => onProgramTabClick('program')}
            color={tab === 'program' ? 'black' : '#cdcdcd'}
          >
            {formatMessage(productMessages.program.title.course)}
          </Text>
          <Center height="20px">
            <Divider orientation="vertical" />
          </Center>
          <Text
            fontSize="2xl"
            as="b"
            onClick={() => onProgramTabClick('programPackage')}
            color={tab === 'programPackage' ? 'black' : '#cdcdcd'}
          >
            {formatMessage(commonMessages.ui.packages)}
          </Text>
        </HStack>
      </Flex>
    </>
  )
}

const ProgramPackageCollectionBlock: React.VFC<{
  onProgramTabClick: (tab: string) => void
  programTab: string
  programPackageEnrollment: ProgramPackageEnrollment[]
  expiredProgramPackageEnrollment: ProgramPackageEnrollment[]
  loading: boolean
  isError: boolean
}> = ({
  programTab,
  onProgramTabClick,
  programPackageEnrollment,
  expiredProgramPackageEnrollment,
  loading,
  isError,
}) => {
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [isExpired, setIsExpired] = useState(false)
  const localStorageView = localStorage.getItem('programPackageView')
  const [view, setView] = useState(localStorageView ? localStorageView : 'Grid')
  const [sort, setSort] = useState('newPurchaseDate')
  const [search, setSearch] = useState('')
  const programPackage = (isExpired ? expiredProgramPackageEnrollment : programPackageEnrollment)
    .sort((a, b) => {
      if (sort === 'newPurchaseDate') {
        return +new Date(b.deliveredAt || 0) - +new Date(a.deliveredAt || 0)
      }
      if (sort === 'oldPurchaseDate') {
        return +new Date(a.deliveredAt || 0) - +new Date(b.deliveredAt || 0)
      }
      if (sort === 'newLastViewDate') {
        return +new Date(b.lastViewedAt || 0) - +new Date(a.lastViewedAt || 0)
      }
      if (sort === 'oldLastViewDate') {
        return +new Date(a.lastViewedAt || 0) - +new Date(b.lastViewedAt || 0)
      }
      return 0
    })
    .filter(programPackage => {
      if (search !== '') {
        return programPackage.title.includes(search)
      }
      return true
    })

  const options = [
    formatMessage(commonMessages.label.availableForLimitTime),
    formatMessage(commonMessages.label.isExpired),
  ]

  const { getRadioProps } = useRadioGroup({
    name: 'isExpired',
    defaultValue: formatMessage(commonMessages.label.availableForLimitTime),
    onChange: v => {
      if (v === formatMessage(commonMessages.label.isExpired)) {
        setIsExpired(true)
      } else {
        setIsExpired(false)
      }
    },
  })

  if (loading) {
    return (
      <div className="container py-3">
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container py-3">
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <div>{formatMessage(commonMessages.status.readingError)}</div>
      </div>
    )
  }

  return (
    <div className="container py-3">
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignContent="center"
        marginBottom="1rem"
      >
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <HStack marginTop={{ base: '1rem', md: '0px' }} justifyContent={{ base: 'space-between', md: 'normal' }}>
          <Flex marginRight="20px" cursor="pointer">
            {
              <HStack
                spacing="5px"
                onClick={() => {
                  setView(view === 'Grid' ? 'List' : 'Grid')
                  localStorage.setItem('programPackageView', view === 'Grid' ? 'List' : 'Grid')
                }}
              >
                {view === 'Grid' && (
                  <>
                    <FiList />
                    <span>{formatMessage(commonMessages.term.list)}</span>
                  </>
                )}
                {view === 'List' && (
                  <>
                    <FiGrid />
                    <span>{formatMessage(commonMessages.term.grid)}</span>
                  </>
                )}
              </HStack>
            }
          </Flex>
          {settings['feature.expired_program_package_plan.enable'] === '1' &&
            expiredProgramPackageEnrollment.length > 0 && (
              <HStack spacing="12px">
                {options.map(value => {
                  const radio = getRadioProps({ value })
                  return (
                    <RadioCard key={value} {...radio} size="md">
                      {value}
                    </RadioCard>
                  )
                })}
              </HStack>
            )}
        </HStack>
      </Box>

      <HStack justifyContent={'space-between'} marginBottom="32px">
        <HStack spacing="12px">
          <InputGroup>
            <InputLeftElement>
              <BiSort />
            </InputLeftElement>
            <StyledSelect
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSort(event.target.value)}
              defaultValue={sort}
            >
              <option value="newPurchaseDate">購買日期（新到舊）</option>
              <option value="oldPurchaseDate">購買日期（舊到新）</option>
              <option value="newLastViewDate">最後觀課日（新到舊）</option>
              <option value="oldLastViewDate">最後觀課日（舊到新）</option>
            </StyledSelect>
          </InputGroup>
        </HStack>
        <Box>
          <InputGroup>
            <Input
              placeholder="搜尋關鍵字"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            />
            <InputRightElement>
              <BiSearch />
            </InputRightElement>
          </InputGroup>
        </Box>
      </HStack>

      {programPackage.length === 0 && <div>{formatMessage(commonMessages.content.noProgramPackage)}</div>}

      <div className="row">
        {programPackage.map(programPackage => (
          <Fragment key={programPackage.id}>
            {view === 'Grid' && (
              <Box className="col-12 col-md-6 col-lg-4 mb-4" opacity={isExpired ? '50%' : '100%'}>
                <Link
                  to={
                    isExpired
                      ? `/program-packages/${programPackage.id}`
                      : `/program-packages/${programPackage.id}/contents?memberId=${currentMemberId}`
                  }
                >
                  <StyledCard>
                    <CustomRatioImage
                      width="100%"
                      ratio={9 / 16}
                      src={programPackage.coverUrl || EmptyCover}
                      shape="rounded"
                    />
                    <StyledMeta>
                      <StyledTitle>{programPackage.title}</StyledTitle>
                      {settings['program.datetime.enabled'] === '1' && (
                        <StyledDescription>
                          {`${dayjs(programPackage.deliveredAt).format('YYYY-MM-DD')} 購買`}
                          {programPackage.lastViewedAt
                            ? ` / ${dayjs(programPackage.lastViewedAt).format('YYYY-MM-DD')} 上次觀看`
                            : ` / 尚未觀看`}
                        </StyledDescription>
                      )}
                    </StyledMeta>
                  </StyledCard>
                </Link>
              </Box>
            )}
            {view === 'List' && (
              <Box display="flex" width="100%" marginBottom="12px" opacity={isExpired ? '50%' : '100%'}>
                <Box width="100%">
                  <Link
                    to={
                      isExpired
                        ? `/program-packages/${programPackage.id}`
                        : `/program-packages/${programPackage.id}/contents?memberId=${currentMemberId}`
                    }
                  >
                    <StyledCard view={view}>
                      <CustomRatioImage
                        width="15%"
                        height="15%"
                        margin="12px"
                        ratio={9 / 16}
                        src={programPackage.coverUrl || EmptyCover}
                        shape="rounded"
                      />
                      <StyledMeta view={view}>
                        <StyledTitle view={view}>{programPackage.title}</StyledTitle>
                        {settings['program.datetime.enabled'] === '1' && (
                          <StyledDescription view={view}>
                            {`${dayjs(programPackage.deliveredAt).format('YYYY-MM-DD')} 購買`}
                            {programPackage.lastViewedAt
                              ? ` / ${dayjs(programPackage.lastViewedAt).format('YYYY-MM-DD')} 上次觀看`
                              : ` / 尚未觀看`}
                          </StyledDescription>
                        )}
                      </StyledMeta>
                    </StyledCard>
                  </Link>
                </Box>
              </Box>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ProgramPackageCollectionBlock
