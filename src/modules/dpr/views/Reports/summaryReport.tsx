import useUser from '@hooks/useUser'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import {
  useDownloadSummaryReportMutation,
  useImportSummaryMutation
} from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
import Show from '@src/utility/Show'
import { FM, formatDate, isValid, isValidArray } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import { stateReducer } from '@src/utility/stateReducer'
import { DprReportList } from '@src/utility/types/typeDPR'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import ScrollBar from 'react-perfect-scrollbar'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, Row, Table } from 'reactstrap'

import excel from '@src/assets/images/icons/excel.png'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import classNames from 'classnames'
import { Download } from 'react-feather'

interface States {
  page?: any
  per_page_record?: any
  changeObject?: any
  search?: any
  reload?: any
  logFilter?: boolean
  isRemoving?: boolean
  isReloading?: boolean
  isAddingNewData?: boolean
  transactionFilter?: boolean
  filterData?: any
  lastRefresh?: any
  edit?: any
  selectedItem?: any
}
const SummaryReport = () => {
  const initState: States = {
    page: 1,
    lastRefresh: new Date().getTime(),
    per_page_record: 15,
    changeObject: null,
    transactionFilter: false,
    filterData: null,
    search: undefined,
    isRemoving: false,
    isReloading: false,
    isAddingNewData: false
  }

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<DprReportList>()
  const nav = useNavigate()
  const [loadingSample, setLoadingSample] = useState(false)
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  const [loadReport, { data, isError, isLoading, isSuccess }] = useImportSummaryMutation()
  const [downloadSummaryReport, resDownload] = useDownloadSummaryReportMutation()
  const userData = useUser()

  const handleDownloadSummaryReport = () => {
    if (isValid(watch('from_date')) && isValid(watch('to_date')) && isValid(watch('vendor_id'))) {
      downloadSummaryReport({
        from_date: watch('from_date'),
        to_date: watch('to_date'),
        vendor_id: watch('vendor_id')?.value,
        item_desc: watch('item_desc')?.value,
        type: 'excel'
      })
    }
  }

  useEffect(() => {
    if (resDownload?.data) {
      window.open(resDownload?.data?.data, '_blank')
    }
  }, [resDownload?.data])
  const load = () => {
    if (
      isValid(watch('from_date')) &&
      isValid(watch('to_date')) &&
      isValid(watch('vendor_id'))
      // isValid(watch('item_desc'))
    ) {
      loadReport({
        from_date: watch('from_date'),
        to_date: watch('to_date'),
        vendor_id: watch('vendor_id')?.value,
        item_desc: watch('item_desc')?.value,
        type: null
      })
    }
  }

  useEffect(() => {
    load()
  }, [state?.lastRefresh])

  const onSubmit = (d: any) => {
    load()
  }

  const getHref = (htmlString: any) => {
    const parser = new DOMParser()
    const doc = parser?.parseFromString(htmlString, 'text/html')
    const tag: any = doc?.querySelector('a')
    const href = tag?.getAttribute('href')
    const tagText = tag?.textContent

    if (!isValid(href)) return { href: null, tagText: htmlString }
    else return { href, tagText }
  }

  const pdf = () => {
    if (isValid(watch('from_date')) && isValid(watch('to_date')) && isValid(watch('vendor_id'))) {
      loadReport({
        from_date: watch('from_date'),
        to_date: watch('to_date'),
        vendor_id: watch('vendor_id')?.value,
        item_desc: watch('item_desc')?.value,
        type: 'log'
      })
    }
  }

  const dataArray = data?.data?.map((a: any) => a) || []

  const typeData = dataArray?.map((a: any) => a?.type)

  return (
    <>
      <Header onClickBack={() => nav(-1)} goBackTo title={FM('summary-report')}></Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className='flex-1'>
              <Row className=' g-1'>
                <Col md='3'>
                  <FormGroupCustom
                    placeholder={FM('from-date')}
                    label={FM('from-date')}
                    name={'from_date'}
                    options={{
                      maxDate: new Date()
                    }}
                    type={'date'}
                    className='mb-2'
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='3'>
                  <FormGroupCustom
                    placeholder={FM('to-date')}
                    label={FM('to-date')}
                    name={'to_date'}
                    options={{
                      minDate: watch('from_date')
                    }}
                    type={'date'}
                    className='mb-2'
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='3'>
                  <FormGroupCustom
                    label={FM('vendor-name')}
                    name={'vendor_id'}
                    type={'select'}
                    className='mb-2'
                    placeholder='Vendor Name'
                    path={ApiEndpoints.list_vendor}
                    selectLabel='name'
                    // onOptionData={(data: any[]) => {
                    //   return data?.map((a: any) => {
                    //     return {
                    //       ...a,
                    //       name_X_work_package: `${a?.vendor_name} - ${a?.work_package_name}`
                    //     }
                    //   })
                    // }}
                    selectValue={'id'}
                    isClearable
                    async
                    defaultOptions
                    loadOptions={loadDropdown}
                    control={control}
                    rules={{
                      required: true
                    }}
                  />
                </Col>

                <Col md='3'>
                  <FormGroupCustom
                    label={FM('item-desc')}
                    name={'item_desc'}
                    type={'select'}
                    placeholder={FM('item-desc')}
                    path={ApiEndpoints.list_item}
                    selectLabel='title'
                    className='mb-2'
                    selectValue={'id'}
                    isClearable
                    async
                    defaultOptions
                    loadOptions={loadDropdown}
                    control={control}
                    rules={{
                      required: true
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md='2'>
                  <Button color='primary' type='submit' block rounded>
                    {FM('submit')}
                  </Button>
                </Col>
                <Col md='2'>
                  <Button color='primary' block rounded onClick={pdf}>
                    {FM('submit-via-log')}
                  </Button>
                </Col>
              </Row>
            </div>
          </CardHeader>
        </Card>
        <Show IF={isValidArray(data?.data)}>
          <Show IF={isLoading}>
            <Row className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Shimmer style={{ height: 320 }} />
                  </Row>
                </CardBody>
              </Card>
            </Row>
          </Show>
          <Show IF={typeData[0] !== null}>
            <Card>
              <div className='d-flex justify-content-end'>
                <LoadingButton
                  tooltip={FM('download-excel')}
                  loading={resDownload?.isLoading}
                  color='primary'
                  onClick={handleDownloadSummaryReport}
                  className='btn-md m-1'
                >
                  <Download size={15} />
                  <span className='ms-25'>{FM('download-excel')}</span>
                </LoadingButton>
              </div>
              <CardBody className='pb-0 mb-2 pt-2'>
                <ScrollBar>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th style={{ minWidth: 170 }}>{FM('sno')}</th>
                        <th style={{ minWidth: 140 }}>{FM('date')}</th>
                        <th style={{ minWidth: 140 }}>{FM('action')}</th>
                      </tr>
                    </thead>
                    {dataArray?.map((a: any, x: any) => {
                      return (
                        <>
                          <tbody>
                            <>
                              <tr>
                                <td>{x + 1} </td>
                                <td>{formatDate(a?.date, 'DD MMM YYYY') ?? 'N/A'}</td>
                                <td
                                  className={classNames('', {
                                    'text-primary cursor-pointer': isValid(getHref(a?.name)?.href),
                                    'text-danger': !isValid(getHref(a?.name)?.href)
                                  })}
                                >
                                  {isValid(a?.name) ? <a href={a?.link}>{a?.name}</a> : a?.name}
                                </td>
                              </tr>
                            </>
                          </tbody>
                        </>
                      )
                    })}
                  </Table>
                </ScrollBar>
              </CardBody>
            </Card>
          </Show>
          <Show IF={typeData[0] === null}>
            <Card>
              <CardBody>
                <Row>
                  {dataArray?.map((a: any, x: any) => {
                    return (
                      <Col
                        md='2'
                        onClick={() =>
                          isValid(getHref(a?.name)?.href)
                            ? window.open(getHref(a?.name)?.href, '_blank')
                            : ''
                        }
                      >
                        <img
                          className={classNames('mb-1', {
                            'text-primary cursor-pointer': isValid(getHref(a?.name)?.href),
                            'text-secondary': !isValid(getHref(a?.name)?.href)
                          })}
                          src={excel}
                          alt=''
                        />
                        <div
                          className={classNames('mb-1', {
                            'text-primary cursor-pointer': isValid(getHref(a?.name)?.href),
                            'text-secondary': !isValid(getHref(a?.name)?.href)
                          })}
                        >
                          {getHref(a?.name).tagText}
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </CardBody>
            </Card>
          </Show>
        </Show>

        {isSuccess && !isValidArray(data?.data) ? (
          <Card>
            <CardBody className=''>
              <Row className='px-2 fw-bolder'>
                There are no records to display. Please select the correct Date.
              </Row>
            </CardBody>
          </Card>
        ) : (
          ''
        )}
      </Form>
    </>
  )
}

export default SummaryReport
