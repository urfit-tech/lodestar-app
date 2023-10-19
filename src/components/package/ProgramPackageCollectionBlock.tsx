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
import dayjs from 'dayjs'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { Fragment, useState } from 'react'
import { BiSearch, BiSort } from 'react-icons/bi'
import { FiGrid, FiList } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProgramCover } from '../../components/common/Image'
import { commonMessages, productMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageEnrollment } from '../../types/programPackage'
import RadioCard from '../RadioCard'

const StyledCard = styled(Box)`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`

const StyledDescription = styled(Text)<{ view?: string }>`
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

const StyledTitle = styled(Text)<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${CommonTitleMixin}
  ${props =>
    props.view === 'List'
      ? `
      margin-bottom:0px;
      display:block;
      overflow: hidden;
      text-overflow: ellipsis;
      `
      : `
      margin-bottom: 1.25rem;
      height: 3rem;
      `}
`

const StyledSelect = styled(Select)`
  padding-left: 35px !important;
`

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
]

const ProgramPackageCollectionBlock: React.VFC<{
  memberId: string
  onProgramTabClick: (tab: string) => void
  programTab: string
  programPackageEnrollment: ProgramPackageEnrollment[]
  expiredProgramPackageEnrollment: ProgramPackageEnrollment[]
  programPackageCounts: number
  programCounts: number
  loading: boolean
  isError: boolean
}> = ({
  memberId,
  programTab,
  onProgramTabClick,
  programPackageEnrollment,
  expiredProgramPackageEnrollment,
  programPackageCounts,
  programCounts,
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
          {(programCounts > 0 || programPackageCounts > 0) && (
            <ProgramTab
              onProgramTabClick={onProgramTabClick}
              tab={programTab}
              programCounts={programCounts}
              programPackageCounts={programPackageCounts}
            />
          )}

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
          </HStack>
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(event.target.value.trim().toLowerCase())
            }
          />
          <InputRightElement>
            <BiSearch />
          </InputRightElement>
        </InputGroup>

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

      {programPackageEnrollment.length === 0 && expiredProgramPackageEnrollment.length > 0 && !isExpired && (
        <p>沒有可觀看的課程組合</p>
      )}
      {programPackageEnrollment.length === 0 && expiredProgramPackageEnrollment.length === 0 && programCounts === 0 && (
        <div>{formatMessage(commonMessages.content.noProgramPackage)}</div>
      )}

      {((programPackageEnrollment.length > 0 && !isExpired) ||
        (expiredProgramPackageEnrollment.length > 0 && isExpired)) && (
        <>
          <HStack justifyContent={'space-between'} display={{ base: 'none', md: 'flex' }} marginBottom="32px">
            <InputGroup className="member-page-program-sort" width="fit-content" backgroundColor="white">
              <InputLeftElement>
                <BiSort />
              </InputLeftElement>
              <StyledSelect
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSort(event.target.value)}
                defaultValue={sort}
              >
                {sortOptions.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.name}
                  </option>
                ))}
              </StyledSelect>
            </InputGroup>
            <InputGroup className="member-page-program-search" width="fit-content" backgroundColor="white">
              <Input
                placeholder="搜尋關鍵字"
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
            alignItems="center"
          >
            {programPackage.map(programPackage => (
              <Fragment key={programPackage.id}>
                {view === 'Grid' && (
                  <Box
                    marginBottom="1rem"
                    flex={{ base: '0 0 100%', md: '0 0 48%', lg: '0 0 32%' }}
                    maxWidth={{ base: '100%', md: '48%', lg: '32%' }}
                    opacity={isExpired ? '50%' : '100%'}
                  >
                    <Link
                      to={
                        isExpired
                          ? `/program-packages/${programPackage.id}`
                          : `/program-packages/${programPackage.id}/contents?memberId=${memberId}`
                      }
                    >
                      <StyledCard>
                        <ProgramCover
                          width="100%"
                          paddingTop="calc(100% * 9/16)"
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
                  <Box width="100%" opacity={isExpired ? '50%' : '100%'}>
                    <Link
                      to={
                        isExpired
                          ? `/program-packages/${programPackage.id}`
                          : `/program-packages/${programPackage.id}/contents?memberId=${memberId}`
                      }
                    >
                      <StyledCard>
                        <Box
                          display="flex"
                          marginY={{ base: '16px', md: '0px' }}
                          marginX={{ base: '12px', md: '0px' }}
                          alignItems="center"
                        >
                          <ProgramCover
                            width={{ base: '40%', md: '15%' }}
                            height={{ base: '40%', md: '15%' }}
                            paddingTop={{ base: 'calc(40% * 9/16)', md: 'calc(15% * 9/16)' }}
                            margin={{ base: '0px 16px 0px 0px', md: '12px' }}
                            src={programPackage.coverUrl || EmptyCover}
                            shape="rounded"
                          />
                          <StyledMeta view={view}>
                            <StyledTitle fontSize="1rem" noOfLines={{ base: 2, md: 1 }} view={view}>
                              {programPackage.title}
                            </StyledTitle>
                            {settings['program.datetime.enabled'] === '1' && (
                              <StyledDescription display={{ base: 'none', md: 'block' }} view={view}>
                                {`${dayjs(programPackage.deliveredAt).format('YYYY-MM-DD')} 購買`}
                                {programPackage.lastViewedAt
                                  ? ` / ${dayjs(programPackage.lastViewedAt).format('YYYY-MM-DD')} 上次觀看`
                                  : ` / 尚未觀看`}
                              </StyledDescription>
                            )}
                          </StyledMeta>
                        </Box>
                        {settings['program.datetime.enabled'] === '1' && (
                          <StyledDescription
                            display={{ base: 'block', md: 'none' }}
                            marginX="12px"
                            marginBottom="16px"
                            view={view}
                          >
                            {`${dayjs(programPackage.deliveredAt).format('YYYY-MM-DD')} 購買`}
                            {programPackage.lastViewedAt
                              ? ` / ${dayjs(programPackage.lastViewedAt).format('YYYY-MM-DD')} 上次觀看`
                              : ` / 尚未觀看`}
                          </StyledDescription>
                        )}
                      </StyledCard>
                    </Link>
                  </Box>
                )}
              </Fragment>
            ))}
          </Flex>
        </>
      )}
    </div>
  )
}

export default ProgramPackageCollectionBlock
