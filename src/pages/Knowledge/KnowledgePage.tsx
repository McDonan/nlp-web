import React, { useEffect, useState } from 'react'
import { Col, Space, Spin, Alert } from 'antd'
import Button from 'antd-button-color'
import { PlusOutlined } from '@ant-design/icons'
import {
  useKnowledge,
  useExportKnowledge,
  useCreateKnowledgeMutation,
  useUpdateKnowledgeMutation,
  useDeleteKnowledgeMutation,
} from '../../api/knowledge'
import { downloadFileFromBlob } from '../../utils/file'
import KnowledgeTable from './components/KnowledgeTable'
import KnowledgeFormModal from './components/KnowledgeFormModal'
import { KnowledgeForm, Knowledge, KnowledgeSort } from '../../types/knowledge'
import ConfirmationModal from '../../components/ConfirmationModal'
import ExportButton from '../../components/ExportButton'
import {
  PAGES,
  LIMIT,
  DEFAULT_PAGE_SIZE,
  ErrorCode,
} from '../../configs/constants'
//got permission
import { useUser } from '../../hooks/useUser'
import { useErrorMessage } from '../../hooks/useErrorMessage'

import {
  StyledRowMenu,
  StyledColSearch,
  StyledSearch,
} from '../../components/StyledComponents'

const KnowledgePage = (): JSX.Element => {
  //Got Userpermission
  const { accessPermission } = useUser()
  //Permission Constants
  const knowledgeCreate = accessPermission?.create_knowledge || false
  const knowledgeEdit = accessPermission?.edit_knowledge || false
  const knowledgeDelete = accessPermission?.delete_knowledge || false
  const knowledgeSearch = accessPermission?.search_knowledge || false

  const [searchKeyword, setSearchKeyword] = useState<string>()
  const [currentSort, setCurrentSort] = useState<KnowledgeSort>()

  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageSizeNumber, setPageSizeNumber] =
    useState<number>(DEFAULT_PAGE_SIZE)
  //export states
  const [isExport, setIsExport] = useState<boolean>(false)
  const [exportType, setExportType] = useState<string>()

  //error states
  const [frontEndErr, setFrontEndErr] = useState<string>()
  const { errMsg, clearErrMsg } = useErrorMessage()

  const { data, isLoading, isRefetching } = useKnowledge({
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
  } = useExportKnowledge({
    type: exportType,
    page: PAGES,
    limit: LIMIT,
    searchText: searchKeyword,
    isExport: isExport,
  })

  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false)
  const [confirmationModalLoading, setConfirmationModalLoading] =
    useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<Knowledge | undefined>()

  const createKnowledge = useCreateKnowledgeMutation()
  const updateKnowledge = useUpdateKnowledgeMutation()
  const deleteKnowledge = useDeleteKnowledgeMutation()

  const handleOpenModal = (isOpen: boolean) => {
    setShowModal(isOpen)
    clearErrMsg()
  }

  const handleModalLoading = (isLoading: boolean) => {
    setModalLoading(isLoading)
  }

  const handleOpenConfirmationModal = (isOpen: boolean) => {
    setShowConfirmationModal(isOpen)
  }

  const handleConfirmationModalLoading = (isLoading: boolean) => {
    setConfirmationModalLoading(isLoading)
  }

  const handleCreate = () => {
    setSelectedRecord(undefined)
    handleOpenModal(true)
  }

  const handleEdit = (record: Knowledge) => {
    setSelectedRecord(record)
    handleOpenModal(true)
  }

  const handleDelete = (record: Knowledge) => {
    setSelectedRecord(record)
    handleOpenConfirmationModal(true)
  }

  const handleCreateKnowledge = (data: KnowledgeForm | undefined) => {
    if (data) {
      createKnowledge.mutate(data, {
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

  const handleUpdateKnowledge = (
    data: KnowledgeForm | undefined,
    id: string
  ) => {
    if (data) {
      updateKnowledge.mutate(
        { knowledgeForm: data, id: id ?? '' },
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

  const handleDeleteKnowledge = (id: string) => {
    deleteKnowledge.mutate(id, {
      onSettled: () => {
        handleOpenConfirmationModal(false)
        handleConfirmationModalLoading(false)
      },
    })
  }

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    setPageNumber(0)
  }

  const handleExport = (isExport: boolean, type: string) => {
    clearErrMsg()
    setIsExport(isExport)
    setExportType(type)
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
      success = downloadFileFromBlob(dataExportFile, 'knowledge', exportType)
    }

    if (success) {
      setIsExport(false)
    } else if (conditionPass) {
      // ดักเคสเพราะเหมือน export all จะถูกเรียกใช้ตลอดเวลา ทำให้ถ้าไม่ดักมันจะขึ้น error ทันทีที่เปิดหน้าครับ
      setFrontEndErr(`${ErrorCode.DOWNLOADFAIL}`)
      setIsExport(false)
    }
  }

  useEffect(() => {
    handleDownloadFile()
  }, [isExport, exportType, dataExportFile])

  return (
    <div>
      <Col>
        <StyledRowMenu justify="start">
          <Col span={8}>
            <Space>
              {knowledgeCreate && (
                <Button
                  onClick={handleCreate}
                  type="success"
                  icon={<PlusOutlined />}
                >
                  Create
                </Button>
              )}
              <ExportButton
                title="Export Knowledge"
                isLoading={isLoadingExportFile || isRefetchingExportFile}
                onExport={(isExport: boolean, type: string) => {
                  handleExport(isExport, type)
                }}
              />
            </Space>

            {showModal && (
              <KnowledgeFormModal
                data={selectedRecord}
                showModal={showModal}
                modalLoading={modalLoading}
                onSubmit={(data: KnowledgeForm | undefined, id?: string) => {
                  if (id) {
                    handleUpdateKnowledge(data, id)
                  } else {
                    handleCreateKnowledge(data)
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
                  selectedRecord?.name ? selectedRecord?.name : ''
                }" knowledge ?`}
                description="All reference of this knowledge will be deleted too."
                okText="Delete"
                showModal={showConfirmationModal}
                modalLoading={confirmationModalLoading}
                onOk={() => {
                  if (selectedRecord?.id) {
                    handleConfirmationModalLoading(true)
                    handleDeleteKnowledge(selectedRecord?.id)
                  }
                }}
                onCancel={() => {
                  handleOpenConfirmationModal(false)
                }}
              />
            )}
          </Col>
          <StyledColSearch span={16}>
            {knowledgeSearch && (
              <StyledSearch
                placeholder="Search"
                allowClear
                loading={isRefetching}
                onSearch={handleSearch}
              />
            )}
          </StyledColSearch>
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
        <KnowledgeTable
          onEdit={handleEdit}
          canEdit={knowledgeEdit}
          canDelete={knowledgeDelete}
          onDelete={handleDelete}
          data={data}
          onChangePage={setPageNumber}
          onChangePageSize={setPageSizeNumber}
          onChangeSort={setCurrentSort}
          pageNumber={pageNumber}
        />
      </Spin>
    </div>
  )
}

export default KnowledgePage
