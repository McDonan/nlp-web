import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Col, Row, Space, Input, Spin, Alert } from 'antd'
import Button from 'antd-button-color'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import {
  useGetDefinition,
  useExportDefinition,
  useCreateDefinition,
  useUpdateDefinition,
  useDeleteDefinition,
  useUploadDefinition,
  useVerifyDefinition,
  useSubmitDefinition,
} from '../../api/definition'
import {
  Definition,
  DefinitionForm,
  DefinitionVerify,
  DefinitionSort,
} from '../../types/definition'
import { downloadFileFromBlob } from '../../utils/file'
import {
  PAGES,
  LIMIT,
  EXPORT_TYPE,
  DEFAULT_PAGE_SIZE,
  ErrorCode,
} from '../../configs/constants'
import ConfirmationModal from '../../components/ConfirmationModal'
import DefinitionTable from './components/DefinitionTable'
import DefinitionFormModal from './components/DefinitionFormModal'
import DefinitionVerifyModal from './components/DefinitionVerifyModal'
import ExportButton from '../../components/ExportButton'
import ImportButton from '../../components/ImportButton'
//got permission
import { useUser } from '../../hooks/useUser'
import { useErrorMessage } from '../../hooks/useErrorMessage'

const { Search } = Input

const StyledRowMenu = styled(Row)`
  padding-bottom: 15px;
`

const StyledColSearch = styled(Col)`
  text-align: right;
`

const StyledSearch = styled(Search)`
  width: 250px;
`

const StyledExclamationCircleOutlined = styled(ExclamationCircleOutlined)`
  font-size: 22px;
  color: #fbb437;
`

const DefinitionPage = (): JSX.Element => {
  //Got Userpermission
  const { accessPermission } = useUser()

  //permission constant
  const definitionCreate = accessPermission?.create_definitions || false
  const definitionEdit = accessPermission?.edit_definitions || false
  const definitionImport = accessPermission?.import_definitions || false
  const definitionExport = accessPermission?.export_definitions || false
  const definitionDelete = accessPermission?.delete_definitions || false
  const definitionSearch = accessPermission?.search_definitions || false

  const [searchKeyword, setSearchKeyword] = useState<string>()
  const [currentSort, setCurrentSort] = useState<DefinitionSort>()

  const [exportType, setExportType] = useState<string>()
  const [isExport, setIsExport] = useState<boolean>(false)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)

  const [showImportModal, setShowImportModal] = useState<boolean>(false)
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false)

  const [verifyModalLoading, setVerifyModalLoading] = useState<boolean>(false)

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false)
  const [confirmationModalLoading, setConfirmationModalLoading] =
    useState<boolean>(false)

  const [selectedRecord, setSelectedRecord] = useState<Definition | undefined>()

  const [selectedImportRecord, setSelectedImportRecord] =
    useState<DefinitionVerify>()
  const [selectedImportRecordIndex, setSelectedImportRecordIndex] = useState<
    number | undefined
  >()
  const [importedRecords, setImportedRecords] = useState<
    DefinitionVerify[] | undefined
  >([])
  //Error States
  const [frontEndErr, setFrontEndErr] = useState<string>()

  const { errMsg, clearErrMsg } = useErrorMessage()
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageSizeNumber, setPageSizeNumber] =
    useState<number>(DEFAULT_PAGE_SIZE)

  const {
    data: getDefinitionData,
    isLoading,
    isRefetching,
  } = useGetDefinition({
    page: pageNumber,
    limit: pageSizeNumber,
    searchText: searchKeyword,
    sort: currentSort,
  })

  const {
    data: dataExportFile,
    isLoading: isLoadingExportFile,
    isRefetching: isRefetchingExportFile,
    isError: isErrorExportFile,
  } = useExportDefinition({
    type: exportType,
    page: PAGES,
    limit: LIMIT,
    searchText: searchKeyword,
    isExport: isExport,
  })

  const createDefinition = useCreateDefinition()
  const updateDefinition = useUpdateDefinition()
  const deleteDefinition = useDeleteDefinition()
  const uploadDefinition = useUploadDefinition()
  const verifyDefinition = useVerifyDefinition()
  const submitDefinition = useSubmitDefinition()

  const handleOpenModal = (isOpen: boolean) => {
    setShowModal(isOpen)
    clearErrMsg()
  }

  const handleModalLoading = (isLoading: boolean) => {
    setModalLoading(isLoading)
  }

  const handleVerifyModalLoading = (isLoading: boolean) => {
    setVerifyModalLoading(isLoading)
  }

  const handleOpenConfirmationModal = (isOpen: boolean) => {
    setShowConfirmationModal(isOpen)
  }

  const handleConfirmationModalLoading = (isLoading: boolean) => {
    setConfirmationModalLoading(isLoading)
  }

  const handleOpenImportModal = (isOpen: boolean) => {
    clearErrMsg()
    setShowImportModal(isOpen)
  }

  const handleOpenVerifyModal = (isOpen: boolean) => {
    setShowVerifyModal(isOpen)
  }

  const handleCreate = () => {
    setSelectedRecord(undefined)
    handleOpenModal(true)
  }

  const handleEdit = (record: Definition) => {
    setSelectedRecord(record)
    handleOpenModal(true)
  }

  const handleDeleteImport = () => {
    handleConfirmationModalLoading(true)
    if (selectedImportRecordIndex !== undefined && importedRecords)
      importedRecords.splice(selectedImportRecordIndex, 1)
    handleOpenConfirmationModal(false)
    handleConfirmationModalLoading(false)
  }

  const handleOpenImportComfirmDelete = () => {
    handleOpenConfirmationModal(true)
  }

  const handleDelete = (record: Definition) => {
    setSelectedRecord(record)
    handleOpenConfirmationModal(true)
  }

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    setPageNumber(0)
  }

  const handleIsExport = (isExport: boolean) => {
    setIsExport(isExport)
  }

  const handleExportType = (type: string) => {
    setExportType(type)
  }

  const handleCreateDefinition = (data: DefinitionForm | undefined) => {
    if (data) {
      createDefinition.mutate(data, {
        onSuccess: () => {
          handleOpenModal(false)
          handleModalLoading(false)
          setPageNumber(0)
        },
        onError: () => {
          handleModalLoading(false)
        },
      })
    }
  }

  const handleUpdateDefinition = (
    data: DefinitionForm | undefined,
    id: string
  ) => {
    if (data) {
      updateDefinition.mutate(
        { definitionForm: data, id: id ?? '' },
        {
          onSuccess: () => {
            handleOpenModal(false)
            handleModalLoading(false)
            setPageNumber(0)
          },
          onError: () => {
            handleModalLoading(false)
          },
        }
      )
    }
  }

  const handleDeleteDefinition = (id: string) => {
    deleteDefinition.mutate(id, {
      onSuccess: () => {
        handleOpenConfirmationModal(false)
        handleConfirmationModalLoading(false)
        setPageNumber(0)
      },
      onError: () => {
        handleConfirmationModalLoading(false)
      },
    })
  }

  const handleExport = (isExport: boolean, type: string) => {
    clearErrMsg()
    handleIsExport(isExport)
    handleExportType(type)
  }

  // TODO : send data to import modal
  const handleImport = (formFile: FormData, type: string) => {
    let importType
    if (type === 'application/json') {
      importType = EXPORT_TYPE.JSON
    } else {
      importType = EXPORT_TYPE.EXCEL
    }
    uploadDefinition.mutate(
      { formFile, type: importType },
      {
        onSuccess: (data) => {
          handleOpenImportModal(false)
          handleOpenVerifyModal(true)
          setImportedRecords(data.data)
        },
      }
    )
  }

  const handleVerify = () => {
    handleVerifyModalLoading(true)
    if (importedRecords) {
      verifyDefinition.mutate(
        { definitionUploadForm: importedRecords },
        {
          onSuccess: (data) => {
            handleVerifyModalLoading(false)
            setImportedRecords(verifyDefinition.data?.data)
            setImportedRecords(data.data)
          },
          onError: () => {
            handleVerifyModalLoading(false)
          },
        }
      )
    }
  }

  const handleSubmit = () => {
    if (importedRecords) {
      handleVerifyModalLoading(true)
      submitDefinition.mutate(
        { definitionUploadForm: importedRecords },
        {
          onSuccess: () => {
            handleVerifyModalLoading(false)
            handleOpenVerifyModal(false)
            setPageNumber(0)
          },
        }
      )
    }
  }

  const handleChangeVerify = (data: DefinitionForm) => {
    const temp = {
      ...selectedImportRecord,
      ...data,
      accepted: undefined,
    }

    setSelectedImportRecord(temp)
    if (importedRecords && selectedImportRecordIndex !== undefined) {
      importedRecords[selectedImportRecordIndex] = temp
    }
  }

  const handleAddVerify = () => {
    const temp: DefinitionVerify = {
      name: '',
      description: '',
      reg_exes: [],
      rules: [],
      tags: [],
    }
    setSelectedImportRecord(temp)

    if (importedRecords) {
      importedRecords.push(temp)
    }
  }

  const handleDownloadFile = () => {
    let success = false
    let conditionPass = false
    if (
      isExport &&
      exportType &&
      dataExportFile &&
      !isLoadingExportFile &&
      !isRefetchingExportFile &&
      !isErrorExportFile
    ) {
      conditionPass = true
      success = downloadFileFromBlob(dataExportFile, 'definition', exportType)
    }
    if (success) {
      handleIsExport(false)
    } else if (conditionPass) {
      // ดักเคสเพราะเหมือน export all จะถูกเรียกใช้ตลอดเวลา ทำให้ถ้าไม่ดักมันจะขึ้น error ทันทีที่เปิดหน้าครับ
      setFrontEndErr(ErrorCode.DOWNLOADFAIL)
      handleIsExport(false)
    }
  }

  useEffect(() => {
    handleDownloadFile()
  }, [isExport, exportType, dataExportFile])

  return (
    <>
      <Col>
        <StyledRowMenu justify="start">
          <Col span={8}>
            <Space>
              {definitionCreate && (
                <Button
                  onClick={handleCreate}
                  type="success"
                  icon={<PlusOutlined />}
                >
                  Create
                </Button>
              )}
              {definitionImport && (
                <ImportButton
                  title="Import Definition"
                  showModal={showImportModal}
                  onShowModal={(isOpen: boolean) =>
                    handleOpenImportModal(isOpen)
                  }
                  isLoading={uploadDefinition.isLoading}
                  onImport={(formFile: FormData, type: string) =>
                    handleImport(formFile, type)
                  }
                />
              )}

              {definitionExport && (
                <ExportButton
                  title="Export Definition"
                  isLoading={isLoadingExportFile || isRefetchingExportFile}
                  onExport={(isExport: boolean, type: string) =>
                    handleExport(isExport, type)
                  }
                />
              )}
            </Space>

            {showVerifyModal && (
              <DefinitionVerifyModal
                onVerify={handleVerify}
                data={importedRecords}
                isLoading={verifyModalLoading}
                showModal={showVerifyModal}
                onShowModal={(isOpen: boolean) => handleOpenVerifyModal(isOpen)}
                onSubmit={handleSubmit}
                onDelete={handleOpenImportComfirmDelete}
                onSaveEdit={(data: DefinitionForm | undefined) => {
                  if (data) {
                    handleChangeVerify(data)
                  }
                }}
                onLoadingEdit={(isLoading: boolean) =>
                  handleVerifyModalLoading(isLoading)
                }
                onSetRecordIndex={setSelectedImportRecordIndex}
                onSetRecord={setSelectedImportRecord}
                onAddRow={handleAddVerify}
              />
            )}
            {showModal && (
              <DefinitionFormModal
                data={selectedRecord}
                showModal={showModal}
                modalLoading={modalLoading}
                onSubmit={(data: DefinitionForm | undefined, id?: string) => {
                  if (id) {
                    handleUpdateDefinition(data, id)
                  } else {
                    handleCreateDefinition(data)
                  }
                }}
                onCloseModal={() => handleOpenModal(false)}
                onLoadingModal={(isLoading: boolean) =>
                  handleModalLoading(isLoading)
                }
              />
            )}
            {showConfirmationModal && (
              <ConfirmationModal
                title={`Are you sure you would like to delete the "${
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  showVerifyModal
                    ? selectedImportRecord?.name
                      ? selectedImportRecord?.name
                      : ''
                    : selectedRecord?.name
                    ? selectedRecord?.name
                    : ''
                }" definition ?`}
                description="All reference datasets of this definition will be deleted too."
                okText="Delete"
                showModal={showConfirmationModal}
                modalLoading={confirmationModalLoading}
                onOk={() => {
                  if (showVerifyModal) {
                    handleDeleteImport()
                  } else if (selectedRecord?.id) {
                    handleConfirmationModalLoading(true)
                    handleDeleteDefinition(selectedRecord?.id)
                  }
                }}
                onCancel={() => {
                  handleOpenConfirmationModal(false)
                }}
              />
            )}
          </Col>
          {definitionSearch && (
            <StyledColSearch span={16}>
              <StyledSearch
                placeholder="Search"
                allowClear
                loading={isRefetching}
                onSearch={handleSearch}
              />
            </StyledColSearch>
          )}
        </StyledRowMenu>
      </Col>
      {isExport && exportType && errMsg && (
        <Alert
          type="error"
          message={errMsg}
          closable
          banner
          onClose={() => {
            clearErrMsg()
            setIsExport(false)
          }}
        />
      )}
      {frontEndErr && (
        <Alert
          type="error"
          message={frontEndErr}
          closable
          banner
          onClose={() => {
            clearErrMsg()
            setFrontEndErr(undefined)
          }}
        />
      )}
      <Spin spinning={isLoading || isRefetching}>
        <DefinitionTable
          data={getDefinitionData}
          canEdit={definitionEdit}
          canDelete={definitionDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangePage={setPageNumber}
          onChangePageSize={setPageSizeNumber}
          onChangeSort={setCurrentSort}
          pageNumber={pageNumber}
        />
      </Spin>
    </>
  )
}

export default DefinitionPage
