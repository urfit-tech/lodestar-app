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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  SkeletonText,
  Text,
  useRadioGroup,
} from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { Fragment, useState } from 'react'
import { BiSearch, BiSort } from 'react-icons/bi'
import { FiGrid, FiList } from 'react-icons/fi'
import { RiFilter2Fill } from 'react-icons/ri'
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

const getCreatorName = (program: ProgramEnrollment) =>
  program.roles.filter(role => role.name === 'instructor')[0]?.memberName || ''

const ProgramTab = ({
  onProgramTabClick,
  tab,
  programPackageCounts,
  programCounts,
}: {
  onProgramTabClick: (tab: string) => void
  tab: string
  programPackageCounts: number
  programCounts: number
}) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Flex cursor="pointer">
        <HStack spacing="10px">
          {programCounts > 0 && (
            <Text
              fontSize="2xl"
              as="b"
              onClick={() => onProgramTabClick('program')}
              color={tab === 'program' ? 'black' : '#cdcdcd'}
            >
              {formatMessage(productMessages.program.title.course)}
            </Text>
          )}
          {programCounts > 0 && programPackageCounts > 0 && (
            <Center height="20px">
              <Divider orientation="vertical" />
            </Center>
          )}
          {programPackageCounts > 0 && (
            <Text
              fontSize="2xl"
              as="b"
              onClick={() => onProgramTabClick('programPackage')}
              color={tab === 'programPackage' ? 'black' : '#cdcdcd'}
            >
              {formatMessage(commonMessages.ui.packages)}
            </Text>
          )}
        </HStack>
      </Flex>
    </>
  )
}

const sortOptions = [
  { value: 'newPurchaseDate', name: '購買日期（新到舊）' },
  { value: 'oldPurchaseDate', name: '購買日期（舊到新）' },
  { value: 'newLastViewDate', name: '最後觀課日（新到舊）' },
  { value: 'oldLastViewDate', name: '最後觀課日（舊到新）' },
  { value: 'lessCreatorStrokes', name: '依講師排序（筆畫少到多）' },
  { value: 'moreCreatorStrokes', name: '依講者排序（筆畫多到少）' },
]

const filterOptions = [
  { value: 'all', name: '全部課程' },
  { value: 'inProgress', name: '進行中' },
  { value: 'notStartYet', name: '尚未開始' },
  { value: 'Done', name: '已完課' },
]

const EnrolledProgramCollectionBlock: React.VFC<{
  onProgramTabClick: (tab: string) => void
  programTab: string
  programEnrollment: ProgramEnrollment[]
  expiredProgramEnrollment: ProgramEnrollment[]
  programPackageCounts: number
  programCounts: number
  isError: boolean
  loading: boolean
}> = ({
  onProgramTabClick,
  programTab,
  programEnrollment,
  expiredProgramEnrollment,
  programPackageCounts,
  programCounts,
  isError,
  loading,
}) => {
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const localStorageView = localStorage.getItem('programView')
  const [view, setView] = useState(localStorageView ? localStorageView : 'Grid')
  const [sort, setSort] = useState('newPurchaseDate')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { settings } = useApp()

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
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (isError || !programEnrollment || !expiredProgramEnrollment) {
    return (
      <div className="container py-3">
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
        const keyword = search.toLowerCase()
        if (program.title.includes(keyword) || getCreatorName(program).includes(keyword)) {
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
        const keyword = search.toLowerCase()
        return program.title.includes(keyword) || getCreatorName(program).includes(keyword)
      } else {
        return true
      }
    })

  return (
    <div className="container py-3">
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        marginBottom="24px"
      >
        <HStack justifyContent="space-between" marginBottom={{ base: '20px', md: '0px' }}>
          {(programCounts > 0 || programPackageCounts > 0) && (
            <ProgramTab
              onProgramTabClick={onProgramTabClick}
              tab={programTab}
              programPackageCounts={programPackageCounts}
              programCounts={programCounts}
            />
          )}
          {((programEnrollment.length > 0 && !isExpired) || (expiredProgramEnrollment.length > 0 && isExpired)) && (
            <HStack spacing="25px" display={{ md: 'none' }}>
              <Menu>
                <MenuButton className="member-page-program-sort">
                  <BiSort />
                </MenuButton>
                <MenuList>
                  {sortOptions.map(s => (
                    <MenuItem key={s.value} onClick={() => setSort(s.value)}>
                      {s.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              {!isExpired && (
                <Menu>
                  <MenuButton className="member-page-program-filter">
                    <RiFilter2Fill />
                  </MenuButton>
                  <MenuList>
                    {filterOptions.map(f => (
                      <MenuItem key={f.value} onClick={() => setFilter(f.value)}>
                        {f.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}
            </HStack>
          )}
        </HStack>

        <InputGroup
          className="member-page-program-search"
          width={{ base: '100%' }}
          display={{ base: 'block', md: 'none' }}
          backgroundColor="white"
        >
          <Input
            placeholder="搜尋關鍵字"
            value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          />
          <InputRightElement>
            <BiSearch />
          </InputRightElement>
        </InputGroup>

        <HStack marginTop={{ base: '1rem', md: '0px' }} justifyContent={{ base: 'space-between', md: 'normal' }}>
          {((programEnrollment.length > 0 && !isExpired) || (expiredProgramEnrollment.length > 0 && isExpired)) && (
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
          )}
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

      {((programEnrollment.length > 0 && !isExpired) || (expiredProgramEnrollment.length > 0 && isExpired)) && (
        <>
          <HStack justifyContent={'space-between'} marginBottom="32px" display={{ base: 'none', md: 'flex' }}>
            <HStack spacing="12px">
              <InputGroup className="member-page-program-sort" backgroundColor="white">
                <InputLeftElement>
                  <BiSort />
                </InputLeftElement>
                <StyledSelect
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSort(event.target.value)}
                  defaultValue={sort}
                  disabled={(!isExpired && programs.length === 0) || (isExpired && expiredPrograms.length === 0)}
                >
                  {sortOptions.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.name}
                    </option>
                  ))}
                </StyledSelect>
              </InputGroup>
              {!isExpired && (
                <InputGroup className="member-page-program-filter" backgroundColor="white">
                  <InputLeftElement>
                    <RiFilter2Fill />
                  </InputLeftElement>
                  <StyledSelect
                    default={filter}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value)}
                    disabled={(!isExpired && programs.length === 0) || (isExpired && expiredPrograms.length === 0)}
                  >
                    {filterOptions.map(f => (
                      <option key={f.value} value={f.value}>
                        {f.name}
                      </option>
                    ))}
                  </StyledSelect>
                </InputGroup>
              )}
            </HStack>
            <InputGroup className="member-page-program-search" width="fit-content" backgroundColor="white">
              <Input
                placeholder="搜尋關鍵字"
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
              />
              <InputRightElement>
                <BiSearch />
              </InputRightElement>
            </InputGroup>
          </HStack>

          <Flex
            gridGap={view === 'List' ? '12px' : '15px'}
            flexDirection={view === 'List' ? 'column' : 'row'}
            wrap={view === 'List' ? 'nowrap' : 'wrap'}
          >
            {(isExpired ? expiredPrograms : programs).map((program, index) => (
              <Fragment key={index}>
                {view === 'Grid' && (
                  <Box
                    marginBottom="1rem"
                    flex={{ base: '0 0 100%', md: '0 0 48%', lg: '0 0 32%' }}
                    maxWidth={{ base: '100%', md: '48%', lg: '32%' }}
                  >
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
                {view === 'List' && (
                  <Box width="100%">
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
          </Flex>
        </>
      )}

      {programEnrollment.length === 0 && expiredProgramEnrollment.length > 0 && !isExpired && <p>沒有可觀看的課程</p>}
      {programEnrollment.length === 0 && expiredProgramEnrollment.length === 0 && programPackageCounts === 0 && (
        <div>{formatMessage(productMessages.program.content.noProgram)}</div>
      )}

      {search !== '' && !isExpired && programEnrollment.length > 0 && programs.length === 0 && <p>查無相關課程</p>}
      {search !== '' && isExpired && expiredProgramEnrollment.length > 0 && expiredPrograms.length === 0 && (
        <p>查無相關課程</p>
      )}
    </div>
  )
}

export default EnrolledProgramCollectionBlock
