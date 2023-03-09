import { Button } from '@chakra-ui/react'
import { Form, Input, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { checkUniformNumber, validationRegExp } from 'lodestar-app-element/src/helpers'
import { useIntl } from 'react-intl'
import { cities, districts, useTwZipCode } from 'use-tw-zipcode'
import { commonMessages as helperCommonMessages } from '../../helpers/translation'
import authMessages from '../auth/translation'
import ImageUploader from './ImageUploader'
import commonMessages from './translation'

const companyTypes = [
  { label: '行號(工作室等)', value: 'firmOrWorkShop' },
  { label: '有限公司', value: 'limitedCompany' },
  { label: '股份有限公司', value: 'companyLimited' },
  { label: '政府機構', value: 'governmentAgency' },
  { label: '非營利組織', value: 'nonprofitOrganization' },
]
type BusinessSignupFromSubmitValue = {
  companyCity: string
  companyDistrict: string
}

const BusinessSignupForm: React.VFC<
  FormComponentProps & {
    companyPictureFile: File | null
    setCompanyPictureFile: React.Dispatch<React.SetStateAction<File | null>>
    onSubmit?: (submitValues: BusinessSignupFromSubmitValue) => void
  }
> = ({ form, companyPictureFile, setCompanyPictureFile, onSubmit }) => {
  const { city, district, handleDistrictChange, handleCityChange } = useTwZipCode()
  const { formatMessage } = useIntl()

  const businessFormUpperItems = [
    {
      label: formatMessage(authMessages.RegisterSection.companyPictureFile),
      decoratorId: 'companyPictureFile',
      child: (
        <ImageUploader
          file={companyPictureFile}
          customStyle={{ shape: 'circle', width: '128px', ratio: 1 }}
          customButtonStyle={{ width: '80%' }}
          onChange={file => setCompanyPictureFile(file)}
        />
      ),
    },
    {
      label: formatMessage(authMessages.RegisterSection.companyTitle),
      decoratorId: 'companyTitle',
      rules: [],
      child: <Input />,
    },
    {
      label: formatMessage(authMessages.RegisterSection.companyShortName),
      decoratorId: 'companyShortName',
      child: <Input placeholder={formatMessage(authMessages.RegisterSection.companyShortNameMessage)} />,
    },
  ]
  const businessFormLowerItems = [
    {
      label: formatMessage(authMessages.RegisterSection.officialWebsite),
      decoratorId: 'officialWebsite',
      rules: [
        {
          pattern: /^https?:\/\//,
          message: formatMessage(authMessages.RegisterSection.officialWebsiteMessage),
        },
      ],
      child: <Input placeholder={formatMessage(authMessages.RegisterSection.officialWebsiteMessage)} />,
    },
    {
      label: (
        <>
          <label style={{ color: 'red' }}>* </label>
          {formatMessage(authMessages.RegisterSection.companyAddress)}
        </>
      ),
      style: { marginBottom: '12px' },
      decoratorId: 'cityAndDistrict',
      child: (
        <div className="row">
          <div className="col-6">
            <Select className="col-12" value={city} onChange={(v: string) => handleCityChange(v)}>
              {cities.map(city => (
                <Select.Option key={city} value={city}>
                  {city}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="col-6">
            <Select className="col-12" value={district} onChange={(v: string) => handleDistrictChange(v)}>
              {districts[city].map(district => (
                <Select.Option key={district} value={district}>
                  {district}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
    {
      decoratorId: 'companyAddress',
      rules: [{ required: true, message: formatMessage(authMessages.RegisterSection.companyAddressPlease) }],
      child: <Input placeholder={formatMessage(authMessages.RegisterSection.detailedAddress)} />,
    },
    {
      label: formatMessage(authMessages.RegisterSection.personInChargeOfTheCompany),
      decoratorId: 'personInChargeOfTheCompany',
      rules: [
        {
          required: true,
          message: formatMessage(authMessages['*'].isRequiredWarning, {
            name: formatMessage(authMessages.RegisterSection.personInChargeOfTheCompany),
          }),
        },
      ],
      child: <Input />,
    },
    {
      label: formatMessage(authMessages.RegisterSection.companyPhone),
      decoratorId: 'companyPhone',
      rules: [
        {
          required: true,
          message: formatMessage(authMessages['*'].isRequiredWarning, {
            name: formatMessage(authMessages.RegisterSection.companyPhone),
          }),
        },
        {
          pattern: validationRegExp.phone,
          message: formatMessage(authMessages['*'].formatIsInvalidated),
        },
      ],
      child: <Input />,
    },
    {
      label: formatMessage(authMessages.RegisterSection.companyAbstract),
      decoratorId: 'companyAbstract',
      child: <Input.TextArea rows={5} />,
    },
  ]

  return (
    <Form
      layout="vertical"
      onSubmit={e => {
        e.preventDefault()
        onSubmit?.({ companyCity: city, companyDistrict: district })
      }}
    >
      {businessFormUpperItems.map(item => (
        <Form.Item key={item.decoratorId} label={item?.label}>
          {form.getFieldDecorator(item.decoratorId, { rules: item?.rules })(item.child)}
        </Form.Item>
      ))}
      <div className="row">
        <div className="col-6 col-lg-6">
          <Form.Item
            key="companyUniformNumber"
            label={formatMessage(authMessages.RegisterSection.companyUniformNumber)}
          >
            {form.getFieldDecorator('companyUniformNumber', {
              rules: [
                {
                  required: true,
                  message: formatMessage(commonMessages['*'].isRequiredWarning, {
                    name: formatMessage(authMessages.RegisterSection.companyUniformNumber),
                  }),
                },
                {
                  pattern: /^\d{8}$/,
                  message: formatMessage(authMessages.RegisterSection.uniformNumberLength),
                },
                {
                  validator: async (_, value, callback) => {
                    if (value?.toString().length === 8 && !checkUniformNumber(value)) {
                      await callback(formatMessage(authMessages.RegisterSection.uniformNumberIsInvalidated))
                    }
                    await callback()
                  },
                },
              ],
            })(<Input placeholder={formatMessage(authMessages.RegisterSection.companyUniformNumber)} />)}
          </Form.Item>
        </div>
        <div className="col-6 col-lg-6">
          <Form.Item key="companyType" label={formatMessage(authMessages.RegisterSection.companyType)}>
            {form.getFieldDecorator('companyType', {
              rules: [
                {
                  required: true,
                  message: formatMessage(commonMessages['*'].isRequiredWarning, {
                    name: formatMessage(authMessages.RegisterSection.companyType),
                  }),
                },
              ],
            })(
              <Select className="col-12" placeholder={formatMessage(authMessages.RegisterSection.pleaseSelect)}>
                {companyTypes.map(v => (
                  <Select.Option key={v.value} value={v.value}>
                    {v.label}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </div>
      </div>
      {businessFormLowerItems.map(item => (
        <Form.Item key={item.decoratorId} label={item?.label} style={item?.style}>
          {form.getFieldDecorator(item.decoratorId, { rules: item?.rules })(item.child)}
        </Form.Item>
      ))}
      <Form.Item>
        <Button colorScheme="primary" type="submit" isFullWidth block="true">
          {formatMessage(helperCommonMessages.defaults.establish)}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default BusinessSignupForm
