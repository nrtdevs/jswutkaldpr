import useUser from '@hooks/useUser'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import {
  useDownloadSummaryReportMutation,
  useDprImportListMutation,
  useImportSummaryMutation
} from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
import Show from '@src/utility/Show'
import { FM, formatDate, isValid, isValidArray, log } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import { stateReducer } from '@src/utility/stateReducer'
import { DprReportList } from '@src/utility/types/typeDPR'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import ScrollBar from 'react-perfect-scrollbar'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, Label, Row, Table } from 'reactstrap'

import excel from '@src/assets/images/icons/excel.png'
import classNames from 'classnames'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
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
const Report = () => {
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
  const [loadReport, { data, isError, isLoading, isSuccess }] = useDprImportListMutation()
  //   const [downloadSummaryReport, resDownload] = useDownloadSummaryReportMutation()
  const userData = useUser()

  //   const handleDownloadSummaryReport = () => {
  //     if (isValid(watch('from_date')) && isValid(watch('to_date')) && isValid(watch('vendor_id'))) {
  //       downloadSummaryReport({
  //         from_date: watch('from_date'),
  //         to_date: watch('to_date'),
  //         vendor_id: watch('vendor_id')?.value,
  //         item_desc: watch('item_desc')?.value,
  //         type: 'excel'
  //       })
  //     }
  //   }

  //   useEffect(() => {
  //     if (resDownload?.data) {
  //       window.open(resDownload?.data?.data, '_blank')
  //     }
  //   }, [resDownload?.data])

  log(data?.data, ' data')
  const load = () => {
    if (
      isValid(watch('date'))

      // isValid(watch('item_desc'))
    ) {
      loadReport({
        date: watch('date'),
        item_desc: '',
        dpr_config_id: ''
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
        date: watch('date'),
        to_date: watch('to_date'),
        vendor_id: watch('vendor_id')?.value,
        item_desc: watch('item_desc')?.value,
        type: 'log'
      })
    }
  }

  const dataArray = data?.data?.calculated?.map((a: any) => a) || []

  const typeData = dataArray?.map((a: any) => a?.type)

  const totalValue = dataArray?.reduce((sum: number, item: any) => sum + Number(item.value), 0)

  return (
    <>
      <Header onClickBack={() => nav(-1)} goBackTo title={FM('bhel-report')}></Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className='flex-1'>
              <Row className=' g-1'>
                <Col md='3'>
                  <FormGroupCustom
                    placeholder={FM('date')}
                    label={FM('date')}
                    name={'date'}
                    options={{
                      maxDate: new Date()
                    }}
                    type={'date'}
                    className='mb-2'
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
                {/* <Col md='3'>
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
                </Col> */}

                {/* <Col md='3'>
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
                </Col> */}
                <Col md='2' className=' d-flex align-items-center justify-content-center p-2'>
                  <LoadingButton loading={isLoading} color='primary' type='submit' block rounded>
                    {FM('submit')}
                  </LoadingButton>
                </Col>
              </Row>
              <Row>
                {/* <Col md='2'>
                  <Button color='primary' block rounded onClick={pdf}>
                    {FM('submit-via-log')}
                  </Button>
                </Col> */}
              </Row>
            </div>
          </CardHeader>
        </Card>
        <Show IF={isValidArray(data?.data?.calculated)}>
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

          <Card>
            {/* <div className='d-flex justify-content-end'>
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
              </div> */}
            <CardBody className='pb-0 mb-2 pt-2'>
              <ScrollBar>
                <Table bordered>
                  <thead className=''>
                    <tr>
                      {/* <th style={{ minWidth: 170 }}>{FM('sno')}</th> */}
                      <th className='' style={{ minWidth: 140 }}>
                        {FM('area')}
                      </th>
                      <th className='' style={{ minWidth: 140 }}>
                        {FM('date')} ( {data?.data?.date} )
                      </th>
                    </tr>
                  </thead>
                  {dataArray?.map((a: any, x: any) => {
                    return (
                      <>
                        <tbody>
                          <>
                            <tr>
                              <td>{a?.work_item} </td>
                              <td className='border '>{parseFloat(a?.value).toFixed(2)}</td>
                              {/* <td
                                  className={classNames('', {
                                    'text-primary cursor-pointer': isValid(getHref(a?.name)?.href),
                                    'text-danger': !isValid(getHref(a?.name)?.href)
                                  })}
                                >
                                  {isValid(a?.name) ? <a href={a?.link}>{a?.name}</a> : a?.name}
                                </td> */}
                            </tr>
                          </>
                        </tbody>
                      </>
                    )
                  })}
                  {/* <tfoot className='bg-primary'>
                    <tr>
                      <td className='border px-2  fw-bolder  text-white'>Total</td>
                      <td className='border px-2  fw-bolder  text-white '>
                        {totalValue.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot> */}
                </Table>
              </ScrollBar>
            </CardBody>
          </Card>

          {/* <Show IF={typeData[0] === null}>
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
          </Show> */}
        </Show>

        {isSuccess && !isValidArray(data?.data?.calculated) ? (
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

export default Report
