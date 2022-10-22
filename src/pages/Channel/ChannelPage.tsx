import React, { useState, useEffect } from 'react'
import { Col, Space, Spin, Typography } from 'antd'
import Button from 'antd-button-color'
const { Title } = Typography
import { PlusOutlined } from '@ant-design/icons'
import { Channel, ChannelForm, ChannelSort } from '../../types/channel'
import {
  useGetChannel,
  useCreateChannel,
  useUpdateChannel,
  useDeleteChannel,
} from '../../api/channel'
import { PAGES, LIMIT, DEFAULT_PAGE_SIZE } from '../../configs/constants'
import ChannelTable from './components/ChannelTable'
import ChannelFormModal from './components/ChannelFormModal'
import ConfirmationModal from '../../components/ConfirmationModal'

//got permission
import { useUser } from '../../hooks/useUser'
import { useErrorMessage } from '../../hooks/useErrorMessage'

import {
  StyledRowMenu,
  StyledColSearch,
  StyledSearch,
} from '../../components/StyledComponents'

const ChannelPage = () => {
  const { accessPermission } = useUser()
  //Permission Constant
  const channelCreate = accessPermission?.create_channels || false
  const channelEdit = accessPermission?.edit_channels || false
  const channelSetStatus = accessPermission?.set_channel_status || false

  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false)
  const [confirmationModalLoading, setConfirmationModalLoading] =
    useState<boolean>(false)
  const { errMsg, clearErrMsg } = useErrorMessage()
  const [selectedRecord, setSelectedRecord] = useState<Channel | undefined>()

  const [searchKeyword, setSearchKeyword] = useState<string>()
  const [currentSort, setCurrentSort] = useState<ChannelSort>()

  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pageSizeNumber, setPageSizeNumber] =
    useState<number>(DEFAULT_PAGE_SIZE)

  const createChannel = useCreateChannel()
  const updateChannel = useUpdateChannel()
  const deleteChannel = useDeleteChannel()

  const { data, isLoading, isRefetching } = useGetChannel({
    page: PAGES,
    limit: LIMIT,
    searchText: searchKeyword,
    sort: currentSort,
  })

  const handleCreate = () => {
    setSelectedRecord(undefined)
    handleOpenModal(true)
  }

  const handleModalLoading = (isLoading: boolean) => {
    setModalLoading(isLoading)
  }

  const handleOpenModal = (isOpen: boolean) => {
    setShowModal(isOpen)
    clearErrMsg()
  }

  const handleOpenConfirmationModal = (isOpen: boolean) => {
    setShowConfirmationModal(isOpen)
  }

  const handleEdit = (record: Channel) => {
    setSelectedRecord(record)
    handleOpenModal(true)
  }

  const handleDelete = (record: Channel) => {
    if (record.active) {
      setSelectedRecord(record)
      handleOpenConfirmationModal(true)
    } else {
      setSelectedRecord(record)
      handleConfirmationModalLoading(true)
      handleDeleteChannel(record)
    }
  }

  const handleDeleteChannel = (channel: Channel) => {
    deleteChannel.mutate(
      { id: channel.id, active: !channel.active ?? true },
      {
        onSuccess: (res) => {
          handleOpenConfirmationModal(false)
          handleConfirmationModalLoading(false)
          setPageNumber(0)
        },
        onError: () => {
          handleConfirmationModalLoading(false)
        },
      }
    )
  }

  const handleUpdateChannel = (data: ChannelForm | undefined, id: string) => {
    if (data) {
      updateChannel.mutate(
        { channelForm: data, id: id ?? '' },
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

  const handleCreateChannel = (data: ChannelForm | undefined) => {
    if (data) {
      createChannel.mutate(data, {
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

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    setPageNumber(0)
  }

  const handleConfirmationModalLoading = (isLoading: boolean) => {
    setConfirmationModalLoading(isLoading)
  }

  return (
    <>
      <Col>
        <StyledRowMenu justify="start">
          <Col span={12}>
            <Space>
              {channelCreate && (
                <Button
                  onClick={handleCreate}
                  type="success"
                  icon={<PlusOutlined />}
                >
                  Create new
                </Button>
              )}
            </Space>
          </Col>
          {showModal && (
            <ChannelFormModal
              data={selectedRecord}
              showModal={showModal}
              modalLoading={modalLoading}
              onSubmit={(data: ChannelForm | undefined, id?: string) => {
                if (id) {
                  handleUpdateChannel(data, id)
                } else {
                  handleCreateChannel(data)
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
              title={`Are you sure you would like to disable the "${
                selectedRecord?.name ?? ''
              }" channel ?`}
              description={`Disable ${selectedRecord?.name ?? ''} channel`}
              okText="Disable"
              showModal={showConfirmationModal}
              modalLoading={confirmationModalLoading}
              onOk={() => {
                if (selectedRecord?.id) {
                  handleConfirmationModalLoading(true)
                  handleDeleteChannel(selectedRecord)
                }
              }}
              onCancel={() => {
                handleOpenConfirmationModal(false)
              }}
            />
          )}
          <Space>
            <StyledColSearch span={16}>
              <StyledSearch
                placeholder="Search"
                allowClear
                loading={isRefetching}
                onSearch={handleSearch}
              />
            </StyledColSearch>
          </Space>
        </StyledRowMenu>
      </Col>
      <Spin spinning={isLoading || isRefetching || confirmationModalLoading}>
        <ChannelTable
          data={data}
          canEdit={channelEdit}
          canSetStatus={channelSetStatus}
          onEdit={handleEdit}
          onSetStatus={handleDelete}
          onChangePage={setPageNumber}
          onChangePageSize={setPageSizeNumber}
          onChangeSort={setCurrentSort}
          pageNumber={pageNumber}
        />
      </Spin>
    </>
  )
}

export default ChannelPage
