/* eslint-disable no-console */
import React, { useState, useEffect, useDebugValue, useMemo } from 'react'
import styled from 'styled-components'
import {
  Select,
  Form,
  Row,
  Col,
  Radio,
  Space,
  Input,
  Tag,
  Alert,
  RadioChangeEvent,
} from 'antd'
import Button from 'antd-button-color'
import {
  DATASET_FILTER_OPTION,
  DATASET_FILTER_FIELD,
  DatasetFilterFieldTagSelect,
  DatasetFilterOptionTagSelect,
  DatasetFilterFieldDisabledOption,
} from '../../../configs/constants'
import {
  DataSetSearchParams,
  DataSetMutatedSearchParams,
} from '../../../types/dataset'
import { DefinitionOnly } from '../../../types/definition'
import { useGetAllDefinition } from '../../../api/definition'
import { DefaultOptionType } from 'antd/lib/select'
import { getParams } from '../../../api/dataset'
import { useErrorMessage } from '../../../hooks/useErrorMessage'

const { Option } = Select
const StyledForm = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
`

const StyledRow = styled(Row)`
  width: 100%;
`

const StyledRowMargin = styled(StyledRow)`
  margin-bottom: 20px;
`

const StyledCol = styled(Col)`
  width: 33%;
`

const StyledColPadding = styled(StyledCol)`
  padding: 0 20px 0 0;
`

const StyledColPaddingLeft = styled(StyledCol)`
  padding: 0 20px 0 50px;
`

const StyledColRight = styled(Col)`
  text-align: right;
`

const StyledAlert = styled(Alert)`
  text-align: center;
`
interface DataSetSearchProps {
  onSearch: (param: string) => void
  defaultDefinitionId: string | undefined
  definitionList: DefinitionOnly[] | undefined
  definitionLoading: boolean
}

const DataSetSearch = ({
  onSearch,
  defaultDefinitionId,
  definitionList,
  definitionLoading,
}: DataSetSearchProps): JSX.Element => {
  const { errMsg, clearErrMsg, setErrMsgState } = useErrorMessage()
  const [definitionId, setDefinitionId] = useState(defaultDefinitionId)

  const [form] = Form.useForm()

  const [selectedFieldOption, setSelectedFieldOption] = useState<string>('')
  const [queryList, setQueryList] = useState<DataSetSearchParams[]>([])
  const [selectedQuery, setSelectedQuery] = useState<string>(
    DATASET_FILTER_OPTION.CONTAIN
  )
  const [selectedDefinitionOption, setSelectedDefinitionOption] = useState<
    string[]
  >([])

  const mapDefinitionIdToName: {
    [key: string]: string
  } = useMemo(() => {
    const result = {} as { [key: string]: string }
    if (!definitionList) return result

    let definitionId = ''
    for (let i = 0; i < definitionList?.length; i++) {
      definitionId = definitionList[i]?.id || ''
      if (!result[definitionId]) {
        result[definitionId] = definitionList[i]?.name || ''
      }
    }
    return result
  }, [definitionList])

  const handleChangeOption = (value: string) => {
    setSelectedFieldOption(value)
    setSelectedQuery(DATASET_FILTER_OPTION.CONTAIN)
    form.setFieldsValue({ operation: '', searchText: undefined })
  }

  const handleAddQuery = (values: DataSetSearchParams) => {
    if (DatasetFilterFieldDisabledOption[values.type] === values.operation) {
      setErrMsgState(
        `Error: Field of type ${values.type} cannot have operation of type ${values.operation}`
      )
    } else {
      setQueryList([...queryList, values])
      form.setFieldsValue({ searchText: undefined })
      if (
        selectedFieldOption === DATASET_FILTER_FIELD.ACTION &&
        selectedQuery !== DATASET_FILTER_OPTION.CONTAIN
      ) {
        setSelectedDefinitionOption([
          ...selectedDefinitionOption,
          values.searchText,
        ])
      }
    }
  }

  const handleClear = () => {
    setQueryList([])
    form.resetFields()
  }

  const handleDeleteQuery = (
    index: number,
    selectedType: string,
    selectedAction: string
  ) => {
    if (selectedType === DATASET_FILTER_FIELD.ACTION) {
      selectedDefinitionOption.splice(
        selectedDefinitionOption.indexOf(selectedAction),
        1
      )
    }
    queryList.splice(index, 1)
  }

  const handleSearch = () => {
    const queryMap = new Map(
      queryList.map(({ type, operation }) => [
        type.concat(operation),
        { type, operation, searchText: [] as string[] },
      ])
    )
    for (const { type, operation, searchText } of queryList) {
      const tempkey = type.concat(operation)
      queryMap.get(tempkey)?.searchText.push(...[searchText].flat())
    }
    const mutatedQuery: DataSetMutatedSearchParams[] = [...queryMap.values()]
    onSearch(getParams(mutatedQuery))
  }

  const handleFirstLoad = () => {
    if (definitionId) {
      handleAddQuery({
        type: DATASET_FILTER_FIELD.ACTION,
        operation: DATASET_FILTER_OPTION.EQUAL,
        searchText: definitionId ?? '',
      })
    }
  }

  useEffect(() => {
    handleFirstLoad()
  }, [])

  return (
    <StyledForm
      form={form}
      onFinish={(values: unknown) => {
        const valuesCast = values as DataSetSearchParams
        handleAddQuery(valuesCast)
      }}
    >
      <StyledRow>
        <StyledColPadding span={8}>
          <Form.Item
            label="Field"
            name="type"
            rules={[
              {
                required: true,
                message: 'Field Type is required.',
              },
            ]}
          >
            <Select
              placeholder="Select Field"
              onChange={handleChangeOption}
              value={selectedFieldOption}
            >
              {DatasetFilterFieldTagSelect.map((option) => (
                <Option key={option.name} value={option.value}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </StyledColPadding>
        <StyledColPaddingLeft span={8}>
          <Form.Item
            label="Operation"
            name="operation"
            rules={[
              {
                required: true,
                message: 'Operation is required.',
              },
            ]}
          >
            <Radio.Group disabled={!selectedFieldOption}>
              {DatasetFilterOptionTagSelect.map((option) => (
                <Radio.Button
                  key={option.name}
                  value={option.value}
                  disabled={
                    DatasetFilterFieldDisabledOption[selectedFieldOption] ===
                    option.value
                  }
                  onChange={({ target: { value } }: RadioChangeEvent) => {
                    setSelectedQuery(value)
                  }}
                >
                  {option.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </StyledColPaddingLeft>
        <StyledCol>
          {selectedFieldOption === DATASET_FILTER_FIELD.TEXT ||
          selectedQuery === DATASET_FILTER_OPTION.CONTAIN ? (
            <Form.Item
              label="Query Text"
              name="searchText"
              rules={[
                {
                  required: true,
                  message: 'Query Text is required.',
                },
              ]}
            >
              <Input placeholder="Query Text" allowClear />
            </Form.Item>
          ) : (
            <Form.Item
              label="Query"
              name="searchText"
              rules={[
                {
                  required: true,
                  message: 'Query is required.',
                },
              ]}
            >
              {selectedFieldOption === DATASET_FILTER_FIELD.ACTION &&
                selectedQuery !== DATASET_FILTER_OPTION.CONTAIN && (
                  <Select
                    disabled={!selectedFieldOption}
                    showSearch
                    loading={definitionLoading}
                    placeholder="Search to Select Action"
                    optionFilterProp="children"
                    filterOption={(
                      input: string,
                      option: DefaultOptionType | undefined
                    ) => {
                      return option?.children
                        ? option?.children
                            ?.toString()
                            ?.toLowerCase()
                            ?.indexOf(input ? input?.toLowerCase() : '') >= 0
                        : false
                    }}
                    filterSort={(
                      optionA: DefaultOptionType,
                      optionB: DefaultOptionType
                    ) => {
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
                    {definitionList &&
                      definitionList
                        .filter(
                          (definition) =>
                            selectedDefinitionOption.indexOf(definition.id) < 0
                        )
                        .map((definition) => (
                          <Option key={definition.id} value={definition.id}>
                            {definition.name}
                          </Option>
                        ))}
                  </Select>
                )}
            </Form.Item>
          )}
        </StyledCol>
      </StyledRow>
      <StyledRowMargin>
        <Col span={19}>
          {queryList &&
            queryList.map((query: DataSetSearchParams, index: number) => (
              <Tag
                color="blue"
                key={index}
                closable
                onClose={() => {
                  handleDeleteQuery(index, query.type, query.searchText)
                }}
              >
                {query?.type === DATASET_FILTER_FIELD.ACTION
                  ? 'definition'
                  : query?.type}
                {query?.operation}
                {query?.type === DATASET_FILTER_FIELD.TEXT ||
                query?.operation === DATASET_FILTER_OPTION.CONTAIN
                  ? query.searchText
                  : mapDefinitionIdToName[query.searchText]}
              </Tag>
            ))}
          {errMsg && (
            <StyledAlert
              message={errMsg}
              type="error"
              showIcon
              closable
              onClose={clearErrMsg}
            />
          )}
        </Col>

        <StyledColRight span={5}>
          <Space>
            <Button type="danger" onClick={handleClear}>
              Clear
            </Button>
            <Button type="lightdark" htmlType="submit">
              Add
            </Button>
            <Button type="dark" onClick={handleSearch}>
              Search
            </Button>
          </Space>
        </StyledColRight>
      </StyledRowMargin>
    </StyledForm>
  )
}
export default DataSetSearch
