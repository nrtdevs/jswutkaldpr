/* eslint-disable no-mixed-operators */
import ConfirmAlert from '@hooks/ConfirmAlert'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import CustomDataTable, {
  TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import DropDownMenu from '@src/modules/common/components/dropdown'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import CenteredModal from '@src/modules/common/components/modal/CenteredModal'
import { IconSizes } from '@src/utility/Const'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { Permissions } from '@src/utility/Permissions'
import Show from '@src/utility/Show'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import { emitAlertStatus, FM, formatDate, isValid, log, truncateText } from '@src/utility/Utils'
import { useContext, useEffect, useReducer, useState } from 'react'
import { TableColumn } from 'react-data-table-component'
import { Edit, Mail, MoreVertical, Plus, RefreshCcw, Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'
import { useGetSettingMutation } from '../../redux/RTKQuery/ProfileRTK'
import {
  useCreateOrUpdateReportEmailMutation,
  useDeleteReportEmailByIdMutation,
  useEmailTriggerMutation,
  useLoadReportEmailMutation,
  useUpdateEmailMutation
} from '../../redux/RTKQuery/ReportEmailRTK'

interface States {
  page?: any
  per_page_record?: any
  search?: any
  reload?: any
  modal?: boolean

  showModal?: boolean
  rowData?: any
  isAddingNewData?: boolean
  lastRefresh?: any
  filterData?: DPR | any
}
function ReportsEmail() {
  const { colors } = useContext(ThemeColors)
  // Local States
  const initState: States = {
    page: 1,
    showModal: false,
    rowData: null,
    per_page_record: 40,
    search: '',
    modal: false,
    filterData: null,
    lastRefresh: new Date().getTime()
  }
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  // Load Store Data
  const form = useForm<any>()
  const [loadItem, { data, originalArgs, isLoading, isSuccess }] = useLoadReportEmailMutation()
  const [deleteReportEmail, resultDelete] = useDeleteReportEmailByIdMutation()
  const [createReportEmail, resultCreate] = useCreateOrUpdateReportEmailMutation()
  const [showModal, setShowModal] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [updateEmail, resultUpdate] = useUpdateEmailMutation()
  const [emailTrigger, resultEmailTrigger] = useEmailTriggerMutation()

  const [loadSetting, resultData] = useGetSettingMutation()

  const appData = resultData?.data
  //   log(appData, 'appData')

  const [triggerValue, setTriggerValue] = useState(false)
  const handlePageChange = (e: TableFormData) => {
    setState({ ...e, filterData: null })
  }

  //   log(triggerValue, 'triggerValue')

  useEffect(() => {
    loadSetting({})
  }, [])

  useEffect(() => {
    loadItem({
      jsonData: {
        name: isValid(state?.search) ? state.search : state?.filterData?.name,
        ...state?.filterData
      },
      page: state?.page,
      per_page_record: state?.per_page_record
    })
  }, [
    state?.search,
    state?.page,
    state?.per_page_record,
    state.lastRefresh,
    state?.filterData,
    resultCreate?.isSuccess,
    resultUpdate?.isSuccess
  ])

  const reloadData = () => {
    setState({
      lastRefresh: new Date().getTime()
    })
  }

  const triggerData = () => {
    emailTrigger({
      eventId: 'enbl-1234-12'
    })
  }

  const handleDelete = (id?: any, eventId?: any) => {
    if (isValid(id)) {
      deleteReportEmail({
        id,
        eventId
      })
    }
  }

  // delete item success
  useEffect(() => {
    if (resultDelete?.isLoading === false) {
      if (resultDelete?.isSuccess) {
        emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
      } else if (resultDelete?.error) {
        emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
      }
    }
  }, [resultDelete])

  useEffect(() => {
    form.setValue('email', state.rowData?.email)
  }, [state?.rowData])

  useEffect(() => {
    if (resultCreate?.isSuccess) {
      setState({
        modal: false,
        rowData: null
      })
    }
    if (resultUpdate?.isSuccess) {
      loadSetting({})
    }
  }, [resultCreate, resultUpdate])

  useEffect(() => {
    if (resultEmailTrigger?.isSuccess) {
      emitAlertStatus('success', null, resultEmailTrigger?.originalArgs?.eventId)
      toast.success('Email Trigger SuccessFully')

      //   setTriggerValue(false)
      //   form.resetField('execution_time')
      //   loadSetting({})
    }
  }, [resultEmailTrigger])
  const columns: TableColumn<DPR>[] = [
    {
      name: '#',
      minWidth: '50px',
      cell: (row, index: any) => {
        return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
      }
    },
    {
      name: FM('email'),
      sortable: true,
      minWidth: '200px',
      id: 'email',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold text-primary '>{row?.email ?? 'N/A'} </span>
          </div>
        </div>
      )
    },

    {
      name: FM('created-at'),
      sortable: true,
      minWidth: '200px',
      id: 'created_at',
      cell: (row) => (
        <div className='d-flex align-items-center'>
          <div className='user-info'>
            <span className='d-block fw-bold'>{formatDate(row?.created_at, 'DD MMM YYYY')}</span>
          </div>
        </div>
      )
    },

    {
      name: <>{FM('actions')}</>,
      allowOverflow: true,
      minWidth: '150px',
      cell: (row) => {
        return (
          <div className='d-flex '>
            <DropDownMenu
              direction='up'
              component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
              options={[
                {
                  IF: Permissions.itemDescriptionEdit,
                  icon: <Edit size={14} />,
                  state: row,
                  onClick: (e: any) => {
                    setState({
                      // filterData: e,

                      modal: true,
                      rowData: {
                        email: row?.email,
                        id: row?.id
                      }
                    })
                  },
                  name: FM('edit')
                },

                {
                  IF: Permissions.projectDelete,
                  noWrap: true,
                  name: (
                    <ConfirmAlert
                      menuIcon={<Trash2 size={14} />}
                      onDropdown
                      eventId={`delete-item-${row?.id}`}
                      item={row}
                      title={truncateText(`${row?.email}`, 50)}
                      color='text-warning'
                      onClickYes={() => handleDelete(row?.id, `delete-item-${row?.id}`)}
                      onSuccessEvent={(e: any) => {
                        reloadData()
                      }}
                      className=''
                      id={`grid-delete-${row?.id}`}
                    >
                      {FM('delete')}
                    </ConfirmAlert>
                  )
                }
              ]}
            />
          </div>
        )
      }
    }
  ]

  const handleSort = (column: any, dir: string) => {
    setState({
      filterData: {
        ...state.filterData,
        sort: {
          column: column?.id,
          dir:
            originalArgs?.jsonData?.sort?.column === column?.id
              ? originalArgs?.jsonData?.sort?.dir === 'asc'
                ? 'desc'
                : 'asc'
              : dir
        }
      }
    })
  }

  const onSubmit = (data: any) => {
    if (isValid(state?.rowData?.id)) {
      createReportEmail({
        ...data,
        id: state?.rowData?.id
      })
    } else {
      createReportEmail(data)
    }
  }

  const renderCreateModal = () => {
    return (
      <CenteredModal
        scrollControl={false}
        modalClass='modal-sm'
        open={state.modal}
        // disableFooter
        handleModal={() =>
          setState({
            modal: !state.modal,
            filterData: null
          })
        }
        handleSave={form.handleSubmit(onSubmit)}
        title={isValid(state?.rowData) ? FM('update-report-email') : FM('create-report-email')}
      >
        <form>
          <Container>
            <Row>
              <Col md={12}>
                <FormGroupCustom
                  key={`${state.rowData?.email}-email`}
                  name={'email'}
                  label={FM('email')}
                  onRegexValidation={{
                    form: form,
                    fieldName: 'email'
                  }}
                  type={'email'}
                  className='mb-2'
                  control={form.control}
                  rules={{ required: true }}
                />
              </Col>
            </Row>
          </Container>
        </form>
      </CenteredModal>
    )
  }

  const [loadingData, setLoading] = useState(false)

  const onSubmitData = async (data: any) => {
    const subData = {
      automation_email_trigger: triggerValue,
      execution_time: data?.execution_time
    }

    try {
      setLoading(true) // 👈 start loader

      const response = await updateEmail(subData) // 👈 wait for API

      // agar success aaya
      //   console.log('✅ API Success:', response)
    } catch (error) {
      //   console.error('❌ API Error:', error)
    } finally {
      setLoading(false) // 👈 stop loader always
    }
  }

  useEffect(() => {
    form.setValue('execution_time', appData?.data?.execution_time)
    if (appData?.data?.automation_email_trigger === 1) {
      setTriggerValue(true)
    }
  }, [appData, form.setValue])
  //filter data
  //   const onSubmitData = (data: any) => {
  //     const subData = {
  //       automation_email_trigger: triggerValue,
  //       execution_time: data?.execution_time
  //     }
  //     updateEmail(subData)
  //   }

  return (
    <>
      {renderCreateModal()}
      <Header icon={<Mail size='25' />} title={FM('dpr-report-emails')}>
        {/* <LoadingButton
          color='primary'
          size='sm'
          loading={resultEmailTrigger?.isLoading}
          className='me-2'
          onClick={triggerData}
        >
          {FM('email-trigger')}
        </LoadingButton> */}
        <ConfirmAlert
          title='Email Trigger Confirmation'
          text='Are You Sure You Want to sent Automation OverAll Report '
          eventId='enbl-1234-12'
          //   confirmButtonText='yes-send'
          enableNo={false}
          onClickYes={() => triggerData()} // ✅ only run if confirmed
          onClickNo={() => console.log('❌ Cancelled')}
        >
          <LoadingButton
            color='primary'
            size='sm'
            loading={resultEmailTrigger?.isLoading}
            className='me-2'
          >
            {FM('email-trigger')}
          </LoadingButton>
        </ConfirmAlert>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.itemDescriptionCreate}>
            <LoadingButton
              title={FM('create-new')}
              color='primary'
              size='sm'
              loading={false}
              onClick={() => {
                setState({ modal: !state.modal, rowData: null })
                form.reset()
              }}
            >
              <Plus size='14' />
            </LoadingButton>
          </Show>
          <LoadingButton
            title={FM('reload')}
            loading={isLoading}
            size='sm'
            color='secondary'
            onClick={reloadData}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <Form onSubmit={form.handleSubmit(onSubmitData)}>
        <Row className='mt-2 px-1'>
          <Card>
            <CardBody>
              <Row>
                <Col md={4}>
                  <FormGroup switch>
                    <Input
                      type='switch'
                      checked={triggerValue}
                      onClick={() => setTriggerValue(!triggerValue)}
                    />
                    <Label check className='ms-2'>
                      {FM('enable-execution-time')}
                    </Label>
                  </FormGroup>
                </Col>
                {/* {triggerValue === true && (
                  <> */}
                {triggerValue === true && (
                  <Col md={4}>
                    <FormGroupCustom
                      key={`${appData?.data?.execution_time}-execution_time`}
                      placeholder={FM('execution-time')}
                      label={FM('execution-time')}
                      noGroup
                      noLabel
                      isDisabled={true}
                      name={'execution_time'}
                      //   options={{
                      //     maxDate: new Date()
                      //   }}
                      type={'time'}
                      className=''
                      control={form.control}
                      rules={{ required: false }}
                    />
                  </Col>
                )}

                <Col md='2' className=' d-flex justify-content-start'>
                  <LoadingButton loading={loadingData} size='sm' color='primary' type='submit'>
                    {FM('submit')}
                  </LoadingButton>
                </Col>
                {/* </>
                )} */}
              </Row>
            </CardBody>
          </Card>
        </Row>
      </Form>
      <CustomDataTable<DPR>
        initialPerPage={40}
        isLoading={isLoading}
        onSort={handleSort}
        defaultSortField={originalArgs?.jsonData?.sort}
        columns={columns}
        paginatedData={data}
        handlePaginationAndSearch={handlePageChange}
      />
    </>
  )
}
export default ReportsEmail
