import React from 'react'
import { Select } from 'antd'
import { useGetDefinition } from '../../../api/definition'
import { LIMIT, PAGES } from '../../../configs/constants'
import { DefaultOptionType } from 'antd/lib/select'
import { DefinitionOnly } from '../../../types/definition'

const { Option } = Select
interface DefinitionSelectFieldProps {
  isVerify?: boolean
  value?: string
  onChange: (value: string) => void
  definitionList: DefinitionOnly[] | undefined
  isLoading: boolean
}

const DefinitionSelectField = ({
  value,
  onChange,
  isVerify = false,
  definitionList,
  isLoading,
}: DefinitionSelectFieldProps) => {
  // const { data: definitionList, isLoading } = useGetDefinition({
  //   page: PAGES,
  //   limit: LIMIT,
  //   searchText: '',
  // })

  return (
    <Select
      value={value}
      onChange={onChange}
      showSearch
      loading={isLoading}
      placeholder="Search to Select Definition"
      optionFilterProp="children"
      filterOption={(input: string, option: DefaultOptionType | undefined) => {
        return option?.children
          ? option?.children
              ?.toString()
              ?.toLowerCase()
              ?.indexOf(input ? input?.toLowerCase() : '') >= 0
          : false
      }}
      filterSort={(optionA: DefaultOptionType, optionB: DefaultOptionType) => {
        return optionA.children
          ? optionA?.children
              ?.toString()
              ?.toLowerCase()
              ?.localeCompare(
                optionB?.children
                  ? optionB?.children?.toString()?.toLowerCase()
                  : ''
              )
          : 0
      }}
    >
      {definitionList?.map((definition) => (
        <Option
          key={definition.id}
          value={isVerify ? definition.name : definition.id}
        >
          {definition.name}
        </Option>
      ))}
    </Select>
  )
}

export default DefinitionSelectField
