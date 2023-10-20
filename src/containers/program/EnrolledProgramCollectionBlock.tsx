import { Box, Flex, HStack, SkeletonText, useRadioGroup } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { Fragment, useState } from 'react'
import { BiSearch, BiSort } from 'react-icons/bi'
import { RiFilter2Fill } from 'react-icons/ri'
import { useIntl } from 'react-intl'
import CustomChakraSelect from '../../components/common/CustomChakraSelect'
import CustomMenuButton from '../../components/common/CustomMenuButton'
import CustomSearchInput from '../../components/common/CustomSearchInput'
import RadioCard from '../../components/RadioCard'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ProgramTab, ViewSwitch } from '../../pages/MemberPage'
import { ProgramEnrollment } from '../../types/program'
import ProgramCard from './ProgramCard'

const getCreatorName = (program: ProgramEnrollment) =>
  program.roles.filter(role => role.name === 'instructor')[0]?.memberName || ''

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
  memberId: string
  onProgramTabClick: (tab: string) => void
  programTab: string
  programEnrollment: ProgramEnrollment[]
  expiredProgramEnrollment: ProgramEnrollment[]
  programPackageCounts: number
  programCounts: number
  isError: boolean
  loading: boolean
}> = ({
  memberId,
  onProgramTabClick,
  programTab,
  programEnrollment,
  expiredProgramEnrollment,
  programPackageCounts,
  programCounts,
  isError,
  loading,
}) => {
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const localStorageView = localStorage.getItem('programView')
  const [view, setView] = useState(localStorageView ? localStorageView : 'Grid')
  const [sort, setSort] = useState('newPurchaseDate')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { settings } = useApp()
  const datetimeEnabled = settings['program.datetime.enabled'] === '1'

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

          <HStack spacing="25px" display={{ md: 'none' }}>
            <CustomMenuButton
              className="member-page-program-sort"
              buttonElement={<BiSort />}
              options={sortOptions}
              onClick={value => setSort(value)}
            />
            {!isExpired && (
              <CustomMenuButton
                className="member-page-program-filter"
                buttonElement={<RiFilter2Fill />}
                options={filterOptions}
                onClick={value => setFilter(value)}
              />
            )}
          </HStack>
        </HStack>
        <CustomSearchInput
          className="member-page-program-search"
          rightIcon={<BiSearch />}
          placeholder={formatMessage(commonMessages.form.placeholder.searchKeyword)}
          width={{ base: '100%' }}
          display={{ base: 'block', md: 'none' }}
          onChange={event => setSearch(event.target.value)}
        />

        <HStack marginTop={{ base: '1rem', md: '0px' }} justifyContent={{ base: 'space-between', md: 'normal' }}>
          <ViewSwitch
            view={view}
            onClick={() => {
              setView(view === 'Grid' ? 'List' : 'Grid')
              localStorage.setItem('programView', view === 'Grid' ? 'List' : 'Grid')
            }}
          />

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
              <CustomChakraSelect
                className="member-page-program-sort"
                leftIcon={<BiSort />}
                options={sortOptions}
                defaultValue={sort}
                onChange={event => setSort(event.target.value)}
                disabled={(!isExpired && programs.length === 0) || (isExpired && expiredPrograms.length === 0)}
              />
              {!isExpired && (
                <CustomChakraSelect
                  className="member-page-program-filter"
                  leftIcon={<RiFilter2Fill />}
                  options={filterOptions}
                  defaultValue={filter}
                  onChange={event => setFilter(event.target.value)}
                  disabled={(!isExpired && programs.length === 0) || (isExpired && expiredPrograms.length === 0)}
                />
              )}
            </HStack>
            <CustomSearchInput
              className="member-page-program-search"
              rightIcon={<BiSearch />}
              placeholder={formatMessage(commonMessages.form.placeholder.searchKeyword)}
              width="it-content"
              onChange={event => setSearch(event.target.value)}
            />
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
                      datetimeEnabled={datetimeEnabled}
                      withProgress={!isExpired}
                      isExpired={isExpired}
                      previousPage={`members_${memberId}`}
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
                      datetimeEnabled={datetimeEnabled}
                      withProgress={!isExpired}
                      isExpired={isExpired}
                      previousPage={`members_${memberId}`}
                    />
                  </Box>
                )}
              </Fragment>
            ))}
          </Flex>
        </>
      )}

      {programEnrollment.length === 0 && expiredProgramEnrollment.length > 0 && !isExpired && (
        <p>{formatMessage(productMessages.program.content.noEnrolledProgram)}</p>
      )}
      {programEnrollment.length === 0 && expiredProgramEnrollment.length === 0 && programPackageCounts === 0 && (
        <p>{formatMessage(productMessages.program.content.noProgram)}</p>
      )}

      {search !== '' && !isExpired && programEnrollment.length > 0 && programs.length === 0 && (
        <p>{formatMessage(productMessages.program.content.noSearchEnrolledProgram)}</p>
      )}
      {search !== '' && isExpired && expiredProgramEnrollment.length > 0 && expiredPrograms.length === 0 && (
        <p>{formatMessage(productMessages.program.content.noSearchEnrolledProgram)}</p>
      )}
    </div>
  )
}

export default EnrolledProgramCollectionBlock
