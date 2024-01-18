import { Box, Flex, HStack, SkeletonText, useRadioGroup } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { Fragment, useState } from 'react'
import { BiSort } from 'react-icons/bi'
import { useIntl } from 'react-intl'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ProgramTab, ViewSwitch } from '../../pages/MemberPage'
import { ProgramPackageEnrollment } from '../../types/programPackage'
import CustomChakraSelect from '../common/CustomChakraSelect'
import CustomMenuButton from '../common/CustomMenuButton'
import CustomSearchInput from '../common/CustomSearchInput'
import PackageCard from '../package/PackageCard'
import RadioCard from '../RadioCard'

const sortOptions = [
  { className: 'new-purchase-date', value: 'newPurchaseDate', name: '購買日期（新到舊）' },
  { className: 'old-purchase-date', value: 'oldPurchaseDate', name: '購買日期（舊到新）' },
  { className: 'new-last-view-date', value: 'newLastViewDate', name: '最後觀課日（新到舊）' },
  { className: 'old-last-view-date', value: 'oldLastViewDate', name: '最後觀課日（舊到新）' },
]

const ProgramPackageCollectionBlock: React.VFC<{
  memberId: string
  onProgramTabClick: (tab: string) => void
  programTab: string
  programPackageEnrollment: ProgramPackageEnrollment[]
  expiredProgramPackageEnrollment: ProgramPackageEnrollment[]
  totalProgramPackageCounts: number
  totalProgramCounts: number
  loading: boolean
  isError: boolean
}> = ({
  memberId,
  programTab,
  onProgramTabClick,
  programPackageEnrollment,
  expiredProgramPackageEnrollment,
  totalProgramPackageCounts,
  totalProgramCounts,
  loading,
  isError,
}) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [isExpired, setIsExpired] = useState(false)
  const localStorageView = localStorage.getItem('programPackageView')
  const [view, setView] = useState(localStorageView ? localStorageView : 'Grid')
  const [sort, setSort] = useState('newPurchaseDate')
  const [search, setSearch] = useState('')
  const datetimeEnabled = settings['program.datetime.enabled'] === '1'
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
        const keyword = search.toLowerCase()
        return programPackage.title.toLowerCase().includes(keyword)
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
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container py-3">
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
        marginBottom="24px"
      >
        <HStack justifyContent="space-between" marginBottom={{ base: '20px', md: '0px' }}>
          {(totalProgramCounts > 0 || totalProgramPackageCounts > 0) && (
            <ProgramTab
              onProgramTabClick={onProgramTabClick}
              tab={programTab}
              totalProgramCounts={totalProgramCounts}
              totalProgramPackageCounts={totalProgramPackageCounts}
            />
          )}
          <HStack spacing="25px" display={{ md: 'none' }}>
            <CustomMenuButton
              className="member-page-program-sort"
              buttonElement={<BiSort />}
              options={sortOptions}
              onClick={value => setSort(value)}
            />
          </HStack>
        </HStack>

        <CustomSearchInput
          className="member-page-program-search"
          placeholder={formatMessage(commonMessages.form.placeholder.searchKeyword)}
          width={{ base: '100%' }}
          display={{ base: 'block', md: 'none' }}
          defaultValue={search}
          onChange={event => setSearch(event.target.value)}
        />
        <HStack marginTop={{ base: '1rem', md: '0px' }} justifyContent={{ base: 'space-between', md: 'normal' }}>
          <ViewSwitch
            className={view === 'Grid' ? 'member-page-view-list' : 'member-page-view-card'}
            view={view}
            onClick={() => {
              setView(view === 'Grid' ? 'List' : 'Grid')
              localStorage.setItem('programPackageView', view === 'Grid' ? 'List' : 'Grid')
            }}
          />

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

      {((programPackageEnrollment.length > 0 && !isExpired) ||
        (expiredProgramPackageEnrollment.length > 0 && isExpired)) && (
        <>
          <HStack justifyContent={'space-between'} display={{ base: 'none', md: 'flex' }} marginBottom="32px">
            <CustomChakraSelect
              className="member-page-program-sort"
              width="fit-content"
              leftIcon={<BiSort />}
              options={sortOptions}
              defaultValue={sort}
              onChange={event => setSort(event.target.value)}
            />
            <CustomSearchInput
              className="member-page-program-search"
              placeholder={formatMessage(commonMessages.form.placeholder.searchKeyword)}
              width="fit-content"
              defaultValue={search}
              onChange={event => setSearch(event.target.value)}
            />
          </HStack>

          <Flex
            gridGap={view === 'List' ? '12px' : '15px'}
            flexDirection={view === 'List' ? 'column' : 'row'}
            wrap={view === 'List' ? 'nowrap' : 'wrap'}
            alignItems="center"
          >
            {programPackage.map(programPackage => {
              const programPackageLink = !isExpired
                ? `/program-packages/${programPackage.id}/contents?memberId=${memberId}`
                : `/program-packages/${programPackage.id}`
              return (
                <Fragment key={programPackage.id}>
                  {view === 'Grid' && (
                    <Box
                      marginBottom="1rem"
                      flex={{ base: '0 0 100%', md: '0 0 48%', lg: '0 0 32%' }}
                      maxWidth={{ base: '100%', md: '48%', lg: '32%' }}
                      opacity={isExpired ? '50%' : '100%'}
                    >
                      <PackageCard
                        memberId={memberId}
                        coverUrl={programPackage.coverUrl}
                        title={programPackage.title}
                        lastViewedAt={programPackage.lastViewedAt}
                        deliveredAt={programPackage.deliveredAt}
                        programDateEnabled={datetimeEnabled}
                        view={view}
                        link={programPackageLink}
                      />
                    </Box>
                  )}
                  {view === 'List' && (
                    <Box width="100%" opacity={isExpired ? '50%' : '100%'}>
                      <PackageCard
                        memberId={memberId}
                        coverUrl={programPackage.coverUrl}
                        title={programPackage.title}
                        lastViewedAt={programPackage.lastViewedAt}
                        deliveredAt={programPackage.deliveredAt}
                        programDateEnabled={datetimeEnabled}
                        view={view}
                        link={programPackageLink}
                      />
                    </Box>
                  )}
                </Fragment>
              )
            })}
          </Flex>
        </>
      )}
      {programPackageEnrollment.length === 0 && expiredProgramPackageEnrollment.length > 0 && !isExpired && (
        <p>{formatMessage(productMessages.programPackage.content.noEnrolledProgramPackage)}</p>
      )}
      {search !== '' && programPackageEnrollment.length > 0 && programPackage.length === 0 && (
        <p>{formatMessage(productMessages.programPackage.content.noSearchEnrolledProgramPackage)}</p>
      )}
    </div>
  )
}

export default ProgramPackageCollectionBlock
