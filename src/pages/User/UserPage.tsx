import React, { useState, useEffect } from 'react'
import { Col, Row, Input, Space, Spin, Alert } from 'antd'
import Button from 'antd-button-color'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserFromModal from './components/UserFromModal'
import ExportButton from '../../components/ExportButton'
import styled from 'styled-components'
import UserTable from './components/UserTable'
import { useErrorMessage } from '../../hooks/useErrorMessage'
import { User, UserForm, UserSort, UserStatusBody } from '../../types/users'
import { downloadFileFromBlob } from '../../utils/file'
import { PAGES, LIMIT, DEFAULT_PAGE_SIZE } from '../../configs/constants'
import ConfirmationAndReasonModal from '../../components/ConfirmationAndReasonModal'

import {
  useGetUser,
  useGetUserRole,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateStatusUserMutation,
  useExportUser,
} from '../../api/users'

import { useUser } from '../../hooks/useUser'

const { Search } = Input

const StyledRow = styled(Row)`
  padding-bottom: 15px;
`

const StyledExclamationCircleOutlined = styled(ExclamationCircleOutlined)`
  font-size: 22px;
  color: #fbb437;
`

const UserPage = () => {
  //Hook Call
  const { errMsg, clearErrMsg } = useErrorMessage()
  const { accessPermission } = useUser()

  //Permission Constants
  const userCreate = accessPermission?.create_users || false
  const userEdit = accessPermission?.edit_users || false
  const userSetStatus = accessPermission?.set_users_status || false
  const userExport = accessPermission?.export_users || false
  const userSearch = accessPermission?.search_users || false

  //Use State
  //Create and Edit Modal States
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)
  //State For Get API
  const [searchKeyword, setSearchKeyword] = useState<string>()
  const [currentSort, setCurrentSort] = useState<UserSort>()

  //pagination
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageSizeNumber, setPageSizeNumber] =
    useState<number>(DEFAULT_PAGE_SIZE)
  //State For Export
  const [exportType, setExportType] = useState<string>()
  const [isExport, setIsExport] = useState<boolean>(false)
  //State For Confirmation Modal
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false)
  const [confirmationModalLoading, setConfirmationModalLoading] =
    useState<boolean>(false)
  //Record and Status for Update API
  const [selectedRecord, setSelectedRecord] = useState<User>()
  const [toStatus, setToStatus] = useState<boolean>(false)
  //Error States
  const [isStatusError, setStatusError] = useState<boolean>(false)
  const [frontEndErr, setFrontEndErr] = useState<string>()

  //Reason when inactive
  const [reasonText, setReasonText] = useState<string>()

  //API GET callin
  const { data, isLoading, isRefetching } = useGetUser({
    page: pageNumber,
    limit: pageSizeNumber,
    searchText: searchKeyword,
    sort: currentSort,
  })
  const {
    data: userRolesData,
    isLoading: isUserRoleLoading,
    isRefetching: isUserRoleRefetching,
  } = useGetUserRole()

  const {
    data: dataExportFile,
    isLoading: isLoadingExportFile,
    isRefetching: isRefetchingExportFile,
    isError: isErrorExportFile,
  } = useExportUser({
    type: exportType,
    page: PAGES,
    limit: LIMIT,
    searchText: searchKeyword,
    isExport: isExport,
  })

  //Mutation
  const createUser = useCreateUserMutation()
  const updateUser = useUpdateUserMutation()
  const updateStatusUser = useUpdateStatusUserMutation()

  //Function
  //Show and Search Function
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    setPageNumber(0)
  }

  //Create and Edit Modal Functon
  const handleOpenModal = (isOpen: boolean) => {
    clearErrMsg()
    setShowModal(isOpen)
  }
  const handleModalLoading = (isLoading: boolean) => {
    setModalLoading(isLoading)
  }
  //Create User Function
  const handleCreateUser = (data: UserForm | undefined) => {
    if (data) {
      createUser.mutate(data, {
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

  const handleCreate = () => {
    setSelectedRecord(undefined)
    handleOpenModal(true)
  }
  //Update User Function
  const handleUpdateUser = (data: UserForm | undefined, id: string) => {
    if (data && id) {
      updateUser.mutate(
        { userForm: data, id: id },
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

  const handleEdit = (record: User) => {
    setSelectedRecord(record)
    handleOpenModal(true)
  }
  //Status Update User Function
  const handleStatus = (record: User | undefined, active: boolean) => {
    setShowConfirmationModal(true)
    setSelectedRecord(record)
    setToStatus(active)
  }

  const handleUpdateStatus = (
    id: string | undefined,
    active: boolean,
    reason: string | undefined
  ) => {
    const body: UserStatusBody = {
      reason: reason ?? '',
    }
    if (id) {
      setConfirmationModalLoading(true)
      updateStatusUser.mutate(
        { body: body, id: id, active: active },
        {
          onSuccess: () => {
            setSelectedRecord(undefined)
            setConfirmationModalLoading(false)
            setShowConfirmationModal(false)
            setPageNumber(0)
          },
          onError: () => {
            setStatusError(true)
            setConfirmationModalLoading(false)
            setSelectedRecord(undefined)
            setShowConfirmationModal(false)
          },
        }
      )
    } else {
      setShowConfirmationModal(false)
    }
  }
  //Export Function
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
      success = downloadFileFromBlob(dataExportFile, 'users', exportType)
    }
    if (success) {
      setIsExport(false)
    } else if (conditionPass) {
      // ดักเคสเพราะเหมือน export all จะถูกเรียกใช้ตลอดเวลา ทำให้ถ้าไม่ดักมันจะขึ้น error ทันทีที่เปิดหน้าครับ
      setFrontEndErr('Frontend Error: Cannot downloadfile to your computer')
      setIsExport(false)
    }
  }
  useEffect(() => {
    handleDownloadFile()
  }, [isExport, exportType, dataExportFile])

  return (
    <>
      <StyledRow>
        <Col span={18}>
          <Space>
            {userCreate && (
              <Button
                type="success"
                onClick={() => {
                  handleCreate()
                }}
              >
                <PlusOutlined />
                Create User
              </Button>
            )}
            {userExport && (
              <ExportButton
                title="Export User"
                isLoading={isLoadingExportFile || isRefetchingExportFile}
                onExport={(isExport: boolean, type: string) => {
                  handleExport(isExport, type)
                }}
              />
            )}
          </Space>
        </Col>
        <Col span={6}>
          {userSearch && (
            <Search placeholder="Search" allowClear onSearch={handleSearch} />
          )}
        </Col>
      </StyledRow>
      {showModal && (
        <UserFromModal
          data={selectedRecord}
          userRolesData={userRolesData ?? undefined}
          isModalLoading={
            isUserRoleLoading || isUserRoleRefetching || modalLoading
          }
          showModal={showModal}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onCloseModal={() => handleOpenModal(false)}
          onLoadingModal={setModalLoading}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationAndReasonModal
          title={`Are you sure you would like to change status user "${
            selectedRecord?.name ? selectedRecord?.name : ''
          }" ?`}
          description={`${
            selectedRecord?.name ? selectedRecord?.name : 'User'
          }'s status will change to ${toStatus ? 'active' : 'inactive'}. ${
            !toStatus
              ? `Please specify the reason for disabling User ${
                  selectedRecord?.name ? selectedRecord?.name : 'name not found'
                } (${
                  selectedRecord?.employee_id ? selectedRecord?.employee_id : ''
                }).`
              : ''
          }`}
          icon={<StyledExclamationCircleOutlined />}
          okText="Change"
          cancelText="Cancel"
          showModal={showConfirmationModal}
          modalLoading={confirmationModalLoading}
          requireReason={!toStatus}
          okType="primary"
          setReasonText={setReasonText}
          onOk={() => {
            handleUpdateStatus(selectedRecord?.id, toStatus, reasonText)
          }}
          onCancel={() => {
            setShowConfirmationModal(false)
          }}
        />
      )}
      {isStatusError && (
        <Alert
          type="error"
          message={errMsg}
          closable
          banner
          onClose={() => {
            clearErrMsg()
            setStatusError(false)
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
      <Spin
        spinning={
          isLoading || isRefetching || isUserRoleLoading || isUserRoleRefetching
        }
      >
        <UserTable
          data={data}
          userRole={userRolesData ?? undefined}
          canEdit={userEdit}
          canSetStatus={userSetStatus}
          onEdit={handleEdit}
          onSetStatus={handleStatus}
          onChangePage={setPageNumber}
          onChangePageSize={setPageSizeNumber}
          onChangeSort={setCurrentSort}
          pageNumber={pageNumber}
        />
      </Spin>
    </>
  )
}
export default UserPage
