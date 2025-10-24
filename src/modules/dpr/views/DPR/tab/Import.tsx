import useUser from '@hooks/useUser'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import {
  useImportSummaryMutation,
  useLoadImportActionMutation
} from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
import Show from '@src/utility/Show'
import {
  FM,
  emitAlertStatus,
  formatDate,
  isValid,
  isValidArray,
  log,
  truncateText
} from '@src/utility/Utils'

import { stateReducer } from '@src/utility/stateReducer'
import { DprReportList } from '@src/utility/types/typeDPR'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import ScrollBar from 'react-perfect-scrollbar'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Label, Row, Table } from 'reactstrap'
import ConfirmAlert from '@hooks/ConfirmAlert'
import excel from '@src/assets/images/icons/excel.png'
import classNames from 'classnames'

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
const DPRUpload = () => {
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
  const params = useParams()
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<DprReportList>()
  const nav = useNavigate()
  const [loadingSample, setLoadingSample] = useState(false)
  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  const [loadReport, { data, isError, isLoading, isSuccess }] = useImportSummaryMutation()
  const [deleteImport, resDelete] = useLoadImportActionMutation()
  const userData = useUser()

  const load = () => {
    if (
      isValid(watch('from_date')) &&
      isValid(watch('to_date'))
      // isValid(watch('vendor_id')) &&
      // isValid(watch('item_desc'))
    ) {
      loadReport({
        from_date: watch('from_date'),
        to_date: watch('to_date'),
        // vendor_id: watch('vendor_id')?.value,
        // item_desc: watch('item_desc')?.label,
        type: 'delete'
      })
    }
  }

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
  const handleDelete = (id: any, eventId: any, date: any, d: any) => {
    deleteImport({
      jsonData: {
        action: 'delete',
        // id: d?.id,
        // dpr_config_id: id,
        item_dec: d?.item_dec,
        random_no: d?.random_no,
        date: date
      },
      id,
      eventId,
      originalArgs: resDelete?.originalArgs
    })
  }

  const pdf = () => {
    if (
      isValid(watch('from_date')) &&
      isValid(watch('to_date')) &&
      params?.id
      // isValid(watch('item_desc'))
    ) {
      loadReport({
        from_date: watch('from_date'),
        to_date: watch('to_date'),
        dpr_config_id: params?.id,
        //   vendor_id: watch('vendor_id')?.value,
        //  item_desc: watch('item_desc')?.label,
        type: 'delete'
      })
    }
  }

  useEffect(() => {
    pdf()
  }, [state?.lastRefresh, resDelete?.isSuccess, params, watch('from_date'), watch('to_date')])

  useEffect(() => {
    if (resDelete?.isLoading === false) {
      if (resDelete?.isSuccess) {
        emitAlertStatus('success', null, resDelete?.originalArgs?.eventId)
      } else if (resDelete?.error) {
        emitAlertStatus('failed', null, resDelete?.originalArgs?.eventId)
      }
    }
  }, [resDelete])

  // useEffect(() => {
  //     setValue('vendor_id', '')
  //     setValue('item_desc', '')
  // }, [watch('from_date') || watch('to_date')])

  // Extract the keys (table headers) from the first data item
  const dataArray = data?.data?.map((a: any) => a) || []

  const typeData = dataArray?.map((a: any) => a?.type)

  return (
    <>
      {/* <Header onClickBack={() => nav(-1)} goBackTo title={FM('summary-report')}></Header> */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className='flex-1'>
              <Row className=' g-1'>
                <Col md='4'>
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
                <Col md='4'>
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
                {/* <Col md='3'>
                                    <FormGroupCustom

                                        label={FM('vendor-name')}
                                        name={'vendor_id'}
                                        type={'select'}

                                        className="mb-2"

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
                                </Col> */}

                {/* <Col md='3'>
                                    <FormGroupCustom

                                        label={FM('item-desc')}
                                        name={'item_desc'}
                                        type={'select'}

                                        placeholder={FM('item-desc')}
                                        path={ApiEndpoints.list_item}
                                        selectLabel='title'
                                        className="mb-2"
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
                                </Col> */}
                {/* <Col md='2'>
                                    <Button color='primary' type='submit' block rounded>
                                        {FM('submit')}
                                    </Button>
                                </Col> */}
                <Col md='4'>
                  <Button color='primary' className='mt-2' block rounded onClick={pdf}>
                    {FM('submit-via-log')}
                  </Button>
                </Col>
              </Row>
              <Row></Row>
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
              <CardBody className='pb-0 mb-2 pt-2'>
                <ScrollBar>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th style={{ minWidth: 170 }}>{FM('sno')}</th>
                        <th style={{ minWidth: 140 }}>{FM('date')}</th>
                        <th style={{ minWidth: 140 }}>{FM('action')}</th>
                        <th style={{ minWidth: 140 }}>{FM('delete')}</th>
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
                                  {isValid(a?.name) ? (
                                    <a href={a?.link} target='_blank'>
                                      {a?.name}
                                    </a>
                                  ) : (
                                    a?.name
                                  )}
                                </td>

                                <td>
                                  <Show IF={isValid(a?.random_no)}>
                                    <ConfirmAlert
                                      onDropdown
                                      eventId={`delete-item-${a?.id}`}
                                      item={a}
                                      title={truncateText(`${a?.date}`, 50)}
                                      color='text-warning'
                                      onClickYes={() =>
                                        handleDelete(
                                          a?.dpr_config_id,
                                          `delete-item-${a?.dpr_config_id}`,
                                          a?.date,
                                          a
                                        )
                                      }
                                      onSuccessEvent={(e: any) => {
                                        pdf()
                                      }}
                                      className=''
                                      id={`grid-delete-${a?.dpr_config_id}`}
                                    >
                                      {<Badge color='danger'>{FM('delete')}</Badge>}
                                    </ConfirmAlert>
                                  </Show>
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

export default DPRUpload

// import useUser from '@hooks/useUser'
// import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
// import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
// import { useImportDprListMutation, useLoadImportActionMutation } from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
// import Show from '@src/utility/Show'
// import {
//     ErrorToast,
//     FM,
//     SuccessToast,
//     commaFormatter,
//     emitAlertStatus,
//     fastLoop,
//     formatDate,
//     isValid,
//     isValidArray,
//     kFormatter,
//     log,
//     truncateText
// } from '@src/utility/Utils'
// import { downloadPDF } from '@src/utility/http/Apis/downloadDPR'
// import { stateReducer } from '@src/utility/stateReducer'
// import { DprReportList } from '@src/utility/types/typeDPR'
// import { useEffect, useReducer, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import ScrollBar from 'react-perfect-scrollbar'
// import { useNavigate, useParams } from 'react-router-dom'
// import { Badge, Button, Card, CardBody, CardHeader, Col, Form, Label, Row, Table } from 'reactstrap'
// import { useLoadManpowerMutation } from '../../../redux/RTKQuery/GraphRTK'
// import ConfirmAlert from '@hooks/ConfirmAlert'

// interface States {
//     page?: any
//     per_page_record?: any
//     changeObject?: any
//     search?: any
//     reload?: any
//     logFilter?: boolean
//     isRemoving?: boolean
//     isReloading?: boolean
//     isAddingNewData?: boolean
//     transactionFilter?: boolean
//     filterData?: any
//     lastRefresh?: any
//     edit?: any
//     selectedItem?: any
// }
// const DPRImport = ({ configName = null }: { configName: any }) => {
//     const initState: States = {
//         page: 1,
//         lastRefresh: new Date().getTime(),
//         per_page_record: 15,
//         changeObject: null,
//         transactionFilter: false,
//         filterData: null,
//         search: undefined,
//         isRemoving: false,
//         isReloading: false,
//         isAddingNewData: false
//     }

//     const reducers = stateReducer<States>
//     const [state, setState] = useReducer(reducers, initState)
//     const params = useParams()

//     log("params", params)
//     const form = useForm<DprReportList>()
//     const nav = useNavigate()
//     const [loadingSample, setLoadingSample] = useState(false)
//     const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
//     const [loadReport, { data, isError, isLoading, isSuccess }] = useImportDprListMutation()
//     const [deleteImport, resDelete] = useLoadImportActionMutation()
//     const [loadManpower, resultData] = useLoadManpowerMutation()
//     const userData = useUser()

//     const load = () => {
//         if (isValid(watch('date')) && isValid(params?.id)) {
//             loadReport({
//                 date: watch('date'),
//                 dpr_config_id: params?.id
//             })
//         }
//     }

//     // const loadMan = () => {
//     //     if (isValid(watch('date')) && isValid(params?.id)) {
//     //         loadManpower({
//     //             jsonData: {
//     //                 data_date: watch('date'),
//     //                 dpr_config_id: params?.id
//     //             }
//     //         })
//     //     }
//     // }

//     useEffect(() => {
//         load()
//         //   loadMan()
//     }, [state?.lastRefresh, params])

//     const onSubmit = (d: any) => {
//         load()
//         //     loadMan()
//     }

//     const pdf = () => {
//         downloadPDF({
//             jsonData: {
//                 date: watch('date'),
//                 type: 'pdf',
//                 dpr_config_id: configName
//             },
//             loading: setLoadingSample,
//             success: (e: any) => {
//                 window.open(`${e?.data}`, '_blank')
//             },
//             error: (e: any) => {
//                 ErrorToast(e?.data)
//             }
//         })
//     }

//     const html = () => {
//         downloadPDF({
//             jsonData: {
//                 date: watch('date'),
//                 type: 'html',
//                 dpr_config_id: watch('dpr_config_id')?.value
//             },
//             loading: setLoadingSample,
//             success: (e: any) => {
//                 window.open(`${e?.data}`, '_blank')
//             },
//             error: (e: any) => {
//                 ErrorToast(e?.data)
//             }
//         })
//     }

//     const excel = () => {
//         downloadPDF({
//             jsonData: {
//                 date: watch('date'),
//                 type: 'excel',
//                 dpr_config_id: watch('dpr_config_id')?.value
//             },
//             loading: setLoadingSample,
//             success: (e: any) => {
//                 window.open(`${e?.data}`, '_blank')
//             },
//             error: (e: any) => {
//                 ErrorToast(e?.data)
//             }
//         })
//     }

//     const sendMail = () => {
//         downloadPDF({
//             jsonData: {
//                 date: watch('date'),
//                 email: watch('email')
//             },
//             loading: setLoadingSample,
//             success: (e: any) => {
//                 SuccessToast('Email Sent Successfully')
//             },
//             error: (e: any) => {
//                 ErrorToast(e?.data)
//             }
//         })
//     }

//     const handleDelete = (id: any, eventId: any, date: any, d: any) => {

//         deleteImport({
//             jsonData: {
//                 action: 'delete',
//                 id: d?.id,
//                 dpr_config_id: id,
//                 item_dec: d?.item_dec,
//                 date: date
//             },
//             id,
//             eventId,
//             originalArgs: resDelete?.originalArgs
//         })
//     }

//     useEffect(() => {
//         if (resDelete?.isLoading === false) {
//             if (resDelete?.isSuccess) {
//                 emitAlertStatus('success', null, resDelete?.originalArgs?.eventId)
//             } else if (resDelete?.error) {
//                 emitAlertStatus('failed', null, resDelete?.originalArgs?.eventId)
//             }
//         }
//     }, [resDelete])
//     const tests = resultData?.data?.data
//     // sum all the manpower by project and work_package
//     const groupProject = () => {
//         const re: any[] = []
//         fastLoop(tests, (test, index) => {
//             if (re?.hasOwnProperty(test?.project)) {
//                 re[test?.project] = ''
//             } else {
//                 re[test?.project] = ''
//             }
//         })
//         // log(re)
//         return re
//     }

//     // merge work_package
//     const getWorkPackage = (key?: string) => {
//         const oreo: any[] = []
//         const re: any[] = []
//         fastLoop(tests, (test, index) => {
//             if (key) {
//                 if (re?.hasOwnProperty(test?.project)) {
//                     re[test?.project] = {
//                         data: [...re[test?.project]?.data, ...test?.profiles?.map((a) => a)],
//                         project: test?.project
//                     }
//                 } else {
//                     re[test?.project] = { data: test?.profiles?.map((a) => a), project: test?.project }
//                 }
//             }
//             fastLoop(test?.profiles, (profile, index) => {
//                 // find name
//                 const findIndex = oreo?.findIndex((a) => a?.name === profile?.work_package)
//                 if (findIndex !== -1) {
//                     oreo[findIndex] = {
//                         name: profile?.work_package,
//                         manpower: key
//                             ? re[key]?.data
//                                 ?.filter((a) => a?.work_package === profile?.work_package)
//                                 ?.map((a) => a?.manpower)
//                                 .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
//                             : 0,
//                         key
//                     }
//                 } else {
//                     oreo.push({
//                         name: profile?.work_package,
//                         manpower: key
//                             ? re[key]?.data
//                                 ?.filter((a) => a?.work_package === profile?.work_package)
//                                 ?.map((a) => a?.manpower)
//                                 .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
//                             : 0,
//                         key
//                     })
//                 }
//             })
//         })
//         // log(oreo)
//         return oreo
//     }

//     // get the manpower by work_package
//     const getPackageWiseData = (key: string) => {
//         const re: any[] = []
//         fastLoop(getWorkPackage(key), (work_package, index) => {
//             re.push(<td>{work_package?.manpower ?? 0}</td>)
//         })
//         return re
//     }

//     // loop through all the projects
//     const renderTrTd = () => {
//         const re: any[] = []
//         for (const [key, value] of Object.entries(groupProject())) {
//             re.push(
//                 <tr>
//                     <td>{key}</td>
//                     {getPackageWiseData(key)}
//                 </tr>
//             )
//         }
//         return re
//     }

//     const renderFormula = (header: string) => {
//         if (header === 'Scope') {
//             return <>{"A"}</>
//         }
//         if (header === 'Drawing Release') {
//             return <>{"B"}</>
//         }
//         if (header === 'Work Done Till Date') {
//             return <>{"C"}</>
//         }

//         if (header === '% Complete') {
//             return <>{`D=(C/A)%`}</>
//         }
//         if (header === 'Plan FTM') {
//             return <>{`F`}</>
//         }
//         if (header === 'Achieved FTM') {
//             return <>{`G`}</>
//         }
//         if (header === 'Balance') {
//             return <>{`E=A-C`}</>
//         }
//         if (header === 'Achieved FTD') {
//             return <>{`H`}</>
//         } if (header === "% Achievement Against Plan") {
//             return <>{`I=(H/(F/26))%`}</>
//         }
//     }

//     const renderTableHeaderData = (item, header, actualData) => {
//         if (item?.is_dpr_submit !== true) {

//             if (header === "Plan FTM" ||
//                 header === "Achieved FTM" ||
//                 header === "Achieved FTD" ||
//                 header === "% Achievement Against Plan") {
//                 return <>{`-`}</>
//             } else {
//                 if (header === "% Complete") {
//                     return <>{`${commaFormatter(actualData[header] ?? 0)}%`}</>
//                 } else {
//                     return <>{commaFormatter(actualData[header] ?? 0)}</>
//                 }
//             }

//         } else {
//             if (header === "% Achievement Against Plan" || header === "% Complete") {
//                 return <>{`${commaFormatter(actualData[header] ?? 0)}%`}</>
//             } else {
//                 return <>{commaFormatter(actualData[header] ?? 0)}</>
//             }
//         }
//     }

//     // Extract the keys (table headers) from the first data item
//     const dataArray = data?.data?.map((a: any) => a) || []

//     return (
//         <>
//             {/* <Header onClickBack={() => nav(-1)} goBackTo title={FM('dpr-report')}></Header> */}
//             <Form onSubmit={handleSubmit(onSubmit)}>
//                 <Card>
//                     <CardHeader>
//                         <div className='flex-1'>
//                             <Row>
//                                 <Col md='3'>
//                                     <Label>
//                                         {FM('select-date')} <span className='text-danger fw-bolder'>*</span>
//                                     </Label>
//                                 </Col>
//                                 {/* <Show IF={isValidArray(data?.data)}>
//                                     <Col md='3'>
//                                         <Label>{FM('select-work-item-data')}</Label>
//                                     </Col>
//                                 </Show> */}
//                             </Row>
//                             <Row className='flex-1 g-1'>
//                                 <Col md='6'>
//                                     <FormGroupCustom
//                                         placeholder={FM('select-date')}
//                                         label={FM('select-date')}
//                                         name={'date'}
//                                         type={'date'}
//                                         className='mb-0'
//                                         noLabel
//                                         control={control}
//                                         rules={{ required: true }}
//                                     />
//                                 </Col>

//                                 <Col md='4'>
//                                     <Button color='primary' type='submit' block rounded>
//                                         {FM('submit')}
//                                     </Button>
//                                 </Col>

//                             </Row>
//                         </div>
//                     </CardHeader>
//                 </Card>
//                 <Show IF={watch('date')}>
//                     <Show IF={isLoading}>
//                         <Row className='d-flex align-items-stretch'>
//                             <Card>
//                                 <CardBody>
//                                     <Row>
//                                         <Shimmer style={{ height: 320 }} />
//                                     </Row>
//                                 </CardBody>
//                             </Card>
//                         </Row>
//                     </Show>
//                     {dataArray?.map((item: any, index: any) => {
//                         const itemData = item?.item_data || []
//                         const uniqueKeys = new Set()

//                         itemData?.forEach((d: any) => {
//                             d?.data?.forEach((dataObj: any) => {
//                                 Object.keys(dataObj).forEach((key) => {
//                                     uniqueKeys.add(key)
//                                 })
//                             })
//                         })
//                         const tableHeaders1 = Array.from(uniqueKeys)
//                         const tableHeaders = tableHeaders1
//                         log('headers', tableHeaders)
//                         return (
//                             <>
//                                 <Card>
//                                     <CardBody className='border-bottom'>
//                                         <ScrollBar>
//                                             <Row md='12' className='d-flex justify-contents-between align-items-between'>
//                                                 <Col className=''>
//                                                     <h5 className='fw-bolder mb-1 text-capitalize'>
//                                                         {FM('work-item')} : {item?.work_item}{' '}
//                                                     </h5>
//                                                 </Col>
//                                                 <Col>
//                                                     <h5 className='fw-bolder text-end mb-1'>
//                                                         {FM('date')} : {item?.date}{' '}
//                                                     </h5>
//                                                 </Col>
//                                             </Row>
//                                             <Table bordered>
//                                                 <thead>
//                                                     <tr>
//                                                         <th rowSpan={2}>{FM('actions')}</th>
//                                                         <th rowSpan={2}>{FM('project')}</th>
//                                                         {tableHeaders
//                                                             ?.filter((header: any, headerIndex) => {
//                                                                 // Specify the headers you want to keep
//                                                                 const headersToKeep = [
//                                                                     'original_csv',
//                                                                     'project_name',
//                                                                     'project_status',
//                                                                     'vendor_name',
//                                                                     'file_name'
//                                                                 ] // Replace with your desired headers
//                                                                 return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
//                                                             })
//                                                             ?.map((header: any, index: any) => (
//                                                                 <th key={index} >{header}</th>
//                                                             ))}

//                                                     </tr>
//                                                     <tr>

//                                                         {tableHeaders
//                                                             ?.filter((header: any, headerIndex) => {
//                                                                 // Specify the headers you want to keep
//                                                                 const headersToKeep = [
//                                                                     'original_csv',
//                                                                     'project_name',
//                                                                     'project_status',
//                                                                     'vendor_name',
//                                                                     'file_name'
//                                                                 ] // Replace with your desired headers
//                                                                 return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
//                                                             })
//                                                             ?.map((header: any, index: any) => (
//                                                                 <th key={index} >{renderFormula(header)}</th>
//                                                             ))}
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {itemData?.map((itemD: any, itemIndex: any) => {
//                                                         log('itemD', itemD)
//                                                         return (
//                                                             <>
//                                                                 <tr>
//                                                                     <td></td>
//                                                                     <td className='fw-bolder'>{itemD?.project_name}</td>
//                                                                     {tableHeaders
//                                                                         ?.filter((header: any, headerIndex) => {
//                                                                             // Specify the headers you want to keep
//                                                                             const headersToKeep = [
//                                                                                 'original_csv',
//                                                                                 'project_name',
//                                                                                 'project_status',
//                                                                                 'vendor_name',
//                                                                                 'file_name'
//                                                                             ] // Replace with your desired headers
//                                                                             return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
//                                                                         })
//                                                                         ?.map((header: any, headerIndex: any) => {
//                                                                             if (header === 'Change reason for plan ftm') {
//                                                                                 return <>{null}</>
//                                                                             }
//                                                                             let sum: any = 0
//                                                                             itemD?.data?.map((data: any, dataIndex: any) => {
//                                                                                 const headerValue = data?.[header]

//                                                                                 log('headerValue', headerValue)
//                                                                                 log('header', header)
//                                                                                 sum += headerValue

//                                                                                 return (
//                                                                                     <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
//                                                                                         {renderTableHeaderData(itemD, header, data)}
//                                                                                     </th>
//                                                                                 )
//                                                                             })
//                                                                             return (
//                                                                                 <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
//                                                                                     {/* {renderTableHeaderData(itemD, header, data)} */}
//                                                                                     {header === "% Complete" ? `${commaFormatter(sum)}%` : renderTableHeaderData(itemD, header, data)}
//                                                                                 </th>
//                                                                             )
//                                                                         })}
//                                                                     {/* <td className='fw-bolder'><Badge color='danger'>{"delete"}</Badge></td> */}
//                                                                 </tr>

//                                                                 {itemD.data?.map((data: any, dataIndex: any) => {
//                                                                     //divide project value  -

//                                                                     return (
//                                                                         <tr key={`${itemIndex}`}>
//                                                                             <td className='fw-bolder'>      <ConfirmAlert

//                                                                                 onDropdown
//                                                                                 eventId={`delete-item-${itemD?.dpr_config_id}`}
//                                                                                 item={data}
//                                                                                 title={truncateText(`${data?.vendor_name}`, 50)}
//                                                                                 color='text-warning'
//                                                                                 onClickYes={() => handleDelete(itemD?.dpr_config_id, `delete-item-${itemD?.dpr_config_id}`, itemD?.data_date, itemD,)}
//                                                                                 onSuccessEvent={(e: any) => {
//                                                                                     load()
//                                                                                 }}
//                                                                                 className=''
//                                                                                 id={`grid-delete-${itemD?.dpr_config_id}`}
//                                                                             >
//                                                                                 {<Badge color='danger'>{FM('delete')}</Badge>}
//                                                                             </ConfirmAlert></td>
//                                                                             <td>
//                                                                                 <a href={data?.original_csv}>{data?.vendor_name}</a>
//                                                                             </td>

//                                                                             {tableHeaders
//                                                                                 ?.filter((header: any, headerIndex) => {
//                                                                                     // Specify the headers you want to keep
//                                                                                     const headersToKeep = [
//                                                                                         'original_csv',
//                                                                                         'project_name',
//                                                                                         'project_status',
//                                                                                         'vendor_name',
//                                                                                         'file_name'
//                                                                                     ] // Replace with your desired headers
//                                                                                     return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
//                                                                                 })
//                                                                                 ?.map((header: any, headerIndex: any) => {
//                                                                                     return (
//                                                                                         <td key={`${itemIndex}-${itemIndex}-${headerIndex}`}>

//                                                                                             {renderTableHeaderData(itemD, header, data)}
//                                                                                         </td>
//                                                                                     )
//                                                                                 })}

//                                                                         </tr >
//                                                                     )
//                                                                 })}

//                                                             </>
//                                                         )
//                                                     })}
//                                                 </tbody>
//                                             </Table>
//                                         </ScrollBar>
//                                     </CardBody>
//                                 </Card >
//                             </>
//                         )
//                     })}
//                     {isSuccess && !isValidArray(data?.data) ? (
//                         <Card>
//                             <CardBody className=''>
//                                 <Row className='px-2 fw-bolder'>
//                                     There are no records to display. Please select the correct Date.
//                                 </Row>
//                             </CardBody>
//                         </Card>
//                     ) : (
//                         ''
//                     )}
//                     {/* <Show IF={isValidArray(resultData?.data?.data)}>
//                         <Card>
//                             <CardBody className='pb-0 border-bottom mb-2 pt-1'>
//                                 <Row md='12' className='d-flex justify-contents-between align-items-between'>
//                                     <Col className=''>
//                                         <h5 className='fw-bolder mb-1'>{FM('manpower-table')}</h5>
//                                     </Col>
//                                     <Col>
//                                         <h5 className='fw-bolder text-end mb-1'>
//                                             {FM('data-date')} : {formatDate(watch('date'), 'DD MMM YYYY')}{' '}
//                                         </h5>
//                                     </Col>
//                                 </Row>
//                             </CardBody>
//                             <CardBody className='border-bottom pt-0'>
//                                 <ScrollBar>
//                                     <Table>
//                                         <thead>
//                                             <tr>
//                                                 <th>{FM('project')}</th>
//                                                 {getWorkPackage().map((workPackage, index) => {
//                                                     return <th>{workPackage?.name}</th>
//                                                 })}
//                                             </tr>
//                                         </thead>
//                                         <tbody>{renderTrTd()}</tbody>
//                                     </Table>
//                                 </ScrollBar>
//                             </CardBody>
//                         </Card>
//                     </Show> */}
//                 </Show>
//             </Form >
//         </>
//     )
// }

// export default DPRImport
