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
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { Fragment, useEffect, useState } from 'react'
import { BiSearch, BiSort } from 'react-icons/bi'
import { FiGrid, FiList } from 'react-icons/fi'
import { HiFilter } from 'react-icons/hi'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import RadioCard from '../../components/RadioCard'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ProgramEnrollment } from '../../types/program'
import ProgramCard from './ProgramCard'

const StyledSelect = styled(Select)`
  width: fit-content !important;
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

const EnrolledProgramCollectionBlock: React.VFC<{
  onProgramTabClick: (tab: string) => void
  programTab: string
  programEnrollment: ProgramEnrollment[]
  expiredProgramEnrollment: ProgramEnrollment[]
  isError: boolean
  loading: boolean
}> = ({ onProgramTabClick, programTab, programEnrollment, expiredProgramEnrollment, isError, loading }) => {
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const localStorageView = localStorage.getItem('programView')
  const [view, setView] = useState(localStorageView ? localStorageView : 'Grid')
  const [sort, setSort] = useState('newPurchaseDate')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { settings } = useApp()

  useEffect(() => {
    // refetchOwnerPrograms && refetchOwnerPrograms()
    // refetchExpiredOwnedProducts && refetchExpiredOwnedProducts()
    // refetchExpiredProgramByProgramPlans && refetchExpiredProgramByProgramPlans()
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        </div>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (isError || !programEnrollment || !expiredProgramEnrollment) {
    return (
      <div className="container py-3">
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <div>{formatMessage(commonMessages.status.loadingUnable)}</div>
      </div>
    )
  }

  const programs = programEnrollment
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
      if (sort === 'lessCreatorStrokes') {
        return getCreatorName(a).localeCompare(getCreatorName(b), 'zh-Hant')
      }
      if (sort === 'moreCreatorStrokes') {
        return getCreatorName(b).localeCompare(getCreatorName(a), 'zh-Hant')
      }
      return 0
    })
    .filter(program => {
      const viewRate = Math.floor(program.viewRate * 100)
      if (search !== '') {
        if (program.title.includes(search) || getCreatorName(program).includes(search)) {
          return filter === 'inProgress'
            ? viewRate > 0 && viewRate < 100
            : filter === 'Done'
            ? viewRate === 100
            : filter === 'notStartYet'
            ? viewRate === 0
            : true
        } else {
          return false
        }
      } else {
        if (filter === 'inProgress') {
          return viewRate > 0 && viewRate < 100
        }
        if (filter === 'Done') {
          return viewRate === 100
        }
        if (filter === 'notStartYet') {
          return viewRate === 0
        }
        return true
      }
    })

  const expiredPrograms = expiredProgramEnrollment
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
      if (sort === 'lessCreatorStrokes') {
        return getCreatorName(a).localeCompare(getCreatorName(b), 'zh-Hant')
      }
      if (sort === 'moreCreatorStrokes') {
        return getCreatorName(b).localeCompare(getCreatorName(a), 'zh-Hant')
      }
      return 0
    })
    .filter(program => {
      if (search !== '') {
        return program.title.includes(search) || getCreatorName(program).includes(search)
      } else {
        return true
      }
    })

  return (
    <div className="container py-3">
      {programEnrollment.length === 0 && expiredProgramEnrollment.length === 0 && (
        <div>{formatMessage(productMessages.program.content.noProgram)}</div>
      )}

      {(programEnrollment.length !== 0 || expiredProgramEnrollment.length !== 0) && (
        <>
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
                      localStorage.setItem('programView', view === 'Grid' ? 'List' : 'Grid')
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
              {expiredProgramEnrollment.length !== 0 && settings['feature.expired_program_plan.enable'] === '1' && (
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

          <HStack justifyContent={'space-between'}>
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
                  <option value="lessCreatorStrokes">依講師排序（筆畫少到多）</option>
                  <option value="moreCreatorStrokes">依講者排序（筆畫多到少）</option>
                </StyledSelect>
              </InputGroup>
              {!isExpired && (
                <InputGroup>
                  <InputLeftElement>
                    <HiFilter />
                  </InputLeftElement>
                  <StyledSelect
                    default={filter}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value)}
                  >
                    <option value="all">全部課程</option>
                    <option value="inProgress">進行中</option>
                    <option value="notStartYet">尚未開始</option>
                    <option value="Done">已完課</option>
                  </StyledSelect>
                </InputGroup>
              )}
            </HStack>
            <Box>
              <InputGroup>
                <Input
                  placeholder="搜尋關鍵字"
                  value={search}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(event.target.value.trim().toLowerCase())
                  }
                />
                <InputRightElement>
                  <BiSearch />
                </InputRightElement>
              </InputGroup>
            </Box>
          </HStack>
          <div className="row">
            {(isExpired ? expiredPrograms : programs).map(program => (
              <Fragment key={program.id}>
                {view === 'Grid' && (
                  <div className="col-12 mb-4 col-md-6 col-lg-4">
                    <ProgramCard
                      programId={program.id}
                      view={view}
                      roles={program.roles}
                      coverThumbnailUrl={program.coverThumbnailUrl}
                      coverUrl={program.coverUrl}
                      coverMobileUrl={program.coverMobileUrl}
                      deliveredAt={program.deliveredAt}
                      title={program.title}
                      abstract={program.abstract || ''}
                      lastViewDate={program.lastViewedAt}
                      viewRate={program.viewRate}
                      withProgress={!isExpired}
                      isExpired={isExpired}
                      previousPage={`members_${currentMemberId}`}
                    />
                  </div>
                )}
                {view === 'List' && (
                  <Box display="flex" width="100%" marginBottom="12px">
                    <ProgramCard
                      programId={program.id}
                      view={view}
                      roles={program.roles}
                      coverThumbnailUrl={program.coverThumbnailUrl}
                      coverUrl={program.coverUrl}
                      coverMobileUrl={program.coverMobileUrl}
                      deliveredAt={program.deliveredAt}
                      title={program.title}
                      abstract={program.abstract || ''}
                      lastViewDate={program.lastViewedAt}
                      viewRate={program.viewRate}
                      withProgress={!isExpired}
                      isExpired={isExpired}
                      previousPage={`members_${currentMemberId}`}
                    />
                  </Box>
                )}
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const getCreatorName = (program: ProgramEnrollment) =>
  program.roles.filter(role => role.name === 'instructor')[0]?.memberName || ''

export default EnrolledProgramCollectionBlock
