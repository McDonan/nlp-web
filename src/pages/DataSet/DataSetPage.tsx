import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Col, Space, Spin, Alert } from 'antd'
import Button from 'antd-button-color'
import { useLocation } from 'react-router-dom'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {
  useCreateDataSet,
  useUpdateDataSetMutation,
  useDeleteDataSetMutation,
  useUpdateDataSetBulkMutation,
  useDeleteDataSetBulkMutation,
  useExportDataSet,
  useGetDataSet,
  useUploadDataSet,
  useVerifyDataSet,
  useSubmitDataSet,
  useExportBulkDataSet,
} from '../../api/dataset'
import { useGetAllDefinition } from '../../api/definition'
import {
  DataSet,
  DataSetForm,
  DataSetBulkForm,
  DataSetVerify,
  DataSetImportForm,
  DataSetSort,
} from '../../types/dataset'
import { downloadFileFromBlob } from '../../utils/file'
import {
  PAGES,
  LIMIT,
  EXPORT_TYPE,
  DEFAULT_PAGE_SIZE,
  ErrorCode,
} from '../../configs/constants'
import ExportButton from '../../components/ExportButton'
import ExportSelectButton from '../../components/ExportSelectButton'
import ImportButton from '../../components/ImportButton'
import DataSetSearch from './components/DataSetSearch'
import DataSetVerifyModal from './components/DataSetVerifyModal'
import DataSetTable from './components/DataSetTable'
import DataSetFormModal from './components/DataSetFormModal'
import DataSetBulkFormModal from './components/DataSetBulkFormModal'
import ConfirmationModal from '../../components/ConfirmationModal'
//got permission
import { useUser } from '../../hooks/useUser'
import { useErrorMessage } from '../../hooks/useErrorMessage'

import { StyledRowMenu } from '../../components/StyledComponents'

type Props = {
  definitionID?: string
}

const StyledColMenu = styled(Col)`
  display: flex;
  align-items: end;
`

const DataSetPage = () => {
  const { accessPermission } = useUser()

  //Permission Constant
  const datasetCreate = accessPermission?.create_data_sets || false
  const datasetEdit = accessPermission?.edit_data_sets || false
  const datasetDelete = accessPermission?.delete_data_sets || false
  const datasetImport = accessPermission?.import_data_sets || false
  const datasetExport = accessPermission?.export_data_sets || false
  const datasetSearch = accessPermission?.search_data_sets || false

  const location = useLocation()
  const state = location.state as Props
  const [defaultDefinitionID] = useState<string | undefined>(
    state?.definitionID
  )
  const [searchKeyword, setSearchKeyword] = useState<string>(
    defaultDefinitionID ?? ''
  )
  const [currentSort, setCurrentSort] = useState<DataSetSort>()

  const [isMultipleSelect, setIsMultipleSelect] = useState<boolean>(false)
  const [selectedRecords, setSelectedRecords] = useState<DataSetBulkForm>()
  const [exportType, setExportType] = useState<string>()
  const [isExport, setIsExport] = useState<boolean>(false)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false)
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false)

  const [modalLoading, setModalLoading] = useState<boolean>(false)
  const [showImportModal, setShowImportModal] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<DataSet | undefined>()

  const [isBulkExportLoading, setIsBulkExportLoading] = useState<boolean>(false)
  const { errMsg, clearErrMsg } = useErrorMessage()

  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageSizeNumber, setPageSizeNumber] =
    useState<number>(DEFAULT_PAGE_SIZE)
  //Error State
  const [frontEndErr, setFrontEndErr] = useState<string>()
  const [isBulkExportErr, setBulkExportErr] = useState<boolean>(false)
  const {
    data: getDataSetData,
    isLoading,
    isRefetching,
  } = useGetDataSet({
    page: pageNumber,
    limit: pageSizeNumber,
    searchText:
      searchKeyword === defaultDefinitionID ? undefined : searchKeyword,
    definitionID:
      searchKeyword !== defaultDefinitionID ? undefined : searchKeyword,
    sort: currentSort,
  })

  const {
    data: dataExportFile,
    isLoading: isLoadingExportFile,
    isRefetching: isRefetchingExportFile,
    isError: isErrorExportFile,
  } = useExportDataSet({
    type: exportType,
    page: PAGES,
    limit: LIMIT,
    searchText: searchKeyword,
    isExport: isExport,
  })

  const { data: definitionList, isLoading: definitionLoading } =
    useGetAllDefinition(true)

  const createDataSet = useCreateDataSet()
  const updateDataSet = useUpdateDataSetMutation()
  const deleteDataSet = useDeleteDataSetMutation()
  const updateDataSetBulk = useUpdateDataSetBulkMutation()
  const deleteDataSetBulk = useDeleteDataSetBulkMutation()
  const uploadDataSet = useUploadDataSet()
  const verifyDataSet = useVerifyDataSet()
  const submitDataSet = useSubmitDataSet()

  const [selectedImportRecord, setSelectedImportRecord] =
    useState<DataSetVerify>()

  const [importedRecords, setImportedRecords] = useState<
    DataSetVerify[] | undefined
  >([])
  const [selectedImportRecordIndex, setSelectedImportRecordIndex] = useState<
    number | undefined
  >()
  const exportDatasetBulk = useExportBulkDataSet()

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false)
  const [confirmationModalLoading, setConfirmationModalLoading] =
    useState<boolean>(false)

  const [showConfirmationBulkModal, setShowConfirmationBulkModal] =
    useState<boolean>(false)

  const [confirmationBulkModalLoading, setConfirmationBulkModalLoading] =
    useState<boolean>(false)
  const [verifyModalLoading, setVerifyModalLoading] = useState<boolean>(false)

  const handleOpenModal = (isOpen: boolean) => {
    setShowModal(isOpen)
    clearErrMsg()
  }

  const handleOpenBulkModal = (isOpen: boolean) => {
    setShowBulkModal(isOpen)
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

  const handleOpenConfirmationBulkModal = (isOpen: boolean) => {
    setShowConfirmationBulkModal(isOpen)
  }

  const handleConfirmationModalLoading = (isLoading: boolean) => {
    setConfirmationModalLoading(isLoading)
  }

  const handleConfirmationBulkModalLoading = (isLoading: boolean) => {
    setConfirmationBulkModalLoading(isLoading)
  }

  const handleOpenImportModal = (isOpen: boolean) => {
    clearErrMsg()
    setShowImportModal(isOpen)
  }

  const handleOpenVerifyModal = (isOpen: boolean) => {
    setShowVerifyModal(isOpen)
  }

  const handleSearch = (param: string) => {
    setPageNumber(0)
    setSearchKeyword(param)
  }

  const handleCreate = () => {
    setSelectedRecord(undefined)
    handleOpenModal(true)
  }

  const handleEdit = (record: DataSet) => {
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

  const handleDelete = (record: DataSet) => {
    setSelectedRecord(record)
    handleOpenConfirmationModal(true)
  }

  const handleBulkEdit = () => {
    handleOpenBulkModal(true)
  }

  const handleBulkDelete = () => {
    handleOpenConfirmationBulkModal(true)
  }

  const handleBulkEditDataSet = (
    selectedRecords: DataSetBulkForm | undefined,
    selectedDefinition: string | undefined
  ) => {
    if (selectedRecords && selectedDefinition) {
      updateDataSetBulk.mutate(
        { ids: selectedRecords.ids, definition_id: selectedDefinition },
        {
          onSuccess: () => {
            handleOpenBulkModal(false)
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

  const handleBulkDeleteDataSet = () => {
    if (selectedRecords) {
      deleteDataSetBulk.mutate(selectedRecords, {
        onSuccess: () => {
          handleOpenConfirmationBulkModal(false)
          handleConfirmationBulkModalLoading(false)
          setPageNumber(0)
        },
        onError: () => {
          handleConfirmationBulkModalLoading(false)
        },
      })
    }
  }

  const handleIsExport = (isExport: boolean) => {
    setIsExport(isExport)
  }

  const handleExportType = (type: string) => {
    setExportType(type)
  }

  const handleCreateDataSet = (data: DataSetForm | undefined) => {
    if (data) {
      createDataSet.mutate(data, {
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

  const handleUpdateDataSet = (data: DataSetForm | undefined, id: string) => {
    if (data) {
      updateDataSet.mutate(
        { dataSetForm: data, id: id ?? '' },
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

  const handleDeleteDataSet = (id: string) => {
    deleteDataSet.mutate(id, {
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

  const handleBulkExport = (isExport: boolean, type: string) => {
    setIsBulkExportLoading(isExport)
    clearErrMsg()
    exportDatasetBulk.mutate(
      { type: type, whichExport: selectedRecords ?? { ids: [] } },
      {
        onSuccess: (data) => {
          let success = false
          if (type) {
            success = downloadFileFromBlob(data.data, 'selected-dataset', type)
          }
          if (success) {
            setIsBulkExportLoading(false)
          } else {
            setFrontEndErr(ErrorCode.DOWNLOADFAIL)
            setIsBulkExportLoading(false)
          }
        },
        onError: () => {
          setBulkExportErr(true)
          setIsBulkExportLoading(false)
        },
      }
    )
  }
  const handleImport = (formFile: FormData, type: string) => {
    let importType
    if (type === 'application/json') {
      importType = EXPORT_TYPE.JSON
    } else {
      importType = EXPORT_TYPE.EXCEL
    }
    uploadDataSet.mutate(
      { formFile, type: importType },
      {
        onSuccess: (data) => {
          handleOpenImportModal(false)
          handleOpenVerifyModal(true)
          setImportedRecords(data?.data)
        },
        onError: () => {
          handleModalLoading(false)
        },
      }
    )
  }

  const handleVerify = () => {
    handleVerifyModalLoading(true)
    if (importedRecords) {
      verifyDataSet.mutate(
        { dataSetUploadForm: importedRecords },
        {
          onSuccess: (data) => {
            handleVerifyModalLoading(false)
            setImportedRecords(verifyDataSet.data?.data)
            setImportedRecords(data.data)
          },
          onError: () => {
            handleVerifyModalLoading(false)
          },
        }
      )
    }
  }
  const handleAddVerify = () => {
    const temp: DataSetVerify = {
      text: '',
      definition: '',
    }
    setSelectedImportRecord(temp)

    if (importedRecords) {
      importedRecords.push(temp)
    }
  }

  const handleChangeVerify = (data: DataSetImportForm) => {
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

  const handleSubmit = () => {
    if (importedRecords) {
      handleVerifyModalLoading(true)
      submitDataSet.mutate(
        { dataSetUploadForm: importedRecords },
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
      success = downloadFileFromBlob(dataExportFile, 'dataset', exportType)
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
        {datasetSearch && (
          <DataSetSearch
            onSearch={handleSearch}
            defaultDefinitionId={defaultDefinitionID}
            definitionList={definitionList}
            definitionLoading={definitionLoading}
          />
        )}
        <StyledRowMenu justify="start">
          <StyledColMenu span={12}>
            <Space>
              {datasetCreate && (
                <Button
                  onClick={handleCreate}
                  type="success"
                  icon={<PlusOutlined />}
                >
                  Create
                </Button>
              )}
              {datasetEdit && (
                <Button
                  onClick={handleBulkEdit}
                  type="primary"
                  icon={<EditOutlined />}
                  disabled={!isMultipleSelect}
                >
                  Edit
                </Button>
              )}
              {datasetDelete && (
                <Button
                  onClick={handleBulkDelete}
                  type="danger"
                  icon={<DeleteOutlined />}
                  disabled={!isMultipleSelect}
                >
                  Delete
                </Button>
              )}
              {datasetImport && (
                <ImportButton
                  title="Import Dataset"
                  showModal={showImportModal}
                  onShowModal={(isOpen: boolean) =>
                    handleOpenImportModal(isOpen)
                  }
                  isLoading={uploadDataSet.isLoading}
                  onImport={(formFile: FormData, type: string) =>
                    handleImport(formFile, type)
                  }
                />
              )}
              {datasetExport && (
                <ExportSelectButton
                  title="Export Selected Dataset"
                  isLoading={isBulkExportLoading}
                  isSelecting={
                    (selectedRecords ? selectedRecords.ids.length : 0) >= 1
                      ? true
                      : false
                  }
                  onExport={(isExport: boolean, type: string) => {
                    handleBulkExport(isExport, type)
                  }}
                />
              )}
              {datasetExport && (
                <ExportButton
                  title="Export Dataset"
                  isLoading={isLoadingExportFile || isRefetchingExportFile}
                  onExport={(isExport: boolean, type: string) =>
                    handleExport(isExport, type)
                  }
                />
              )}
              {showVerifyModal && (
                <DataSetVerifyModal
                  onVerify={handleVerify}
                  data={importedRecords}
                  isLoading={verifyModalLoading}
                  showModal={showVerifyModal}
                  onShowModal={(isOpen: boolean) =>
                    handleOpenVerifyModal(isOpen)
                  }
                  onSubmit={handleSubmit}
                  onDelete={handleOpenImportComfirmDelete}
                  onSaveEdit={(data: DataSetImportForm | undefined) => {
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
                  definitionList={definitionList}
                  definitionLoading={definitionLoading}
                />
              )}
              {showModal && (
                <DataSetFormModal
                  data={selectedRecord}
                  showModal={showModal}
                  modalLoading={modalLoading}
                  onSubmit={(data: DataSetForm | undefined, id?: string) => {
                    if (id) {
                      handleUpdateDataSet(data, id)
                    } else {
                      handleCreateDataSet(data)
                    }
                  }}
                  onCloseModal={() => handleOpenModal(false)}
                  onLoadingModal={(isLoading: boolean) =>
                    handleModalLoading(isLoading)
                  }
                  definitionList={definitionList}
                  definitionLoading={definitionLoading}
                />
              )}

              {showBulkModal && (
                <DataSetBulkFormModal
                  showModal={showBulkModal}
                  modalLoading={modalLoading}
                  onSubmit={(data: string) => {
                    handleBulkEditDataSet(selectedRecords, data)
                  }}
                  onCloseModal={() => handleOpenBulkModal(false)}
                  onLoadingModal={(isLoading: boolean) =>
                    handleModalLoading(isLoading)
                  }
                  definitionList={definitionList}
                  definitionLoading={definitionLoading}
                />
              )}

              {showConfirmationModal && (
                <ConfirmationModal
                  title={`Are you sure you would like to delete the "${
                    showVerifyModal
                      ? selectedImportRecord?.text
                        ? selectedImportRecord?.text
                        : ''
                      : selectedRecord?.text
                      ? selectedRecord?.text
                      : ''
                  }" dataset ?`}
                  description="All of reference dataset of this dataset will be deleted too."
                  okText="Delete"
                  showModal={showConfirmationModal}
                  modalLoading={confirmationModalLoading}
                  onOk={() => {
                    if (showVerifyModal) {
                      handleDeleteImport()
                    } else if (selectedRecord?.id) {
                      handleConfirmationModalLoading(true)
                      handleDeleteDataSet(selectedRecord?.id)
                    }
                  }}
                  onCancel={() => {
                    handleOpenConfirmationModal(false)
                  }}
                />
              )}

              {showConfirmationBulkModal && (
                <ConfirmationModal
                  title={`Are you sure you would like to delete the "${
                    selectedRecord?.text ? selectedRecord?.text : ''
                  }" definition ?`}
                  description="All of reference dataset of this definition will be deleted too."
                  okText="Delete"
                  showModal={showConfirmationBulkModal}
                  modalLoading={confirmationBulkModalLoading}
                  onOk={() => {
                    if (isMultipleSelect) {
                      handleBulkDeleteDataSet()
                    }
                  }}
                  onCancel={() => {
                    handleOpenConfirmationBulkModal(false)
                  }}
                />
              )}
            </Space>
          </StyledColMenu>
        </StyledRowMenu>
      </Col>
      {isBulkExportErr && errMsg && (
        <Alert
          type="error"
          message={errMsg}
          closable
          banner
          onClose={() => {
            clearErrMsg()
            setBulkExportErr(false)
          }}
        />
      )}
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
            setFrontEndErr(undefined)
          }}
        />
      )}
      <Spin spinning={isLoading || isRefetching}>
        <DataSetTable
          data={getDataSetData}
          canEdit={datasetEdit}
          onEdit={handleEdit}
          canDelete={datasetDelete}
          onDelete={handleDelete}
          isSelectMultiple={setIsMultipleSelect}
          setSelectedRecords={setSelectedRecords}
          onChangePage={setPageNumber}
          onChangePageSize={setPageSizeNumber}
          onChangeSort={setCurrentSort}
          pageNumber={pageNumber}
        />
      </Spin>
    </>
  )
}

export default DataSetPage
