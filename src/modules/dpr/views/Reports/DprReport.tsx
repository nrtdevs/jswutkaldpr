// import useUser from '@hooks/useUser'
// import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
// import Header from '@src/modules/common/components/header'
// import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
// import { useImportDprListMutation } from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
// import Hide from '@src/utility/Hide'
// import Show from '@src/utility/Show'
// import {
//   ErrorToast,
//   FM,
//   SuccessToast,
//   commaFormatter,
//   fastLoop,
//   formatDate,
//   isValid,
//   isValidArray,
//   kFormatter,
//   log
// } from '@src/utility/Utils'
// import ApiEndpoints from '@src/utility/http/ApiEndpoints'
// import { downloadPDF } from '@src/utility/http/Apis/downloadDPR'
// import { loadDropdown } from '@src/utility/http/Apis/dropdown'
// import { stateReducer } from '@src/utility/stateReducer'
// import { DprReportList } from '@src/utility/types/typeDPR'
// import { useEffect, useReducer, useState } from 'react'
// import { Download, XCircle } from 'react-feather'
// import { useForm } from 'react-hook-form'
// import ScrollBar from 'react-perfect-scrollbar'
// import { useNavigate } from 'react-router-dom'
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Col,
//   Form,
//   Label,
//   Row,
//   Spinner,
//   Table
// } from 'reactstrap'
// import { useLoadManpowerMutation } from '../../redux/RTKQuery/GraphRTK'
// import { ReactMultiEmail } from 'react-multi-email'
// import 'react-multi-email/dist/style.css'
// import useNumberCommaFormatter from '@src/utility/NumCommaFormat'
// import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'

// interface States {
//   page?: any
//   per_page_record?: any
//   changeObject?: any
//   search?: any
//   reload?: any
//   logFilter?: boolean
//   isRemoving?: boolean
//   isReloading?: boolean
//   isAddingNewData?: boolean
//   transactionFilter?: boolean
//   filterData?: any
//   lastRefresh?: any
//   edit?: any
//   selectedItem?: any
// }
// const DPRReport = () => {
//   const initState: States = {
//     page: 1,
//     lastRefresh: new Date().getTime(),
//     per_page_record: 15,
//     changeObject: null,
//     transactionFilter: false,
//     filterData: null,
//     search: undefined,
//     isRemoving: false,
//     isReloading: false,
//     isAddingNewData: false
//   }
//   const useComma = useNumberCommaFormatter(true)
//   const reducers = stateReducer<States>
//   const [state, setState] = useReducer(reducers, initState)
//   const form = useForm<DprReportList>()
//   const nav = useNavigate()
//   const [loadingSample, setLoadingSample] = useState(false)
//   const [loadingHtml, setLoadingHtml] = useState(false)
//   const [loadingExcel, setLoadingExcel] = useState(false)
//   const [loadingMail, setLoadingMail] = useState(false)
//   const [dprReportEmails, setDprReportsEmail] = useState<string[]>([])
//   const [focused, setFocused] = useState(false)

//   const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
//   const [loadReport, { data, isError, isLoading, isSuccess }] = useImportDprListMutation()
//   const [loadManpower, resultData] = useLoadManpowerMutation()
//   const userData = useUser()

//   //load report
//   const load = () => {
//     if (isValid(watch('date'))) {
//       loadReport({
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value
//       })
//     }
//   }

//   //load manpower
//   const loadMan = () => {
//     if (isValid(watch('date'))) {
//       loadManpower({
//         jsonData: {
//           date: watch('date'),
//           project_id: watch('project_id')?.value,
//           vender_id: watch('vender_id')?.value,
//           item_desc: watch('work_item')?.value
//         }
//       })
//     }
//   }

//   //['testEMail@gmail.com', 'another@gmail.com']   remove [] and convert  data like "testEMail@gmail.com,another@gmail.com"

//   const sendEmails = (emails: string[]) => {
//     const emailList = emails.filter((email) => email !== '')
//     return `${emailList.join(',')}`
//   }

//   //"dfsg@gmail.com,dsfs@gmail.com"  convert to ["dfsg@gmail.com","dsfs@gmail.com"]
//   const getEmails = (emails: string) => {
//     const emailList = emails?.split(',')
//     return emailList
//   }

//   const Reset = (e: any) => {
//     reset()
//     setDprReportsEmail([])
//   }

//   useEffect(() => {
//     load()
//     loadMan()
//   }, [state?.lastRefresh])

//   const onSubmit = (d: any) => {
//     load()
//     loadMan()
//   }

//   const pdf = () => {
//     downloadPDF({
//       jsonData: {
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value,
//         type: 'pdf'
//       },
//       loading: setLoadingSample,
//       success: (e: any) => {
//         window.open(`${e?.data}`, '_blank')
//       },
//       error: (e: any) => {
//         ErrorToast(e?.data)
//       }
//     })
//   }

//   const html = () => {
//     downloadPDF({
//       jsonData: {
//         type: 'html',
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value
//       },
//       loading: setLoadingHtml,
//       success: (e: any) => {
//         window.open(`${e?.data}`, '_blank')
//       },
//       error: (e: any) => {
//         ErrorToast(e?.data)
//       }
//     })
//   }

//   const excel = () => {
//     downloadPDF({
//       jsonData: {
//         type: 'excel',
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value
//       },
//       loading: setLoadingExcel,
//       success: (e: any) => {
//         window.open(`${e?.data}`, '_blank')
//       },
//       error: (e: any) => {
//         ErrorToast(e?.data)
//       }
//     })
//   }

//   const sendMail = () => {
//     downloadPDF({
//       jsonData: {
//         type: 'mail',
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value,
//         //email: dprReportEmails,
//         email: sendEmails(dprReportEmails)
//       },
//       loading: setLoadingMail,
//       success: (e: any) => {
//         //  SuccessToast(e?.message)
//       },
//       error: (e: any) => {
//         ErrorToast(e?.message)
//       }
//     })
//   }

//   useEffect(() => {
//     setDprReportsEmail(getEmails(data?.email))
//   }, [data?.email])

//   const tests = resultData?.data?.data
//   // sum all the manpower by project and work_package
//   const groupProject = () => {
//     const re: any[] = []
//     fastLoop(tests, (test, index) => {
//       if (re?.hasOwnProperty(test?.project)) {
//         re[test?.project] = ''
//       } else {
//         re[test?.project] = ''
//       }
//     })
//     // log(re)
//     return re
//   }

//   // merge work_package
//   const getWorkPackage = (key?: string) => {
//     const oreo: any[] = []
//     const re: any[] = []
//     fastLoop(tests, (test, index) => {
//       if (key) {
//         if (re?.hasOwnProperty(test?.project)) {
//           re[test?.project] = {
//             data: [...re[test?.project]?.data, ...test?.profiles?.map((a) => a)],
//             project: test?.project
//           }
//         } else {
//           re[test?.project] = { data: test?.profiles?.map((a) => a), project: test?.project }
//         }
//       }
//       fastLoop(test?.profiles, (profile, index) => {
//         // find name
//         const findIndex = oreo?.findIndex((a) => a?.name === profile?.work_package)
//         if (findIndex !== -1) {
//           oreo[findIndex] = {
//             name: profile?.work_package,
//             manpower: key
//               ? re[key]?.data
//                   ?.filter((a) => a?.work_package === profile?.work_package)
//                   ?.map((a) => a?.manpower)
//                   .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
//               : 0,
//             key
//           }
//         } else {
//           oreo.push({
//             name: profile?.work_package,
//             manpower: key
//               ? re[key]?.data
//                   ?.filter((a) => a?.work_package === profile?.work_package)
//                   ?.map((a) => a?.manpower)
//                   .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
//               : 0,
//             key
//           })
//         }
//       })
//     })
//     // log(oreo)
//     return oreo
//   }

//   // get the manpower by work_package
//   const getPackageWiseData = (key: string) => {
//     const re: any[] = []
//     fastLoop(getWorkPackage(key), (work_package, index) => {
//       re.push(<td>{work_package?.manpower ?? 0}</td>)
//     })
//     return re
//   }

//   // loop through all the projects
//   const renderTrTd = () => {
//     const re: any[] = []
//     for (const [key, value] of Object.entries(groupProject())) {
//       re.push(
//         <tr>
//           <td>{key}</td>
//           {getPackageWiseData(key)}
//         </tr>
//       )
//     }
//     return re
//   }

//   const renderFormula = (index: any) => {
//     //const total_number_of_days_in_month = new Date(new Date(watch('date')).getFullYear(), new Date(watch('date')).getMonth() + 1, 0).getDate()
//     const total_number_of_days_in_month = new Date(
//       new Date(watch('date')).getFullYear(),
//       new Date(watch('date')).getMonth() + 1,
//       0
//     ).getDate()
//     const getDate = new Date(watch('date')).getDate()

//     const selectedDate = new Date(watch('date'))
//     const years = selectedDate.getFullYear()
//     const months = selectedDate.getMonth() // 0-based month

//     const totalDaysInMonth = new Date(years, months + 1, 0).getDate()

//     let sundayCounts = 0

//     for (let day = 1; day <= totalDaysInMonth; day++) {
//       const currentDate = new Date(years, months, day)
//       if (currentDate.getDay() === 0) {
//         // 0 = Sunday
//         sundayCounts++
//       }
//     }

//     function countSundaysBetweenDates(startDateStr: string, endDateStr: string): number {
//       const startDate = new Date(startDateStr)
//       const endDate = new Date(endDateStr)

//       let count = 0

//       // loop through the dates
//       while (startDate <= endDate) {
//         if (startDate.getDay() === 0) {
//           // Sunday is 0 in getDay()
//           count++
//         }
//         startDate.setDate(startDate.getDate() + 1) // move to next day
//       }

//       return count
//     }

//     // Example usage:
//     const day = 1
//     const month = formatDate(new Date(watch('date')), 'MM')
//     const year = formatDate(new Date(watch('date')), 'YYYY')
//     const end = formatDate(new Date(watch('date')), 'YYYY-MM-DD')
//     const start = `${year}-${month}-${day}`
//     const today = new Date()
//     // const years = today.getFullYear()
//     // const months = today.getMonth() + 1 // since getMonth() is 0-based

//     // const lastDateOfCurrentMonth = new Date(years, months, 0)
//     // console.log(lastDateOfCurrentMonth, 'fdf')

//     const sundaysCount = countSundaysBetweenDates(start, end)

//     const workingDays = getDate - sundaysCount
//     const CountMonth = total_number_of_days_in_month - sundayCounts

//     //     log(`Total Sundays between ${start} and ${end}:`, sundaysCount)
//     //    log(`Working Days (excluding Sundays):`, workingDays)

//     // if (index === 0) {
//     //   return 'A'
//     // } else if (index === 1) {
//     //   return 'B'
//     // } else if (index === 2) {
//     //   return 'C'
//     // } else if (index === 3) {
//     //   return `D`
//     // } else if (index === 4) {
//     //   return `E=(D/A)%`
//     // } else if (index === 5) {
//     //   return `F=A-D`
//     // } else if (index === 6) {
//     //   return `G`
//     // } else if (index === 7) {
//     //   return `H`
//     // } else if (index === 8) {
//     //   return `I`
//     // } else if (index === 9) {
//     //   // J=[H/{G*(12/25)}]%
//     //   return `J=[H/{G*(${workingDays}/${CountMonth})}]%`
//     // } else if (index === 10) {
//     //   return `K`
//     // } else if (index === 11) {
//     //   return `L=H/avg(K)*(${workingDays}/${CountMonth})`
//     // } else if (index === 12) {
//     //   //   M = [(G - H) / (25 - 12)]
//     //   return `M=[(G-H)/(${CountMonth}-${workingDays})]`
//     // }
//   }

//   const renderDashValue = (header: string, data: any) => {
//     const vendorData = data
//     const scope: number = isValid(parseFloat(vendorData?.Scope)) ? parseFloat(vendorData?.Scope) : 0
//     const dr: number = isValid(vendorData?.['Drawing Released'])
//       ? parseFloat(vendorData?.['Drawing Released'])
//       : 0
//     const workdoneTillDate = isValid(vendorData?.['Work Done Till Date'])
//       ? parseFloat(vendorData?.['Work Done Till Date'])
//       : 0
//     const planFTM = isValid(vendorData?.['Plan FTM']) ? parseFloat(vendorData?.['Plan FTM']) : 0
//     const achievedFTM = isValid(vendorData?.['Achieved FTM'])
//       ? parseFloat(vendorData?.['Achieved FTM'])
//       : 0
//     const achievedFTD: number = isValid(vendorData?.['Achieved FTD'])
//       ? parseFloat(vendorData?.['Achieved FTD'])
//       : 0
//     const frontAvailable: number = isValid(vendorData?.['Front Available'])
//       ? parseFloat(vendorData?.['Front Available'])
//       : 0
//     const getDate = new Date(watch('date')).getDate()
//     const isThisMonthSubmitted: boolean = vendorData?.is_this_month_submit
//     const isDprSubmitted: boolean = vendorData?.is_dpr_submit
//     const total_number_of_days_in_month = new Date(
//       new Date(watch('date')).getFullYear(),
//       new Date(watch('date')).getMonth() + 1,
//       0
//     ).getDate()
//     // log('vendorData', vendorData)
//     let total: any = 0

//     if (header === 'Scope') {
//       if (scope > 0) {
//         total = scope
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Front Available') {
//       if (frontAvailable > 0) {
//         total = frontAvailable
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Drawing Released') {
//       if (dr > 0) {
//         total = dr
//       } else {
//         total = '-'
//       }
//     } else if (header === '% Complete') {
//       if (scope > 0 && workdoneTillDate > 0) {
//         total = (workdoneTillDate / scope) * 100
//       } else {
//         total = 0
//       }
//     } else if (header === 'Work Done Till Date') {
//       if (workdoneTillDate > 0) {
//         total = workdoneTillDate
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Balance') {
//       if (scope >= 0 && workdoneTillDate >= 0) {
//         total = scope - workdoneTillDate
//       } else {
//         total = vendorData?.[header]
//       }
//     } else {
//       if (vendorData?.[header] > 0) {
//         total = vendorData?.[header]
//       }
//     }
//     if (isThisMonthSubmitted === true) {
//       if (header === 'Plan FTM') {
//         if (planFTM > 0) {
//           total = planFTM
//         } else {
//           total = '-'
//         }
//       } else if (header === 'Achieved FTM') {
//         if (achievedFTM > 0) {
//           total = achievedFTM
//         } else {
//           total = '-'
//         }
//       } else if (header === '% Achievement Against Plan FTM') {
//         if (achievedFTM > 0 && planFTM > 0) {
//           total = (achievedFTM / (planFTM * (getDate / total_number_of_days_in_month))) * 100
//         } else {
//           total = '-'
//         }
//       } else if (header === 'Achieved FTD') {
//         if (isDprSubmitted === true) {
//           if (achievedFTD > 0) {
//             total = achievedFTD
//           } else {
//             total = '-'
//           }
//         } else {
//           total = '-'
//         }
//       }
//     } else {
//       if (header === '% Achievement Against Plan FTM') {
//         total = 0
//       } else if (header === 'Achieved FTD') {
//         total = '-'
//       } else if (header === 'Plan For The Month') {
//         total = '-'
//       } else if (header === 'Achieved FTM') {
//         total = '-'
//       } else if (header === '% Complete') {
//         total = vendorData?.[header]
//       } else if (header === 'Balance') {
//         if (vendorData?.[header] > 0) {
//           total = vendorData?.[header]
//         } else {
//           total = 0
//         }
//       } else {
//         if (vendorData?.[header] > 0) {
//           total = vendorData?.[header]
//         } else {
//           total = '-'
//         }
//       }
//     }

//     return total
//   }
//   const calculateTotal = (header: string, data?: any) => {
//     //log(data, "data")
//     let totalPlanFTM: number = 0
//     data?.forEach((item) => {
//       if (item?.hasOwnProperty(header)) {
//         if (isValid(item[header])) {
//           if (item?.is_this_month_submit === true) {
//             if (header === 'Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTD') {
//               if (item?.is_dpr_submit === true) {
//                 totalPlanFTM += parseFloat(item[header])
//               } else {
//                 totalPlanFTM += 0
//               }
//             } else if (header === '% Achievement Against Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           } else {
//             if (header === '% Achievement Against Plan FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Plan For The Month') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTD') {
//               totalPlanFTM += 0
//             } else if (header === 'Manpower') {
//               totalPlanFTM += parseFloat(item[header])
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           }
//         }
//       }
//     })
//     return totalPlanFTM
//   }

//   const calculateAvg = (header: string, data?: any) => {
//     //log(data, "data")
//     let totalPlanFTM: number = 0
//     let length = data?.length
//     log(length, 'length')
//     data?.forEach((item) => {
//       if (item?.hasOwnProperty(header)) {
//         if (isValid(item[header])) {
//           if (item?.is_this_month_submit === true) {
//             if (header === 'Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTD') {
//               if (item?.is_dpr_submit === true) {
//                 totalPlanFTM += parseFloat(item[header])
//               } else {
//                 totalPlanFTM += 0
//               }
//             } else if (header === '% Achievement Against Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           } else {
//             if (header === '% Achievement Against Plan FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Plan FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTD') {
//               totalPlanFTM += 0
//             } else if (header === 'Manpower') {
//               totalPlanFTM = (totalPlanFTM + parseFloat(item[header])) / length
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           }
//         }
//       }
//     })
//     return totalPlanFTM
//   }

//   //   const calculateAllTotal = (header: string, data?: any) => {
//   //     let re: number = 0
//   //     data?.forEach((item) => {
//   //       if (item?.hasOwnProperty(header)) {
//   //         const totalScope = calculateTotal('Scope', data)
//   //         const totalDrawingReleased = calculateTotal('Drawing Released', data)
//   //         const totalFrontAvailable = calculateTotal('Front Available', data)
//   //         const totalWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
//   //         const totalData =
//   //           Number(calculateTotal('Scope', data)) -
//   //           Number(calculateTotal('Work Done Till Date', data))

//   //         const totalPlanFTM = calculateTotal('Plan FTM', data)
//   //         const totalAchievedFTM = calculateTotal('Achieved FTM', data)
//   //         const totalAchievedFTD = calculateTotal('Achieved FTD', data)
//   //         const totalProductivity = calculateTotal('Productivity', data)
//   //         const totalAskingRate = calculateTotal('Asking Rate', data)
//   //         const getDate = new Date(watch('date')).getDate()
//   //         const total_number_of_days_in_month = new Date(
//   //           new Date(watch('date')).getFullYear(),
//   //           new Date(watch('date')).getMonth() + 1,
//   //           0
//   //         ).getDate()

//   //         const selectedDate = new Date(watch('date'))
//   //         const years = selectedDate.getFullYear()
//   //         const months = selectedDate.getMonth() // 0-based month

//   //         const totalDaysInMonth = new Date(years, months + 1, 0).getDate()

//   //         let sundayCounts = 0

//   //         for (let day = 1; day <= totalDaysInMonth; day++) {
//   //           const currentDate = new Date(years, months, day)
//   //           if (currentDate.getDay() === 0) {
//   //             // 0 = Sunday
//   //             sundayCounts++
//   //           }
//   //         }

//   function countSundaysBetweenDates(startDateStr: string, endDateStr: string): number {
//     const startDate = new Date(startDateStr)
//     const endDate = new Date(endDateStr)

//     let count = 0

//     // loop through the dates
//     while (startDate <= endDate) {
//       if (startDate.getDay() === 0) {
//         // Sunday is 0 in getDay()
//         count++
//       }
//       startDate.setDate(startDate.getDate() + 1) // move to next day
//     }

//     return count
//   }

//   //         // Example usage:
//   //         const day = 1
//   //         const month = formatDate(new Date(watch('date')), 'MM')
//   //         const year = formatDate(new Date(watch('date')), 'YYYY')
//   //         const end = formatDate(new Date(watch('date')), 'YYYY-MM-DD')
//   //         const start = `${year}-${month}-${day}`
//   //         const today = new Date()
//   //         // const years = today.getFullYear()
//   //         // const months = today.getMonth() + 1 // since getMonth() is 0-based

//   //         // const lastDateOfCurrentMonth = new Date(years, months, 0)
//   //         // console.log(lastDateOfCurrentMonth, 'fdf')

//   //         const sundaysCount = countSundaysBetweenDates(start, end)

//   //         const workingDays = getDate - sundaysCount
//   //         const CountMonth = total_number_of_days_in_month - sundayCounts

//   //         if (isValid(item[header])) {
//   //           if (header === 'Scope') {
//   //             //A
//   //             re = totalScope
//   //             // console.log(re, 'RES')
//   //           } else if (header === 'Front Available') {
//   //             //C
//   //             re = totalFrontAvailable
//   //           } else if (header === 'Drawing Released') {
//   //             //B
//   //             re = totalDrawingReleased
//   //           } else if (header === 'Work Done Till Date') {
//   //             //D

//   //             re = totalWorkDoneTillDate
//   //           } else if (header === '% Completed w.r.t. total scope') {
//   //             //E = (D/A)%
//   //             re = Number(
//   //               ((totalWorkDoneTillDate / totalScope) * 100).toFixed(2).replace(/\.?0*$/, '')
//   //             )
//   //             console.log(re, 'RES Comp')
//   //           } else if (header === 'Balance w.r.t. total scope') {
//   //             //F = A-D
//   //             re = Number((totalScope - totalWorkDoneTillDate).toFixed(2).replace(/\.?0*$/, ''))
//   //           } else if (header === 'Plan FTM') {
//   //             //G
//   //             re = totalPlanFTM
//   //           } else if (header === 'Achieved FTM') {
//   //             //H
//   //             re = totalAchievedFTM
//   //           } else if (header === 'Achieved FTD') {
//   //             //I
//   //             re = totalAchievedFTD
//   //           } else if (header === '% Achievement Against Plan FTM') {
//   //             //J = [H/{G*(getDate/total_number_of_days_in_month)}]%
//   //             re = Number((totalAchievedFTM / (totalPlanFTM * (workingDays / CountMonth))) * 100)
//   //           } else if (header === 'Productivity') {
//   //             re = totalProductivity
//   //           } else if (header === 'Asking Rate') {
//   //             re = totalAskingRate
//   //           } else {
//   //             re = item[header]
//   //           }
//   //         }
//   //       }
//   //     })
//   //     return re
//   //   }
//   const calculateAllTotal = (header: string, data?: any) => {
//     let re: number = 0

//     if (!data) return re

//     const totalScope = calculateTotal('ISBL', data)
//     const totalDrawingReleased = calculateTotal('Drawing Released', data)
//     const totalFrontAvailable = calculateTotal('Front Available', data)
//     const totalOSBL = calculateTotal('OSBL', data)
//     const totalWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
//     const totalPlanFTM = calculateTotal('Plan For The Month', data)
//     const totalAchievedFTM = calculateTotal('Achieved FTM', data)
//     const totalAchievedFTD = calculateTotal('Achieved FTD', data)
//     const totalProductivity = calculateTotal('Productivity', data)
//     const totalAskingRate = calculateTotal('Asking Rate', data)
//     const totalManpower = calculateTotal('Manpower', data)

//     const getDate = new Date(watch('date')).getDate()
//     const selectedDate = new Date(watch('date'))
//     const years = selectedDate.getFullYear()
//     const months = selectedDate.getMonth()
//     const total_number_of_days_in_month = new Date(years, months + 1, 0).getDate()

//     // Count Sundays in month
//     let sundayCounts = 0
//     for (let day = 1; day <= total_number_of_days_in_month; day++) {
//       if (new Date(years, months, day).getDay() === 0) sundayCounts++
//     }

//     const start = `${years}-${formatDate(selectedDate, 'MM')}-01`
//     const end = formatDate(selectedDate, 'YYYY-MM-DD')
//     const sundaysCount = countSundaysBetweenDates(start, end)

//     const workingDays = getDate - sundaysCount
//     const CountMonth = total_number_of_days_in_month - sundayCounts

//     // Now compute the required total based on header
//     if (header === 'ISBL') {
//       re = totalScope
//     } else if (header === 'OSBL') {
//       re = totalOSBL
//     } else if (header === 'Front Available') {
//       re = totalFrontAvailable
//     } else if (header === 'Drawing Released') {
//       re = totalDrawingReleased
//     } else if (header === 'Work Done Till Date') {
//       re = totalWorkDoneTillDate
//     } else if (header === '% Completed w.r.t. total scope') {
//       re = Number(((totalWorkDoneTillDate / totalScope) * 100).toFixed(2))
//     } else if (header === 'Balance w.r.t. total scope') {
//       re = Number((totalScope - totalWorkDoneTillDate).toFixed(2))
//     } else if (header === 'Plan For The Month') {
//       re = totalPlanFTM
//     } else if (header === 'Achieved FTM') {
//       re = totalAchievedFTM
//     } else if (header === 'Achieved FTD') {
//       re = totalAchievedFTD
//     } else if (header === 'Manpower') {
//       re = totalManpower
//     } else if (header === '% Achievement Against Plan FTM') {
//       // [H/{G*(12/25)}]%
//       const number = Number(totalAchievedFTM / (totalPlanFTM * (workingDays / CountMonth)))
//       const percentage = Number((number * 100).toFixed(2))
//       re = percentage
//     } else if (header === 'Productivity') {
//       re = Number(totalAchievedFTM / (totalManpower * (workingDays / CountMonth)))
//     } else if (header === 'Asking Rate') {
//       re = totalAskingRate
//     } else {
//       // If header not matching known keys, just pick first available item's value for that header
//       const item = data.find((item) => item?.hasOwnProperty(header))
//       if (item && isValid(item[header])) re = item[header]
//     }

//     return re
//   }

//   const headers = [
//     'Reporting Date',
//     'Scope',
//     'Drawing Released',
//     'Front Available',
//     'Workdone Till Date',
//     '% Complete',
//     'Balance',
//     'Plan FTM',
//     'Achieved FTM',
//     'Achieved FTD',
//     'Available Manpower'
//   ]

//   const renderWithPercentage = (value?: any, header?: any) => {
//     log(header, 'Val')
//     if (header === '% Completed w.r.t. total scope') {
//       if (value >= 0) {
//         return `${value}%`
//       }
//     } else if (header === '% Achievement Against Plan FTM') {
//       if (value > 0) {
//         return `${value}%`
//       } else {
//         return '-'
//       }
//     }
//     return value
//   }
//   const dashValueWithFormula = (header: string, data: any, itemData: any) => {
//     // console.log(header, data, 'header')
//     console.log('header', { header }, 'header')
//     const dynamicTotal: number = calculateTotal(header, data)
//     let total: any = dynamicTotal
//     //calculate total sum of Plan FTM in is array of data find total of Plan FTM
//     const sumOfPlanFTM = calculateTotal('Plan For The Month', data)
//     const someOfFrontAvailable = calculateTotal('Front Available', data)
//     const sumOfWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
//     const sumOfAchievedFTD = calculateTotal('Achieved FTD', data)
//     const sumOfISBL = calculateTotal('ISBL', data)
//     const sumOfOSBL = calculateTotal('OSBL', data)
//     const sumOfAchievedFTM = calculateTotal('Achieved FTM', data)
//     const sumOfDrawingRelease = calculateTotal('Drawing Released', data)
//     const getDate = new Date(watch('date')).getDate()

//     const total_number_of_days_in_month = new Date(
//       new Date(watch('date')).getFullYear(),
//       new Date(watch('date')).getMonth() + 1,
//       0
//     ).getDate()
//     // log('formuladata', itemData?.is_this_month_submit)
//     if (header === 'Drawing Released') {
//       if (sumOfDrawingRelease > 0) {
//         total = sumOfDrawingRelease
//       } else {
//         total = '-'
//       }
//     }
//     // else if (header === 'ISBL') {
//     //   if (sumOfISBL > 0) {
//     //     total = sumOfISBL
//     //   } else {
//     //     total = '-'
//     //   }
//     // } else if (header === 'OSBL') {
//     //   if (sumOfOSBL > 0) {
//     //     total = sumOfOSBL
//     //   } else {
//     //     total = '-'
//     //   }
//     // }
//     else if (header === 'Work Done Till Date') {
//       if (sumOfWorkDoneTillDate > 0) {
//         total = sumOfWorkDoneTillDate
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Front Available') {
//       total = someOfFrontAvailable
//     } else if (header === 'Plan For The Month') {
//       if (sumOfPlanFTM > 0) {
//         total = sumOfPlanFTM
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Achieved FTM') {
//       if (sumOfAchievedFTM > 0) {
//         return sumOfAchievedFTM
//       } else {
//         return '-'
//       }
//     } else if (header === 'Achieved FTD') {
//       if (sumOfAchievedFTD > 0) {
//         total = sumOfAchievedFTD
//       } else {
//         total = '-'
//       }
//     } else if (header === '% Achievement Against Plan FTM') {
//       if (sumOfPlanFTM > 0 && sumOfAchievedFTM > 0) {
//         total =
//           (sumOfAchievedFTM / (sumOfPlanFTM * (getDate / total_number_of_days_in_month))) * 100
//         // log('Achievement Against Plan', total)
//         // }
//       } else {
//         total = 0
//       }
//     }
//     // else if (header === '% Completed w.r.t. total scope') {
//     //   log('anil', total, 'scope', sumOfScope, 'work_done_till_date', sumOfWorkDoneTillDate)

//     //   if (sumOfWorkDoneTillDate > 0 && sumOfScope > 0) {
//     //     total = ((sumOfWorkDoneTillDate / sumOfScope) * 100).toFixed(2).replace(/\.?0*$/, '')
//     //     console.log(total, 'total')
//     //     // }
//     //   } else {
//     //     total = 0
//     //   }
//     // } else if (header === 'Balance w.r.t. total scope') {
//     //   if (sumOfScope >= 0 && sumOfWorkDoneTillDate >= 0) {
//     //     total = (sumOfScope - sumOfWorkDoneTillDate).toFixed(2).replace(/\.?0*$/, '')
//     //   } else {
//     //     total = 0
//     //   }
//     // }

//     return total
//   }

//   const fixHeaderPosition = (header?: any, index?: any) => {
//     // if (index === 0) {
//     //   return 'Data Date'
//     // } else if (index === 1) {
//     //   return 'Reporting Date'
//     // } else if (index === 2) {
//     //   return 'Scope'
//     // } else if (index === 3) {
//     //   return 'Drawing Released'
//     // } else if (index === 4) {
//     //   return 'Front Available'
//     // } else if (index === 5) {
//     //   return 'Workdone Till Date'
//     // } else if (index === 6) {
//     //   return '% Complete'
//     // } else if (index === 7) {
//     //   return 'Balance'
//     // } else if (index === 8) {
//     //   return 'Plan FTM'
//     // } else if (index === 9) {
//     //   return 'Achieved FTM'
//     // } else if (index === 10) {
//     //   return 'Achieved FTD'
//     // } else if (index === 11) {
//     //   return 'Available Manpower'
//     // } else {
//     //   return ''
//     // }
//     if (index === 0) {
//       return 'Scope'
//     } else if (index === 1) {
//       return 'Drawing Released'
//     } else if (index === 2) {
//       return 'Front Available'
//     } else if (index === 3) {
//       return 'Work Done Till Date'
//     } else if (index === 4) {
//       return '% Complete'
//     } else if (index === 5) {
//       return 'Balance'
//     } else if (index === 6) {
//       return 'Plan FTM'
//     } else if (index === 7) {
//       return 'Achieved FTM'
//     } else if (index === 8) {
//       return 'Achieved FTD'
//     } else if (index === 9) {
//       return 'Available Manpower'
//     } else {
//       return ''
//     }

//     // if (index === 0) {
//     //   return 'Reporting Date'
//     // } else if (index === 1) {
//     //   return 'Scope'
//     // } else if (index === 2) {
//     //   return 'Drawing Released'
//     // } else if (index === 3) {
//     //   return 'Front Available'
//     // } else if (index === 4) {
//     //   return 'Workdone Till Date'
//     // } else if (index === 5) {
//     //   return '% Complete'
//     // } else if (index === 6) {
//     //   return 'Balance'
//     // } else if (index === 7) {
//     //   return 'Plan FTM'
//     // } else if (index === 8) {
//     //   return 'Achieved FTM'
//     // } else if (index === 9) {
//     //   return 'Achieved FTD'
//     // } else if (index === 10) {
//     //   return 'Available Manpower'
//     // } else {
//     //   return ''
//     // }

//     // else if (index === 1) {
//     //   return 'OSBL'
//     // }
//     // if (index === 2) {
//     //   return 'Drawing Released'
//     // } else if (index === 3) {
//     //   return 'Front Available'
//     // } else
//     //   if (index === 4) {
//     //   return 'Work Done Till Date'
//     // } else if (index === 5) {
//     //   return 'Plan For The Month'
//     // } else if (index === 6) {
//     //   return 'Achieved FTM'
//     // }
//     // else if (index === 4) {
//     //   return '% Completed w.r.t. total scope'
//     // }
//     // else if (index === 5) {
//     //   return 'Balance w.r.t. total scope'
//     // }

//     // else if (index === 8) {
//     //   return 'Achieved FTD'
//     // } else if (index === 9) {
//     //   return '% Achievement Against Plan FTM'
//     // } else if (index === 10) {
//     //   return 'Manpower'
//     // } else if (index === 11) {
//     //   return 'Productivity'
//     // } else if (index === 12) {
//     //   return 'Asking Rate'
//     // }

//     return header
//   }
//   // Extract the keys (table headers) from the first data item
//   const dataArray = data?.data?.map((a: any) => a) || []
//   //   console.log('dataArray', dataArray)

//   return (
//     <>
//       <Header onClickBack={() => nav(-1)} goBackTo title={FM('dpr-report')}></Header>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Card>
//           <CardHeader>
//             <div className='flex-1'>
//               <Row className='flex-1 g-1'>
//                 <Col md='2'>
//                   <FormGroupCustom
//                     placeholder={FM('select-data-date')}
//                     label={FM('select-data-date')}
//                     name={'date'}
//                     type={'date'}
//                     className='mb-2'
//                     control={control}
//                     rules={{ required: true }}
//                   />
//                 </Col>
//                 <Col md='2'>
//                   <FormGroupCustom
//                     label={FM('select-vendor')}
//                     name={'vender_id'}
//                     type={'select'}
//                     className='mb-2'
//                     placeholder='Vendor Name'
//                     path={ApiEndpoints.list_vendor}
//                     selectLabel='name'
//                     // onOptionData={(data: any[]) => {
//                     //   return data?.map((a: any) => {
//                     //     return {
//                     //       ...a,
//                     //       name_X_work_package: `${a?.vendor_name} - ${a?.work_package_name}`
//                     //     }
//                     //   })
//                     // }}
//                     selectValue={'id'}
//                     isClearable
//                     async
//                     defaultOptions
//                     loadOptions={loadDropdown}
//                     control={control}
//                     rules={{
//                       required: false
//                     }}
//                   />
//                 </Col>
//                 <Col md='3'>
//                   <FormGroupCustom
//                     label={FM('select-project')}
//                     name={'project_id'}
//                     type={'select'}
//                     className='mb-2'
//                     placeholder='Project Name'
//                     path={ApiEndpoints.list_project}
//                     selectLabel='name'
//                     // onOptionData={(data: any[]) => {
//                     //   return data?.map((a: any) => {
//                     //     return {
//                     //       ...a,
//                     //       name_X_work_package: `${a?.name} - ${a?.work_package_name}`
//                     //     }
//                     //   })
//                     // }}
//                     jsonData={{
//                       status: 1
//                     }}
//                     selectValue={'id'}
//                     isClearable
//                     async
//                     defaultOptions
//                     loadOptions={loadDropdown}
//                     control={control}
//                     rules={{
//                       required: false
//                     }}
//                   />
//                 </Col>
//                 <Col md='3'>
//                   <FormGroupCustom
//                     label={FM('item-desc')}
//                     name={'work_item'}
//                     type={'select'}
//                     className='mb-2'
//                     placeholder='Item Description'
//                     path={ApiEndpoints.list_item}
//                     selectLabel='title'
//                     // onOptionData={(data: any[]) => {
//                     //   return data?.map((a: any) => {
//                     //     return {
//                     //       ...a,
//                     //       name_X_work_package: `${a?.vendor_name} - ${a?.work_package_name}`
//                     //     }
//                     //   })
//                     // }}
//                     selectValue={'id'}
//                     isClearable
//                     async
//                     defaultOptions
//                     loadOptions={loadDropdown}
//                     control={control}
//                     rules={{
//                       required: false
//                     }}
//                   />
//                 </Col>
//                 <Col md='2' className='mt-2'>
//                   <LoadingButton
//                     block
//                     type='submit'
//                     className='mt-1'
//                     loading={isLoading}
//                     color='primary'
//                   >
//                     {FM('submit')}
//                   </LoadingButton>
//                   {/* <Button color='primary' type='submit' className='mt-2' block rounded>
//                                         {FM('submit')}
//                                     </Button> */}
//                 </Col>
//                 <Show IF={isValidArray(data?.data)}>
//                   <Show IF={watch('date')}>
//                     <Col md='3' className=''>
//                       <Button color='primary' block rounded onClick={pdf}>
//                         {loadingSample ? (
//                           <>
//                             <Spinner animation='border' size={'sm'}>
//                               <span className='visually-hidden'>Loading...</span>
//                             </Spinner>
//                           </>
//                         ) : (
//                           <>
//                             <Download size={14} /> {FM('download-pdf')}
//                           </>
//                         )}
//                       </Button>
//                     </Col>
//                     <Col md='3' className=''>
//                       <Button color='primary' block rounded onClick={excel}>
//                         {loadingExcel ? (
//                           <>
//                             <Spinner animation='border' size={'sm'}>
//                               <span className='visually-hidden'>Loading...</span>
//                             </Spinner>
//                           </>
//                         ) : (
//                           <>
//                             <Download size={14} /> {FM('download-excel')}
//                           </>
//                         )}
//                       </Button>
//                     </Col>
//                     <Col md='3' className=''>
//                       <Button color='primary' block rounded onClick={html}>
//                         {loadingHtml ? (
//                           <>
//                             <Spinner animation='border' size={'sm'}>
//                               <span className='visually-hidden'>Loading...</span>
//                             </Spinner>
//                           </>
//                         ) : (
//                           <>
//                             <Download size={14} /> {FM('download-html')}
//                           </>
//                         )}
//                       </Button>
//                     </Col>
//                     <Col md='12' className=''>
//                       <Row>
//                         <Col md='9'>
//                           <ReactMultiEmail
//                             // inputClassName=''
//                             placeholder='Enter your email'
//                             emails={dprReportEmails}
//                             onChange={(_emails: string[]) => {
//                               setDprReportsEmail(_emails)
//                             }}
//                             className='form-control'
//                             style={{
//                               minHeight: 25
//                             }}
//                             autoFocus={true}
//                             onFocus={() => setFocused(true)}
//                             onBlur={() => setFocused(false)}
//                             getLabel={(email, index, removeEmail) => {
//                               return (
//                                 <div className='bg-light-primary fw-bold ' data-tag key={index}>
//                                   <div data-tag-item className='m-20 p-20'>
//                                     <strong>{email}</strong>
//                                   </div>
//                                   <span data-tag-handle onClick={() => removeEmail(index)}>
//                                     <XCircle height={15} />
//                                   </span>
//                                 </div>
//                               )
//                             }}
//                           />
//                         </Col>
//                         <Col md='3'>
//                           <Button
//                             color='primary'
//                             className='mt-25'
//                             block
//                             rounded
//                             onClick={(e) => sendMail()}
//                           >
//                             {loadingMail ? (
//                               <>
//                                 <Spinner animation='border' size={'sm'}>
//                                   <span className='visually-hidden'>Loading...</span>
//                                 </Spinner>
//                               </>
//                             ) : (
//                               <>{FM('send-email-pdf')}</>
//                             )}
//                           </Button>
//                         </Col>
//                       </Row>
//                     </Col>
//                   </Show>
//                 </Show>
//               </Row>
//             </div>
//           </CardHeader>
//         </Card>
//         <Show IF={watch('date')}>
//           <Show IF={isLoading}>
//             <Row className='d-flex align-items-stretch'>
//               <Card>
//                 <CardBody>
//                   <Row>
//                     <Shimmer style={{ height: 320 }} />
//                   </Row>
//                 </CardBody>
//               </Card>
//             </Row>
//           </Show>
//           {dataArray?.map((item: any, index: any) => {
//             const itemData = item?.item_data || []
//             const uniqueKeys = new Set()

//             itemData?.forEach((d: any) => {
//                 d?.data?.forEach((dataObj: any) => {
//                     Object.keys(dataObj).forEach((key) => {
//                         uniqueKeys.add(key)
//                     })
//                 })
//             })
//             const fixedObj = {
//               //   ISBL: 0,
//               //   OSBL: 0,
//               'Drawing Released': 0,
//               'Front Available': 0,
//               'Work Done Till Date': 0,
//               'Plan For The Month': 0,
//               'Achieved FTM': 0

//               //   'Achieved FTD': 0
//               //   '% Complete': 0,

//               //   '% Achievement Against Plan': 0,
//               //   Productivity: 0,
//               //   'Asking Rate': 0,
//               //   Balance: 0
//             }

//             const objFromApi = isValid(itemData[0]?.data[0]) ? itemData[0]?.data[0] : {}

//             const obj = {
//               ...fixedObj,
//               ...objFromApi
//             }

//             Object.keys(obj).forEach((key) => {
//               uniqueKeys.add(key)
//             })
//             const tableHeaders1 = Array.from(uniqueKeys)
//             const tableHeaders = tableHeaders1

//             const sortedHeaders = tableHeaders
//               ?.filter((header: any, headerIndex) => {
//                 // Specify the headers you want to keep
//                 // const headersToKeep = [
//                 //   'Drawing Released',
//                 //   'original_csv',
//                 //   'project_name',
//                 //   'project_status',
//                 //   'vendor_name',
//                 //   'file_name',
//                 //   'is_dpr_submit',
//                 //   'is_this_month_submit'
//                 // ]

//                 const toKeep = [
//                   // 'Reporting Date',
//                   'Scope',
//                   'Drawing Released',
//                   'Front Available',
//                   'Work Done Till Date',
//                   '% Complete',
//                   'Balance',
//                   'Plan FTM',
//                   'Achieved FTM',
//                   'Achieved FTD',
//                   'Available Manpower'
//                 ]

//                 // Replace with your desired headers
//                 return toKeep.includes(header) // Only keep headers in the headersToKeep array
//               })
//               ?.map((header: any, index: any) => fixHeaderPosition(header, index))

//             // log('sortedHeaders', sortedHeaders)
//             return (
//               <>
//                 <Card>
//                   <CardBody className='border-bottom'>
//                     <ScrollBar>
//                       <Row md='12' className='d-flex justify-contents-between align-items-between'>
//                         <Col className=''>
//                           <h5 className='fw-bolder mb-1 text-capitalize'>
//                             {FM('project')} : {item?.work_item}{' '}
//                           </h5>
//                         </Col>
//                         <Col>
//                           <h5 className='fw-bolder text-end mb-1'>
//                             {FM('date')} : {item?.date}{' '}
//                           </h5>
//                         </Col>
//                       </Row>
//                       <Table bordered>
//                         <thead>
//                           <tr>
//                             <th style={{ verticalAlign: 'middle' }} rowSpan={2}>
//                               Particular
//                             </th>
//                             {sortedHeaders?.map((header: any, index: any) => (
//                               <th style={{ verticalAlign: 'middle' }} key={index}>
//                                 {header}
//                               </th>
//                             ))}
//                           </tr>
//                           {/* <tr>
//                             {sortedHeaders?.map((header: any, index: any) => (
//                               <th key={index}>{renderFormula(index)}</th>
//                             ))}
//                           </tr> */}
//                         </thead>
//                         <tbody>
//                           {itemData?.map((itemD: any, itemIndex: any) => {
//                             // console.log(sortedHeaders, 'sortedHeaders')
//                             return (
//                               <>
//                                 <tr>
//                                   <td className='fw-bolder'>{itemD?.project_name}</td>

//                                   {sortedHeaders?.map((header: any, headerIndex: any) => {
//                                     if (header === 'Change reason for plan ftm') {
//                                       return <>{null}</>
//                                     }

//                                     //     if (header === 'Data Date') {
//                                     //   return <td>{item?.date}</td>
//                                     // }

//                                     // if (header === 'Asking Rate') {
//                                     //     return <td className='fw-bolder'>{itemD?.askingRate}</td>

//                                     // }
//                                     // if (header === 'Productivity') {
//                                     //     return <td className='fw-bolder'>{itemD?.productivity}</td>

//                                     // }
//                                     // console.log('headersdsds', { header })

//                                     if (header === '% Complete') {
//                                       const wdtd = dashValueWithFormula(
//                                         'Work Done Till Date',
//                                         itemD?.data,
//                                         itemD
//                                       )
//                                       const scp = dashValueWithFormula('Scope', itemD?.data, itemD)
//                                       return (
//                                         <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
//                                           {wdtd > 0 && scp > 0
//                                             ? Number((wdtd / scp) * 100).toFixed(2) + '%'
//                                             : '-'}
//                                         </th>
//                                       )
//                                     }

//                                     return (
//                                       <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
//                                         {header === '% Completed w.r.t. total scope' ||
//                                         header === '% Achievement Against Plan FTM'
//                                           ? commaFormatter(
//                                               dashValueWithFormula(
//                                                 header,
//                                                 itemD?.data,

//                                                 itemD
//                                               )
//                                             ) >= 0
//                                             ? renderWithPercentage(
//                                                 commaFormatter(
//                                                   dashValueWithFormula(header, itemD?.data, itemD)
//                                                 ),
//                                                 header
//                                               )
//                                             : '-'
//                                           : commaFormatter(
//                                               dashValueWithFormula(header, itemD?.data, itemD)
//                                             )}
//                                       </th>
//                                     )
//                                   })}
//                                 </tr>

//                                 {itemD.data?.map((data: any, dataIndex: any) => {
//                                   //divide project value  -
//                                   // return (<>
//                                   //     <tr key={`${itemIndex}`}>
//                                   //         <td>
//                                   //             {/* <a href={data?.original_csv}>{data?.vendor_name}</a> */}
//                                   //         </td>
//                                   //         {sortedHeaders.map((header: any, headerIndex: any) => {
//                                   //             const headerValue = isValid(data?.[header])
//                                   //                 ? data?.[header]
//                                   //                 : 0
//                                   //             return (
//                                   //                 <td key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
//                                   //                     {/* {header === "% Complete" || header === "% Achievement Against Plan" ? `${commaFormatter(headerValue)}%` : commaFormatter(headerValue)} */}
//                                   //                     {(header === '% Complete' ||
//                                   //                         header === '% Achievement Against Plan') &&
//                                   //                         headerValue >= 0
//                                   //                         ? parseFloat(commaFormatter(
//                                   //                             renderDashValue(
//                                   //                                 header,
//                                   //                                 data
//                                   //                             )
//                                   //                         )) >= 0 ? renderWithPercentage(commaFormatter(
//                                   //                             renderDashValue(
//                                   //                                 header,
//                                   //                                 data
//                                   //                             )
//                                   //                         ), header) : '-'
//                                   //                         : (header === '% Complete' ||
//                                   //                             header === '% Achievement Against Plan') &&
//                                   //                             headerValue === 0
//                                   //                             ? renderWithPercentage(commaFormatter(
//                                   //                                 renderDashValue(
//                                   //                                     header,
//                                   //                                     data
//                                   //                                 )
//                                   //                             ), header)
//                                   //                             : commaFormatter(
//                                   //                                 renderDashValue(
//                                   //                                     header,
//                                   //                                     data
//                                   //                                 )
//                                   //                             )}
//                                   //                 </td>
//                                   //             )
//                                   //         })}
//                                   //     </tr>
//                                   // </>
//                                   // )
//                                 })}
//                               </>
//                             )
//                           })}
//                           <tr>
//                             <th>Total</th>
//                             {sortedHeaders?.map((header: any, headerIndex: any) => {
//                               let total = 0

//                               if (header === '% Complete') {
//                                 let wdtd = 0
//                                 let scp = 0
//                                 for (const item of itemData) {
//                                   const x = dashValueWithFormula(
//                                     'Work Done Till Date',
//                                     item?.data,
//                                     item
//                                   )

//                                   wdtd += x === '-' || typeof x === 'string' ? 0 : x
//                                   const y = dashValueWithFormula('Scope', item?.data, item)

//                                   scp += y === '-' || typeof y === 'string' ? 0 : y
//                                 }

//                                 total += Number((wdtd / scp) * 100)

//                                 return (
//                                   <th key={`${headerIndex}-${headerIndex}-${headerIndex}`}>
//                                     {total > 0 ? total?.toFixed(2) + '%' : '-'}
//                                   </th>
//                                 )
//                               } else {
//                                 for (const item of itemData) {
//                                  const b = dashValueWithFormula(header, item?.data, item)

//                                   total += b === '-' || typeof b === 'string' ? 0 : b
//                                 }
//                               }

//                               return (
//                                 <th key={`${headerIndex}-${headerIndex}-${headerIndex}`}>
//                                   {total > 0 ? commaFormatter(total) : '-'}
//                                 </th>
//                               )
//                             })}
//                           </tr>
//                           {/* <tr>
//                             <td className='fw-bolder'>{FM('total')}</td>
//                             {sortedHeaders?.map((header: any, headerIndex: any) => {
//                               if (header === 'Change reason for plan ftm') {
//                                 return <>{null}</>
//                               }

//                               const total = calculateAllTotal(
//                                 header,
//                                 itemData
//                                   .flat(Infinity)
//                                   ?.map((a: any) => a?.data)
//                                   .flat(Infinity)
//                               )
//                               const totalAskingRate = itemData?.reduce((sum, item) => {
//                                 const rate = parseFloat(item.askingRate || 0)
//                                 return sum + rate
//                               }, 0)

//                               const totalProductivity = itemData?.reduce((sum, item) => {
//                                 const rate = parseFloat(item.productivity || 0)
//                                 return sum + rate
//                               }, 0)

//                               const totalManpower = itemData?.reduce((sum, item) => {
//                                 const rate = parseFloat(item.Manpower || 0)
//                                 return sum + rate
//                               }, 0)

//                               return (
//                                 <>
//                                   <th>
//                                     {header === '% Completed w.r.t. total scope' ||
//                                     header === '% Achievement Against Plan FTM'
//                                       ? commaFormatter(total) >= 0
//                                         ? renderWithPercentage(commaFormatter(total), header)
//                                         : '-'
//                                       : commaFormatter(total)}
//                                   </th>
//                                 </>
//                               )
//                             })}
//                           </tr> */}
//                         </tbody>
//                       </Table>
//                     </ScrollBar>
//                   </CardBody>
//                 </Card>
//               </>
//             )
//           })}
//           {isSuccess && !isValidArray(data?.data) ? (
//             <Card>
//               <CardBody className=''>
//                 <Row className='px-2 fw-bolder'>
//                   There are no records to display. Please select the correct Date.
//                 </Row>
//               </CardBody>
//             </Card>
//           ) : (
//             ''
//           )}
//           <Show IF={isValidArray(resultData?.data?.data)}>
//             <Card>
//               <CardBody className='pb-0 border-bottom mb-2 pt-1'>
//                 <Row md='12' className='d-flex justify-contents-between align-items-between'>
//                   <Col className=''>
//                     <h5 className='fw-bolder mb-1'>{FM('manpower-table')}</h5>
//                   </Col>
//                   <Col>
//                     <h5 className='fw-bolder text-end mb-1'>
//                       {FM('data-date')} : {formatDate(watch('date'), 'DD MMM YYYY')}{' '}
//                     </h5>
//                   </Col>
//                 </Row>
//               </CardBody>
//               <CardBody className='border-bottom pt-0'>
//                 <ScrollBar>
//                   <Table>
//                     <thead>
//                       <tr>
//                         <th>{FM('project')}</th>
//                         {getWorkPackage().map((workPackage, index) => {
//                           return <th>{workPackage?.name}</th>
//                         })}
//                       </tr>
//                     </thead>
//                     <tbody>{renderTrTd()}</tbody>
//                   </Table>
//                 </ScrollBar>
//               </CardBody>
//             </Card>
//           </Show>
//         </Show>
//       </Form>
//     </>
//   )
// }

// export default DPRReport

// import useUser from '@hooks/useUser'
// import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
// import Header from '@src/modules/common/components/header'
// import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
// import { useImportDprListMutation } from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
// import Hide from '@src/utility/Hide'
// import Show from '@src/utility/Show'
// import {
//   ErrorToast,
//   FM,
//   SuccessToast,
//   commaFormatter,
//   fastLoop,
//   formatDate,
//   isValid,
//   isValidArray,
//   kFormatter,
//   log
// } from '@src/utility/Utils'
// import ApiEndpoints from '@src/utility/http/ApiEndpoints'
// import { downloadPDF } from '@src/utility/http/Apis/downloadDPR'
// import { loadDropdown } from '@src/utility/http/Apis/dropdown'
// import { stateReducer } from '@src/utility/stateReducer'
// import { DprReportList } from '@src/utility/types/typeDPR'
// import { useEffect, useReducer, useState } from 'react'
// import { Download, XCircle } from 'react-feather'
// import { useForm } from 'react-hook-form'
// import ScrollBar from 'react-perfect-scrollbar'
// import { useNavigate } from 'react-router-dom'
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Col,
//   Form,
//   Label,
//   Row,
//   Spinner,
//   Table
// } from 'reactstrap'
// import { useLoadManpowerMutation } from '../../redux/RTKQuery/GraphRTK'
// import { ReactMultiEmail } from 'react-multi-email'
// import 'react-multi-email/dist/style.css'
// import useNumberCommaFormatter from '@src/utility/NumCommaFormat'
// import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'

// interface States {
//   page?: any
//   per_page_record?: any
//   changeObject?: any
//   search?: any
//   reload?: any
//   logFilter?: boolean
//   isRemoving?: boolean
//   isReloading?: boolean
//   isAddingNewData?: boolean
//   transactionFilter?: boolean
//   filterData?: any
//   lastRefresh?: any
//   edit?: any
//   selectedItem?: any
// }
// const DPRReport = () => {
//   const initState: States = {
//     page: 1,
//     lastRefresh: new Date().getTime(),
//     per_page_record: 15,
//     changeObject: null,
//     transactionFilter: false,
//     filterData: null,
//     search: undefined,
//     isRemoving: false,
//     isReloading: false,
//     isAddingNewData: false
//   }
//   const useComma = useNumberCommaFormatter(true)
//   const reducers = stateReducer<States>
//   const [state, setState] = useReducer(reducers, initState)
//   const form = useForm<DprReportList>()
//   const nav = useNavigate()
//   const [loadingSample, setLoadingSample] = useState(false)
//   const [loadingHtml, setLoadingHtml] = useState(false)
//   const [loadingExcel, setLoadingExcel] = useState(false)
//   const [loadingMail, setLoadingMail] = useState(false)
//   const [dprReportEmails, setDprReportsEmail] = useState<string[]>([])
//   const [focused, setFocused] = useState(false)

//   const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
//   const [loadReport, { data, isError, isLoading, isSuccess }] = useImportDprListMutation()
//   const [loadManpower, resultData] = useLoadManpowerMutation()
//   const userData = useUser()

//   const load = () => {
//     if (isValid(watch('date'))) {
//       loadReport({
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value
//       })
//     }
//   }
//   ///rjehuftgjfhetgyuire

//   const loadMan = () => {
//     if (isValid(watch('date'))) {
//       loadManpower({
//         jsonData: {
//           date: watch('date'),
//           project_id: watch('project_id')?.value,
//           vender_id: watch('vender_id')?.value,
//           item_desc: watch('work_item')?.value
//         }
//       })
//     }
//   }

//   //['testEMail@gmail.com', 'another@gmail.com']   remove [] and convert  data like "testEMail@gmail.com,another@gmail.com"

//   const sendEmails = (emails: string[]) => {
//     const emailList = emails.filter((email) => email !== '')
//     return `${emailList.join(',')}`
//   }

//   //"dfsg@gmail.com,dsfs@gmail.com"  convert to ["dfsg@gmail.com","dsfs@gmail.com"]
//   const getEmails = (emails: string) => {
//     const emailList = emails?.split(',')
//     return emailList
//   }

//   const Reset = (e: any) => {
//     reset()
//     setDprReportsEmail([])
//   }

//   useEffect(() => {
//     load()
//     loadMan()
//   }, [state?.lastRefresh])

//   const onSubmit = (d: any) => {
//     load()
//     loadMan()
//   }

//   const pdf = () => {
//     downloadPDF({
//       jsonData: {
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value,
//         type: 'pdf'
//       },
//       loading: setLoadingSample,
//       success: (e: any) => {
//         window.open(`${e?.data}`, '_blank')
//       },
//       error: (e: any) => {
//         ErrorToast(e?.data)
//       }
//     })
//   }

//   const html = () => {
//     downloadPDF({
//       jsonData: {
//         type: 'html',
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value
//       },
//       loading: setLoadingHtml,
//       success: (e: any) => {
//         window.open(`${e?.data}`, '_blank')
//       },
//       error: (e: any) => {
//         ErrorToast(e?.data)
//       }
//     })
//   }

//   const excel = () => {
//     downloadPDF({
//       jsonData: {
//         type: 'excel',
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value
//       },
//       loading: setLoadingExcel,
//       success: (e: any) => {
//         window.open(`${e?.data}`, '_blank')
//       },
//       error: (e: any) => {
//         ErrorToast(e?.data)
//       }
//     })
//   }

//   const sendMail = () => {
//     downloadPDF({
//       jsonData: {
//         type: 'mail',
//         date: watch('date'),
//         project_id: watch('project_id')?.value,
//         vender_id: watch('vender_id')?.value,
//         item_desc: watch('work_item')?.value,
//         //email: dprReportEmails,
//         email: sendEmails(dprReportEmails)
//       },
//       loading: setLoadingMail,
//       success: (e: any) => {
//         //  SuccessToast(e?.message)
//       },
//       error: (e: any) => {
//         ErrorToast(e?.message)
//       }
//     })
//   }

//   useEffect(() => {
//     setDprReportsEmail(getEmails(data?.email))
//   }, [data?.email])

//   const tests = resultData?.data?.data
//   // sum all the manpower by project and work_package
//   const groupProject = () => {
//     const re: any[] = []
//     fastLoop(tests, (test, index) => {
//       if (re?.hasOwnProperty(test?.project)) {
//         re[test?.project] = ''
//       } else {
//         re[test?.project] = ''
//       }
//     })
//     // log(re)
//     return re
//   }

//   // merge work_package
//   const getWorkPackage = (key?: string) => {
//     const oreo: any[] = []
//     const re: any[] = []
//     fastLoop(tests, (test, index) => {
//       if (key) {
//         if (re?.hasOwnProperty(test?.project)) {
//           re[test?.project] = {
//             data: [...re[test?.project]?.data, ...test?.profiles?.map((a) => a)],
//             project: test?.project
//           }
//         } else {
//           re[test?.project] = { data: test?.profiles?.map((a) => a), project: test?.project }
//         }
//       }
//       fastLoop(test?.profiles, (profile, index) => {
//         // find name
//         const findIndex = oreo?.findIndex((a) => a?.name === profile?.work_package)
//         if (findIndex !== -1) {
//           oreo[findIndex] = {
//             name: profile?.work_package,
//             manpower: key
//               ? re[key]?.data
//                   ?.filter((a) => a?.work_package === profile?.work_package)
//                   ?.map((a) => a?.manpower)
//                   .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
//               : 0,
//             key
//           }
//         } else {
//           oreo.push({
//             name: profile?.work_package,
//             manpower: key
//               ? re[key]?.data
//                   ?.filter((a) => a?.work_package === profile?.work_package)
//                   ?.map((a) => a?.manpower)
//                   .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
//               : 0,
//             key
//           })
//         }
//       })
//     })
//     // log(oreo)
//     return oreo
//   }

//   // get the manpower by work_package
//   const getPackageWiseData = (key: string) => {
//     const re: any[] = []
//     fastLoop(getWorkPackage(key), (work_package, index) => {
//       re.push(<td>{work_package?.manpower ?? 0}</td>)
//     })
//     return re
//   }

//   // loop through all the projects
//   const renderTrTd = () => {
//     const re: any[] = []
//     for (const [key, value] of Object.entries(groupProject())) {
//       re.push(
//         <tr>
//           <td>{key}</td>
//           {getPackageWiseData(key)}
//         </tr>
//       )
//     }
//     return re
//   }

//   const renderFormula = (index: any) => {
//     //const total_number_of_days_in_month = new Date(new Date(watch('date')).getFullYear(), new Date(watch('date')).getMonth() + 1, 0).getDate()
//     const total_number_of_days_in_month = new Date(
//       new Date(watch('date')).getFullYear(),
//       new Date(watch('date')).getMonth() + 1,
//       0
//     ).getDate()
//     const getDate = new Date(watch('date')).getDate()

//     const selectedDate = new Date(watch('date'))
//     const years = selectedDate.getFullYear()
//     const months = selectedDate.getMonth() // 0-based month

//     const totalDaysInMonth = new Date(years, months + 1, 0).getDate()

//     let sundayCounts = 0

//     for (let day = 1; day <= totalDaysInMonth; day++) {
//       const currentDate = new Date(years, months, day)
//       if (currentDate.getDay() === 0) {
//         // 0 = Sunday
//         sundayCounts++
//       }
//     }

//     function countSundaysBetweenDates(startDateStr: string, endDateStr: string): number {
//       const startDate = new Date(startDateStr)
//       const endDate = new Date(endDateStr)

//       let count = 0

//       // loop through the dates
//       while (startDate <= endDate) {
//         if (startDate.getDay() === 0) {
//           // Sunday is 0 in getDay()
//           count++
//         }
//         startDate.setDate(startDate.getDate() + 1) // move to next day
//       }

//       return count
//     }

//     // Example usage:
//     const day = 1
//     const month = formatDate(new Date(watch('date')), 'MM')
//     const year = formatDate(new Date(watch('date')), 'YYYY')
//     const end = formatDate(new Date(watch('date')), 'YYYY-MM-DD')
//     const start = `${year}-${month}-${day}`
//     const today = new Date()
//     // const years = today.getFullYear()
//     // const months = today.getMonth() + 1 // since getMonth() is 0-based

//     // const lastDateOfCurrentMonth = new Date(years, months, 0)
//     // console.log(lastDateOfCurrentMonth, 'fdf')

//     const sundaysCount = countSundaysBetweenDates(start, end)

//     const workingDays = getDate - sundaysCount
//     const CountMonth = total_number_of_days_in_month - sundayCounts

//     //     log(`Total Sundays between ${start} and ${end}:`, sundaysCount)
//     //    log(`Working Days (excluding Sundays):`, workingDays)

//     if (index === 0) {
//       return 'A'
//     } else if (index === 1) {
//       return 'B'
//     } else if (index === 2) {
//       return 'C'
//     } else if (index === 3) {
//       return `D`
//     } else if (index === 4) {
//       return `E=(D/A)%`
//     } else if (index === 5) {
//       return `F=A-D`
//     } else if (index === 6) {
//       return `G`
//     } else if (index === 7) {
//       return `H`
//     } else if (index === 8) {
//       return `I`
//     } else if (index === 9) {
//       // J=[H/{G*(12/25)}]%
//       return `J=[H/{G*(${workingDays}/${CountMonth})}]%`
//     } else if (index === 10) {
//       return `K`
//     } else if (index === 11) {
//       return `L=H/avg(K)*(${workingDays}/${CountMonth})`
//     } else if (index === 12) {
//       //   M = [(G - H) / (25 - 12)]
//       return `M=[(G-H)/(${CountMonth}-${workingDays})]`
//     }
//   }

//   const renderDashValue = (header: string, data: any) => {
//     const vendorData = data
//     const scope: number = isValid(parseFloat(vendorData?.Scope)) ? parseFloat(vendorData?.Scope) : 0
//     const dr: number = isValid(vendorData?.['Drawing Released'])
//       ? parseFloat(vendorData?.['Drawing Released'])
//       : 0
//     const workdoneTillDate = isValid(vendorData?.['Work Done Till Date'])
//       ? parseFloat(vendorData?.['Work Done Till Date'])
//       : 0
//     const planFTM = isValid(vendorData?.['Plan FTM']) ? parseFloat(vendorData?.['Plan FTM']) : 0
//     const achievedFTM = isValid(vendorData?.['Achieved FTM'])
//       ? parseFloat(vendorData?.['Achieved FTM'])
//       : 0
//     const achievedFTD: number = isValid(vendorData?.['Achieved FTD'])
//       ? parseFloat(vendorData?.['Achieved FTD'])
//       : 0
//     const frontAvailable: number = isValid(vendorData?.['Front Available'])
//       ? parseFloat(vendorData?.['Front Available'])
//       : 0
//     const getDate = new Date(watch('date')).getDate()
//     const isThisMonthSubmitted: boolean = vendorData?.is_this_month_submit
//     const isDprSubmitted: boolean = vendorData?.is_dpr_submit
//     const total_number_of_days_in_month = new Date(
//       new Date(watch('date')).getFullYear(),
//       new Date(watch('date')).getMonth() + 1,
//       0
//     ).getDate()
//     // log('vendorData', vendorData)
//     let total: any = 0

//     if (header === 'Scope') {
//       if (scope > 0) {
//         total = scope
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Front Available') {
//       if (frontAvailable > 0) {
//         total = frontAvailable
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Drawing Released') {
//       if (dr > 0) {
//         total = dr
//       } else {
//         total = '-'
//       }
//     } else if (header === '% Complete') {
//       if (scope > 0 && workdoneTillDate > 0) {
//         total = (workdoneTillDate / scope) * 100
//       } else {
//         total = 0
//       }
//     } else if (header === 'Work Done Till Date') {
//       if (workdoneTillDate > 0) {
//         total = workdoneTillDate
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Balance') {
//       if (scope >= 0 && workdoneTillDate >= 0) {
//         total = scope - workdoneTillDate
//       } else {
//         total = vendorData?.[header]
//       }
//     } else {
//       if (vendorData?.[header] > 0) {
//         total = vendorData?.[header]
//       }
//     }
//     if (isThisMonthSubmitted === true) {
//       if (header === 'Plan FTM') {
//         if (planFTM > 0) {
//           total = planFTM
//         } else {
//           total = '-'
//         }
//       } else if (header === 'Achieved FTM') {
//         if (achievedFTM > 0) {
//           total = achievedFTM
//         } else {
//           total = '-'
//         }
//       } else if (header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM') {
//         if (achievedFTM > 0 && planFTM > 0) {
//           total = (achievedFTM / (planFTM * (getDate / total_number_of_days_in_month))) * 100
//         } else {
//           total = '-'
//         }
//       } else if (header === 'Achieved FTD') {
//         if (isDprSubmitted === true) {
//           if (achievedFTD > 0) {
//             total = achievedFTD
//           } else {
//             total = '-'
//           }
//         } else {
//           total = '-'
//         }
//       }
//     } else {
//       if (header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM') {
//         total = 0
//       } else if (header === 'Achieved FTD') {
//         total = '-'
//       } else if (header === 'Plan FTM') {
//         total = '-'
//       } else if (header === 'Achieved FTM') {
//         total = '-'
//       } else if (header === '% Complete') {
//         total = vendorData?.[header]
//       } else if (header === 'Balance') {
//         if (vendorData?.[header] > 0) {
//           total = vendorData?.[header]
//         } else {
//           total = 0
//         }
//       } else {
//         if (vendorData?.[header] > 0) {
//           total = vendorData?.[header]
//         } else {
//           total = '-'
//         }
//       }
//     }

//     return total
//   }
//   const calculateTotal = (header: string, data?: any) => {
//     //log(data, "data")
//     let totalPlanFTM: number = 0
//     data?.forEach((item) => {
//       if (item?.hasOwnProperty(header)) {
//         if (isValid(item[header])) {
//           if (item?.is_this_month_submit === true) {
//             if (header === 'Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTD') {
//               if (item?.is_dpr_submit === true) {
//                 totalPlanFTM += parseFloat(item[header])
//               } else {
//                 totalPlanFTM += 0
//               }
//             } else if (header === '% Achievement Against Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           } else {
//             if (header === '% Achievement Against Plan FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Plan FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTD') {
//               totalPlanFTM += 0
//             } else if (header === 'Manpower') {
//               totalPlanFTM += parseFloat(item[header])
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           }
//         }
//       }
//     })
//     return totalPlanFTM
//   }

//   const calculateAvg = (header: string, data?: any) => {
//     //log(data, "data")
//     let totalPlanFTM: number = 0
//     let length = data?.length
//     log(length, 'length')
//     data?.forEach((item) => {
//       if (item?.hasOwnProperty(header)) {
//         if (isValid(item[header])) {
//           if (item?.is_this_month_submit === true) {
//             if (header === 'Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else if (header === 'Achieved FTD') {
//               if (item?.is_dpr_submit === true) {
//                 totalPlanFTM += parseFloat(item[header])
//               } else {
//                 totalPlanFTM += 0
//               }
//             } else if (header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM') {
//               totalPlanFTM += parseFloat(item[header])
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           } else {
//             if (header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Plan FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTM') {
//               totalPlanFTM += 0
//             } else if (header === 'Achieved FTD') {
//               totalPlanFTM += 0
//             } else if (header === 'Manpower') {
//               totalPlanFTM = (totalPlanFTM + parseFloat(item[header])) / length
//             } else {
//               totalPlanFTM += parseFloat(item[header])
//             }
//           }
//         }
//       }
//     })
//     return totalPlanFTM
//   }

//   //   const calculateAllTotal = (header: string, data?: any) => {
//   //     let re: number = 0
//   //     data?.forEach((item) => {
//   //       if (item?.hasOwnProperty(header)) {
//   //         const totalScope = calculateTotal('Scope', data)
//   //         const totalDrawingReleased = calculateTotal('Drawing Released', data)
//   //         const totalFrontAvailable = calculateTotal('Front Available', data)
//   //         const totalWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
//   //         const totalData =
//   //           Number(calculateTotal('Scope', data)) -
//   //           Number(calculateTotal('Work Done Till Date', data))

//   //         const totalPlanFTM = calculateTotal('Plan FTM', data)
//   //         const totalAchievedFTM = calculateTotal('Achieved FTM', data)
//   //         const totalAchievedFTD = calculateTotal('Achieved FTD', data)
//   //         const totalProductivity = calculateTotal('Productivity', data)
//   //         const totalAskingRate = calculateTotal('Asking Rate', data)
//   //         const getDate = new Date(watch('date')).getDate()
//   //         const total_number_of_days_in_month = new Date(
//   //           new Date(watch('date')).getFullYear(),
//   //           new Date(watch('date')).getMonth() + 1,
//   //           0
//   //         ).getDate()

//   //         const selectedDate = new Date(watch('date'))
//   //         const years = selectedDate.getFullYear()
//   //         const months = selectedDate.getMonth() // 0-based month

//   //         const totalDaysInMonth = new Date(years, months + 1, 0).getDate()

//   //         let sundayCounts = 0

//   //         for (let day = 1; day <= totalDaysInMonth; day++) {
//   //           const currentDate = new Date(years, months, day)
//   //           if (currentDate.getDay() === 0) {
//   //             // 0 = Sunday
//   //             sundayCounts++
//   //           }
//   //         }

//   function countSundaysBetweenDates(startDateStr: string, endDateStr: string): number {
//     const startDate = new Date(startDateStr)
//     const endDate = new Date(endDateStr)

//     let count = 0

//     // loop through the dates
//     while (startDate <= endDate) {
//       if (startDate.getDay() === 0) {
//         // Sunday is 0 in getDay()
//         count++
//       }
//       startDate.setDate(startDate.getDate() + 1) // move to next day
//     }

//     return count
//   }

//   //         // Example usage:
//   //         const day = 1
//   //         const month = formatDate(new Date(watch('date')), 'MM')
//   //         const year = formatDate(new Date(watch('date')), 'YYYY')
//   //         const end = formatDate(new Date(watch('date')), 'YYYY-MM-DD')
//   //         const start = `${year}-${month}-${day}`
//   //         const today = new Date()
//   //         // const years = today.getFullYear()
//   //         // const months = today.getMonth() + 1 // since getMonth() is 0-based

//   //         // const lastDateOfCurrentMonth = new Date(years, months, 0)
//   //         // console.log(lastDateOfCurrentMonth, 'fdf')

//   //         const sundaysCount = countSundaysBetweenDates(start, end)

//   //         const workingDays = getDate - sundaysCount
//   //         const CountMonth = total_number_of_days_in_month - sundayCounts

//   //         if (isValid(item[header])) {
//   //           if (header === 'Scope') {
//   //             //A
//   //             re = totalScope
//   //             // console.log(re, 'RES')
//   //           } else if (header === 'Front Available') {
//   //             //C
//   //             re = totalFrontAvailable
//   //           } else if (header === 'Drawing Released') {
//   //             //B
//   //             re = totalDrawingReleased
//   //           } else if (header === 'Work Done Till Date') {
//   //             //D

//   //             re = totalWorkDoneTillDate
//   //           } else if (header === '% Completed w.r.t. total scope') {
//   //             //E = (D/A)%
//   //             re = Number(
//   //               ((totalWorkDoneTillDate / totalScope) * 100).toFixed(2).replace(/\.?0*$/, '')
//   //             )
//   //             console.log(re, 'RES Comp')
//   //           } else if (header === 'Balance w.r.t. total scope') {
//   //             //F = A-D
//   //             re = Number((totalScope - totalWorkDoneTillDate).toFixed(2).replace(/\.?0*$/, ''))
//   //           } else if (header === 'Plan FTM') {
//   //             //G
//   //             re = totalPlanFTM
//   //           } else if (header === 'Achieved FTM') {
//   //             //H
//   //             re = totalAchievedFTM
//   //           } else if (header === 'Achieved FTD') {
//   //             //I
//   //             re = totalAchievedFTD
//   //           } else if (header === '% Achievement Against Plan FTM') {
//   //             //J = [H/{G*(getDate/total_number_of_days_in_month)}]%
//   //             re = Number((totalAchievedFTM / (totalPlanFTM * (workingDays / CountMonth))) * 100)
//   //           } else if (header === 'Productivity') {
//   //             re = totalProductivity
//   //           } else if (header === 'Asking Rate') {
//   //             re = totalAskingRate
//   //           } else {
//   //             re = item[header]
//   //           }
//   //         }
//   //       }
//   //     })
//   //     return re
//   //   }
//   const calculateAllTotal = (header: string, data?: any) => {
//     let re: number = 0

//     if (!data) return re

//     const totalScope = calculateTotal('Scope', data)
//     const totalDrawingReleased = calculateTotal('Drawing Released', data)
//     const totalFrontAvailable = calculateTotal('Front Available', data)
//     const totalWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
//     const totalPlanFTM = calculateTotal('Plan FTM', data)
//     const totalAchievedFTM = calculateTotal('Achieved FTM', data)
//     const totalAchievedFTD = calculateTotal('Achieved FTD', data)
//     const totalProductivity = calculateTotal('Productivity', data)
//     const totalAskingRate = calculateTotal(('Asking Rate (Uom/Day)'), data)

//     const totalManpower = calculateTotal('Manpower', data)

//     const getDate = new Date(watch('date')).getDate()
//     const selectedDate = new Date(watch('date'))
//     const years = selectedDate.getFullYear()
//     const months = selectedDate.getMonth()
//     const total_number_of_days_in_month = new Date(years, months + 1, 0).getDate()

//     // Count Sundays in month
//     let sundayCounts = 0
//     for (let day = 1; day <= total_number_of_days_in_month; day++) {
//       if (new Date(years, months, day).getDay() === 0) sundayCounts++
//     }

//     const start = `${years}-${formatDate(selectedDate, 'MM')}-01`
//     const end = formatDate(selectedDate, 'YYYY-MM-DD')
//     const sundaysCount = countSundaysBetweenDates(start, end)

//     const workingDays = getDate - sundaysCount
//     const CountMonth = total_number_of_days_in_month - sundayCounts

//     // Now compute the required total based on header
//     if (header === 'Scope') {
//       re = totalScope
//     } else if (header === 'Front Available') {
//       re = totalFrontAvailable
//     } else if (header === 'Drawing Released') {
//       re = totalDrawingReleased
//     } else if (header === 'Work Done Till Date') {
//       re = totalWorkDoneTillDate
//     } else if (header === '% Completed w.r.t. total scope') {
//       re = Number(((totalWorkDoneTillDate / totalScope) * 100).toFixed(2))
//     } else if (header === 'Balance w.r.t. total scope') {
//       re = Number((totalScope - totalWorkDoneTillDate).toFixed(2))
//     } else if (header === 'Plan FTM') {
//       re = totalPlanFTM
//     } else if (header === 'Achieved FTM') {
//       re = totalAchievedFTM
//     } else if (header === 'Achieved FTD') {
//       re = totalAchievedFTD
//     } else if (header === 'Manpower') {
//       re = totalManpower
//     } else if (header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM') {
//       // [H/{G*(12/25)}]%
//       const number = Number(totalAchievedFTM / (totalPlanFTM * (workingDays / CountMonth)))
//       const percentage = Number((number * 100).toFixed(2))
//       re = percentage
//     } else if (header === 'Productivity' ||'Productivity (UoM/Man-month)') {

//       re = Number(totalAchievedFTM / (totalManpower * (workingDays / CountMonth)))
//     } else if (header === 'Asking Rate' ||'Asking Rate (Uom/Day)') {
//       re = totalAskingRate
//     } else {
//       // If header not matching known keys, just pick first available item's value for that header
//       const item = data.find((item) => item?.hasOwnProperty(header))
//       if (item && isValid(item[header])) re = item[header]
//     }

//     return re
//   }

//   const renderWithPercentage = (value?: any, header?: any) => {
//     log(header, 'Val')
//     if (header === '% Completed w.r.t. total scope') {
//       if (value >= 0) {
//         return `${value}%`
//       }
//     } else if (header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM') {
//       if (value > 0) {
//         return `${value}%`
//       } else {
//         return '-'
//       }
//     }
//     return value
//   }
//   const dashValueWithFormula = (header: string, data: any, itemData: any) => {
//     // console.log(header, data, 'header')
//     console.log('header', { header }, 'header')
//     const dynamicTotal: number = calculateTotal(header, data)
//     let total: any = dynamicTotal
//     //calculate total sum of Plan FTM in is array of data find total of Plan FTM
//     const sumOfPlanFTM = calculateTotal('Plan FTM', data)
//     const someOfFrontAvailable = calculateTotal('Front Available', data)
//     const sumOfWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
//     const sumOfAchievedFTD = calculateTotal('Achieved FTD', data)
//     const sumOfScope = calculateTotal('Scope', data)
//     const sumOfAchievedFTM = calculateTotal('Achieved FTM', data)
//     const sumOfDrawingRelease = calculateTotal('Drawing Released', data)

//     const getDate = new Date(watch('date')).getDate()
//     const selectedDate = new Date(watch('date'))
//     const years = selectedDate.getFullYear()
//     const months = selectedDate.getMonth()
//     const total_number_of_days_in_month = new Date(years, months + 1, 0).getDate()

//     // Count Sundays in month
//     let sundayCounts = 0
//     for (let day = 1; day <= total_number_of_days_in_month; day++) {
//       if (new Date(years, months, day).getDay() === 0) sundayCounts++
//     }

//     const start = `${years}-${formatDate(selectedDate, 'MM')}-01`
//     const end = formatDate(selectedDate, 'YYYY-MM-DD')
//     const sundaysCount = countSundaysBetweenDates(start, end)

//     const workingDays = getDate - sundaysCount
//     const CountMonth = total_number_of_days_in_month - sundayCounts

//     // log('formuladata', itemData?.is_this_month_submit)
//     if (header === 'Drawing Released') {
//       if (sumOfDrawingRelease > 0) {
//         total = sumOfDrawingRelease
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Scope') {
//       if (sumOfScope > 0) {
//         total = sumOfScope
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Work Done Till Date') {
//       if (sumOfWorkDoneTillDate > 0) {
//         total = sumOfWorkDoneTillDate
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Front Available') {
//       total = someOfFrontAvailable
//     } else if (header === 'Plan FTM') {
//       if (sumOfPlanFTM > 0) {
//         total = sumOfPlanFTM
//       } else {
//         total = '-'
//       }
//     } else if (header === 'Achieved FTM') {
//       if (sumOfAchievedFTM > 0) {
//         return sumOfAchievedFTM
//       } else {
//         return '-'
//       }
//     } else if (header === 'Achieved FTD') {
//       if (sumOfAchievedFTD > 0) {
//         total = sumOfAchievedFTD
//       } else {
//         total = '-'
//       }
//     } else if (header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM') {
//       if (sumOfPlanFTM > 0 && sumOfAchievedFTM > 0) {
//         // J=[H/{G*(11/27)}]%

//      log(
//           `(${sumOfAchievedFTM}/(${sumOfPlanFTM} * (${workingDays} / ${CountMonth}))) * 100`
//         )

//         total = (sumOfAchievedFTM / (sumOfPlanFTM * (workingDays / CountMonth))) * 100
//         // log('Achievement Against Plan', total)
//         // }
//       } else {
//         total = 0
//       }
//     } else if (header === '% Completed w.r.t. total scope') {
//       log('anil', total, 'scope', sumOfScope, 'work_done_till_date', sumOfWorkDoneTillDate)

//       if (sumOfWorkDoneTillDate > 0 && sumOfScope > 0) {
//         total = ((sumOfWorkDoneTillDate / sumOfScope) * 100).toFixed(2).replace(/\.?0*$/, '')
//         console.log(total, 'total')
//         // }
//       } else {
//         total = 0
//       }
//     } else if (header === 'Balance w.r.t. total scope') {
//       if (sumOfScope >= 0 && sumOfWorkDoneTillDate >= 0) {
//         total = (sumOfScope - sumOfWorkDoneTillDate).toFixed(2).replace(/\.?0*$/, '')
//       } else {
//         total = 0
//       }
//     }

//     return total
//   }

//   const fixHeaderPosition = (header?: any, index?: any) => {
//     if (index === 0) {
//       return 'Scope'
//     } else if (index === 1) {
//       return 'Drawing Released'
//     } else if (index === 2) {
//       return 'Front Available'
//     } else if (index === 3) {
//       return 'Work Done Till Date'
//     } else if (index === 4) {
//       return '% Completed w.r.t. total scope'
//     } else if (index === 5) {
//       return 'Balance w.r.t. total scope'
//     } else if (index === 6) {
//       return 'Plan FTM'
//     } else if (index === 7) {
//       return 'Achieved FTM'
//     } else if (index === 8) {
//       return 'Achieved FTD'
//     } else if (index === 9) {
//       return '% Achievement Against Progessive Plan FTM'
//     } else if (index === 10) {
//       return 'Manpower'
//     } else if (index === 11) {
//       return 'Productivity (UoM/Man-month)'
//     } else if (index === 12) {
//       return 'Asking Rate (Uom/Day)'
//     }

//     return header
//   }
//   // Extract the keys (table headers) from the first data item
//   const dataArray = data?.data?.map((a: any) => a) || []
//   //   console.log('dataArray', dataArray)

//   return (
//     <>
//       <Header onClickBack={() => nav(-1)} goBackTo title={FM('dpr-report')}></Header>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Card>
//           <CardHeader>
//             <div className='flex-1'>
//               <Row className='flex-1 g-1'>
//                 <Col md='2'>
//                   <FormGroupCustom
//                     placeholder={FM('select-data-date')}
//                     label={FM('select-data-date')}
//                     name={'date'}
//                     type={'date'}
//                     className='mb-2'
//                     control={control}
//                     rules={{ required: true }}
//                   />
//                 </Col>
//                 <Col md='2'>
//                   <FormGroupCustom
//                     label={FM('select-vendor')}
//                     name={'vender_id'}
//                     type={'select'}
//                     className='mb-2'
//                     placeholder='Vendor Name'
//                     path={ApiEndpoints.list_vendor}
//                     selectLabel='name'
//                     // onOptionData={(data: any[]) => {
//                     //   return data?.map((a: any) => {
//                     //     return {
//                     //       ...a,
//                     //       name_X_work_package: `${a?.vendor_name} - ${a?.work_package_name}`
//                     //     }
//                     //   })
//                     // }}
//                     selectValue={'id'}
//                     isClearable
//                     async
//                     defaultOptions
//                     loadOptions={loadDropdown}
//                     control={control}
//                     rules={{
//                       required: false
//                     }}
//                   />
//                 </Col>
//                 <Col md='3'>
//                   <FormGroupCustom
//                     label={FM('select-project')}
//                     name={'project_id'}
//                     type={'select'}
//                     className='mb-2'
//                     placeholder='Project Name'
//                     path={ApiEndpoints.list_project}
//                     selectLabel='name'
//                     // onOptionData={(data: any[]) => {
//                     //   return data?.map((a: any) => {
//                     //     return {
//                     //       ...a,
//                     //       name_X_work_package: `${a?.name} - ${a?.work_package_name}`
//                     //     }
//                     //   })
//                     // }}
//                     jsonData={{
//                       status: 1
//                     }}
//                     selectValue={'id'}
//                     isClearable
//                     async
//                     defaultOptions
//                     loadOptions={loadDropdown}
//                     control={control}
//                     rules={{
//                       required: false
//                     }}
//                   />
//                 </Col>
//                 <Col md='3'>
//                   <FormGroupCustom
//                     label={FM('item-desc')}
//                     name={'work_item'}
//                     type={'select'}
//                     className='mb-2'
//                     placeholder='Item Description'
//                     path={ApiEndpoints.list_item}
//                     selectLabel='title'
//                     // onOptionData={(data: any[]) => {
//                     //   return data?.map((a: any) => {
//                     //     return {
//                     //       ...a,
//                     //       name_X_work_package: `${a?.vendor_name} - ${a?.work_package_name}`
//                     //     }
//                     //   })
//                     // }}
//                     selectValue={'id'}
//                     isClearable
//                     async
//                     defaultOptions
//                     loadOptions={loadDropdown}
//                     control={control}
//                     rules={{
//                       required: false
//                     }}
//                   />
//                 </Col>
//                 <Col md='2' className='mt-2'>
//                   <LoadingButton
//                     block
//                     type='submit'
//                     className='mt-1'
//                     loading={isLoading}
//                     color='primary'
//                   >
//                     {FM('submit')}
//                   </LoadingButton>
//                   {/* <Button color='primary' type='submit' className='mt-2' block rounded>
//                                         {FM('submit')}
//                                     </Button> */}
//                 </Col>
//                 <Show IF={isValidArray(data?.data)}>
//                   <Show IF={watch('date')}>
//                     <Col md='3' className=''>
//                       <Button color='primary' block rounded onClick={pdf}>
//                         {loadingSample ? (
//                           <>
//                             <Spinner animation='border' size={'sm'}>
//                               <span className='visually-hidden'>Loading...</span>
//                             </Spinner>
//                           </>
//                         ) : (
//                           <>
//                             <Download size={14} /> {FM('download-pdf')}
//                           </>
//                         )}
//                       </Button>
//                     </Col>
//                     <Col md='3' className=''>
//                       <Button color='primary' block rounded onClick={excel}>
//                         {loadingExcel ? (
//                           <>
//                             <Spinner animation='border' size={'sm'}>
//                               <span className='visually-hidden'>Loading...</span>
//                             </Spinner>
//                           </>
//                         ) : (
//                           <>
//                             <Download size={14} /> {FM('download-excel')}
//                           </>
//                         )}
//                       </Button>
//                     </Col>
//                     <Col md='3' className=''>
//                       <Button color='primary' block rounded onClick={html}>
//                         {loadingHtml ? (
//                           <>
//                             <Spinner animation='border' size={'sm'}>
//                               <span className='visually-hidden'>Loading...</span>
//                             </Spinner>
//                           </>
//                         ) : (
//                           <>
//                             <Download size={14} /> {FM('download-html')}
//                           </>
//                         )}
//                       </Button>
//                     </Col>
//                     <Col md='12' className=''>
//                       <Row>
//                         <Col md='9'>
//                           <ReactMultiEmail
//                             // inputClassName=''
//                             placeholder='Enter your email'
//                             emails={dprReportEmails}
//                             onChange={(_emails: string[]) => {
//                               setDprReportsEmail(_emails)
//                             }}
//                             className='form-control'
//                             style={{
//                               minHeight: 25
//                             }}
//                             autoFocus={true}
//                             onFocus={() => setFocused(true)}
//                             onBlur={() => setFocused(false)}
//                             getLabel={(email, index, removeEmail) => {
//                               return (
//                                 <div className='bg-light-primary fw-bold ' data-tag key={index}>
//                                   <div data-tag-item className='m-20 p-20'>
//                                     <strong>{email}</strong>
//                                   </div>
//                                   <span data-tag-handle onClick={() => removeEmail(index)}>
//                                     <XCircle height={15} />
//                                   </span>
//                                 </div>
//                               )
//                             }}
//                           />
//                         </Col>
//                         <Col md='3'>
//                           <Button
//                             color='primary'
//                             className='mt-25'
//                             block
//                             rounded
//                             onClick={(e) => sendMail()}
//                           >
//                             {loadingMail ? (
//                               <>
//                                 <Spinner animation='border' size={'sm'}>
//                                   <span className='visually-hidden'>Loading...</span>
//                                 </Spinner>
//                               </>
//                             ) : (
//                               <>{FM('send-email-pdf')}</>
//                             )}
//                           </Button>
//                         </Col>
//                       </Row>
//                     </Col>
//                   </Show>
//                 </Show>
//               </Row>
//             </div>
//           </CardHeader>
//         </Card>
//         <Show IF={watch('date')}>
//           <Show IF={isLoading}>
//             <Row className='d-flex align-items-stretch'>
//               <Card>
//                 <CardBody>
//                   <Row>
//                     <Shimmer style={{ height: 320 }} />
//                   </Row>
//                 </CardBody>
//               </Card>
//             </Row>
//           </Show>
//           {dataArray?.map((item: any, index: any) => {
//             const itemData = item?.item_data || []
//             const uniqueKeys = new Set()

//             // itemData?.forEach((d: any) => {
//             //     d?.data?.forEach((dataObj: any) => {
//             //         Object.keys(dataObj).forEach((key) => {
//             //             uniqueKeys.add(key)
//             //         })
//             //     })
//             // })
//             const fixedObj = {
//               Scope: 0,
//               'Drawing Released': 0,
//               'Front Available': 0,
//               'Work Done Till Date': 0,
//               'Plan FTM': 0,
//               'Achieved FTM': 0,

//               'Achieved FTD': 0,
//               '% Complete': 0,
//               Manpower: 0,
//               '% Achievement Against Plan': 0,
//               Productivity: 0,
//               'Asking Rate': 0,
//               Balance: 0
//             }

//             const objFromApi = isValid(itemData[0]?.data[0]) ? itemData[0]?.data[0] : {}

//             const obj = {
//               ...fixedObj,
//               ...objFromApi
//             }

//             Object.keys(obj).forEach((key) => {
//               uniqueKeys.add(key)
//             })
//             const tableHeaders1 = Array.from(uniqueKeys)
//             const tableHeaders = tableHeaders1

//             const sortedHeaders = tableHeaders
//               ?.filter((header: any, headerIndex) => {
//                 // Specify the headers you want to keep
//                 const headersToKeep = [
//                   'original_csv',
//                   'project_name',
//                   'project_status',
//                   'vendor_name',
//                   'file_name',
//                   'is_dpr_submit',
//                   'is_this_month_submit',
//                   'Reporting Date',
//                   'Available Manpower'
//                 ] // Replace with your desired headers
//                 return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
//               })
//               ?.map((header: any, index: any) => fixHeaderPosition(header, index))

//             // log('sortedHeaders', sortedHeaders)
//             return (
//               <>
//                 <Card>
//                   <CardBody className='border-bottom'>
//                     <ScrollBar>
//                       <Row md='12' className='d-flex justify-contents-between align-items-between'>
//                         <Col className=''>
//                           <h5 className='fw-bolder mb-1 text-capitalize'>
//                             {FM('work-item')} : {item?.work_item}{item?.unit_of_measure}
//                           </h5>
//                         </Col>
//                         <Col>
//                           <h5 className='fw-bolder text-end mb-1'>
//                             {FM('date')} : {item?.date}{' '}
//                           </h5>
//                         </Col>
//                       </Row>
//                       <Table bordered>
//                         <thead>
//                           <tr>
//                             <th style={{
//                                 textTransform:'none'
//                               }} rowSpan={2}>{FM('project')}</th>
//                             {sortedHeaders?.map((header: any, index: any) => (
//                               <th  style={{
//                                 textTransform:'none'
//                               }} key={index}>{header}</th>
//                             ))}
//                           </tr>
//                           <tr>
//                             {sortedHeaders?.map((header: any, index: any) => (
//                               <th style={{
//                                 textTransform:'none'
//                               }} key={index}>{renderFormula(index)}</th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {itemData?.map((itemD: any, itemIndex: any) => {
//                             // console.log(sortedHeaders, 'sortedHeaders')
//                             return (
//                               <>
//                                 <tr>
//                                   <td className='fw-bolder'>{itemD?.project_name}</td>

//                                   {sortedHeaders?.map((header: any, headerIndex: any) => {
//                                     if (header === 'Change reason for plan ftm') {
//                                       return <>{null}</>
//                                     }

//                                     // if (header === 'Asking Rate') {
//                                     //     return <td className='fw-bolder'>{itemD?.askingRate}</td>

//                                     // }
//                                     // if (header === 'Productivity') {
//                                     //     return <td className='fw-bolder'>{itemD?.productivity}</td>

//                                     // }
//                                     // console.log('headersdsds', { header })

//                                     return (
//                                       <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
//                                         {header === '% Completed w.r.t. total scope' ||
//                                         header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM'
//                                           ? commaFormatter(
//                                               dashValueWithFormula(
//                                                 header,
//                                                 itemD?.data,

//                                                 itemD
//                                               )
//                                             ) >= 0
//                                             ? renderWithPercentage(
//                                                 commaFormatter(
//                                                   dashValueWithFormula(header, itemD?.data, itemD)
//                                                 ),
//                                                 header
//                                               )
//                                             : '-'
//                                           : commaFormatter(
//                                               dashValueWithFormula(header, itemD?.data, itemD)
//                                             )}
//                                       </th>
//                                     )
//                                   })}
//                                 </tr>

//                                 {itemD.data?.map((data: any, dataIndex: any) => {
//                                   //divide project value  -
//                                   // return (<>
//                                   //     <tr key={`${itemIndex}`}>
//                                   //         <td>
//                                   //             {/* <a href={data?.original_csv}>{data?.vendor_name}</a> */}
//                                   //         </td>
//                                   //         {sortedHeaders.map((header: any, headerIndex: any) => {
//                                   //             const headerValue = isValid(data?.[header])
//                                   //                 ? data?.[header]
//                                   //                 : 0
//                                   //             return (
//                                   //                 <td key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
//                                   //                     {/* {header === "% Complete" || header === "% Achievement Against Plan" ? `${commaFormatter(headerValue)}%` : commaFormatter(headerValue)} */}
//                                   //                     {(header === '% Complete' ||
//                                   //                         header === '% Achievement Against Plan') &&
//                                   //                         headerValue >= 0
//                                   //                         ? parseFloat(commaFormatter(
//                                   //                             renderDashValue(
//                                   //                                 header,
//                                   //                                 data
//                                   //                             )
//                                   //                         )) >= 0 ? renderWithPercentage(commaFormatter(
//                                   //                             renderDashValue(
//                                   //                                 header,
//                                   //                                 data
//                                   //                             )
//                                   //                         ), header) : '-'
//                                   //                         : (header === '% Complete' ||
//                                   //                             header === '% Achievement Against Plan') &&
//                                   //                             headerValue === 0
//                                   //                             ? renderWithPercentage(commaFormatter(
//                                   //                                 renderDashValue(
//                                   //                                     header,
//                                   //                                     data
//                                   //                                 )
//                                   //                             ), header)
//                                   //                             : commaFormatter(
//                                   //                                 renderDashValue(
//                                   //                                     header,
//                                   //                                     data
//                                   //                                 )
//                                   //                             )}
//                                   //                 </td>
//                                   //             )
//                                   //         })}
//                                   //     </tr>
//                                   // </>
//                                   // )
//                                 })}
//                               </>
//                             )
//                           })}
//                           <tr>
//                             <td className='fw-bolder'>{FM('total')}</td>
//                             {sortedHeaders?.map((header: any, headerIndex: any) => {
//                               if (header === 'Change reason for plan ftm') {
//                                 return <>{null}</>
//                               }

//                               const total = calculateAllTotal(
//                                 header,
//                                 itemData
//                                   .flat(Infinity)
//                                   ?.map((a: any) => a?.data)
//                                   .flat(Infinity)
//                               )
//                               const totalAskingRate = itemData?.reduce((sum, item) => {
//                                 const rate = parseFloat(item.askingRate || 0)
//                                 return sum + rate
//                               }, 0)

//                               const totalProductivity = itemData?.reduce((sum, item) => {
//                                 const rate = parseFloat(item.productivity || 0)
//                                 return sum + rate
//                               }, 0)

//                               const totalManpower = itemData?.reduce((sum, item) => {
//                                 const rate = parseFloat(item.Manpower || 0)
//                                 return sum + rate
//                               }, 0)

//                               return (
//                                 <>
//                                   <th>
//                                     {header === '% Completed w.r.t. total scope' ||
//                                     header === '% Achievement Against Plan FTM' ||'% Achievement Against Progessive Plan FTM'
//                                       ? commaFormatter(total) >= 0
//                                         ? renderWithPercentage(commaFormatter(total), header)
//                                         : '-'
//                                       : commaFormatter(total)}
//                                   </th>
//                                 </>
//                               )
//                             })}
//                           </tr>
//                         </tbody>
//                       </Table>
//                     </ScrollBar>
//                   </CardBody>
//                 </Card>
//               </>
//             )
//           })}
//           {isSuccess && !isValidArray(data?.data) ? (
//             <Card>
//               <CardBody className=''>
//                 <Row className='px-2 fw-bolder'>
//                   There are no records to display. Please select the correct Date.
//                 </Row>
//               </CardBody>
//             </Card>
//           ) : (
//             ''
//           )}
//           <Show IF={isValidArray(resultData?.data?.data)}>
//             <Card>
//               <CardBody className='pb-0 border-bottom mb-2 pt-1'>
//                 <Row md='12' className='d-flex justify-contents-between align-items-between'>
//                   <Col className=''>
//                     <h5 className='fw-bolder mb-1'>{FM('manpower-table')}</h5>
//                   </Col>
//                   <Col>
//                     <h5 className='fw-bolder text-end mb-1'>
//                       {FM('data-date')} : {formatDate(watch('date'), 'DD MMM YYYY')}{' '}
//                     </h5>
//                   </Col>
//                 </Row>
//               </CardBody>
//               <CardBody className='border-bottom pt-0'>
//                 <ScrollBar>
//                   <Table>
//                     <thead>
//                       <tr>
//                         <th>{FM('project')}</th>
//                         {getWorkPackage().map((workPackage, index) => {
//                           return <th>{workPackage?.name}</th>
//                         })}
//                       </tr>
//                     </thead>
//                     <tbody>{renderTrTd()}</tbody>
//                   </Table>
//                 </ScrollBar>
//               </CardBody>
//             </Card>
//           </Show>
//         </Show>
//       </Form>
//     </>
//   )
// }

// export default DPRReport

import useUser from '@hooks/useUser'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useImportDprListMutation } from '@src/modules/dpr/redux/RTKQuery/DprImportRTK'
import Hide from '@src/utility/Hide'
import Show from '@src/utility/Show'
import {
  ErrorToast,
  FM,
  SuccessToast,
  commaFormatter,
  fastLoop,
  formatDate,
  isValid,
  isValidArray,
  kFormatter,
  log
} from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { downloadPDF } from '@src/utility/http/Apis/downloadDPR'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import { stateReducer } from '@src/utility/stateReducer'
import { DprReportList } from '@src/utility/types/typeDPR'
import { useEffect, useReducer, useState } from 'react'
import { Download, XCircle } from 'react-feather'
import { useForm } from 'react-hook-form'
import ScrollBar from 'react-perfect-scrollbar'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Label,
  Row,
  Spinner,
  Table
} from 'reactstrap'
import { useLoadManpowerMutation } from '../../redux/RTKQuery/GraphRTK'
import { ReactMultiEmail } from 'react-multi-email'
import 'react-multi-email/dist/style.css'
import useNumberCommaFormatter from '@src/utility/NumCommaFormat'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'

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
const DPRReport = () => {
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
  const useComma = useNumberCommaFormatter(true)
  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const form = useForm<DprReportList>()
  const nav = useNavigate()
  const [loadingSample, setLoadingSample] = useState(false)
  const [loadingHtml, setLoadingHtml] = useState(false)
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingMail, setLoadingMail] = useState(false)
  const [dprReportEmails, setDprReportsEmail] = useState<string[]>([])
  const [focused, setFocused] = useState(false)

  const { handleSubmit, control, reset, setValue, watch, clearErrors } = form
  const [loadReport, { data, isError, isLoading, isSuccess }] = useImportDprListMutation()
  const [loadManpower, resultData] = useLoadManpowerMutation()
  const userData = useUser()

  const load = () => {
    if (isValid(watch('date'))) {
      loadReport({
        date: watch('date'),
        project_id: watch('project_id')?.value,
        vender_id: watch('vender_id')?.value,
        item_desc: watch('work_item')?.value
      })
    }
  }
  ///rjehuftgjfhetgyuire

  const loadMan = () => {
    if (isValid(watch('date'))) {
      loadManpower({
        jsonData: {
          date: watch('date'),
          project_id: watch('project_id')?.value,
          vender_id: watch('vender_id')?.value,
          item_desc: watch('work_item')?.value
        }
      })
    }
  }

  //['testEMail@gmail.com', 'another@gmail.com']   remove [] and convert  data like "testEMail@gmail.com,another@gmail.com"

  const sendEmails = (emails: string[]) => {
    const emailList = emails.filter((email) => email !== '')
    return `${emailList.join(',')}`
  }

  //"dfsg@gmail.com,dsfs@gmail.com"  convert to ["dfsg@gmail.com","dsfs@gmail.com"]
  const getEmails = (emails: string) => {
    const emailList = emails?.split(',')
    return emailList
  }

  const Reset = (e: any) => {
    reset()
    setDprReportsEmail([])
  }

  useEffect(() => {
    load()
    loadMan()
  }, [state?.lastRefresh])

  const onSubmit = (d: any) => {
    load()
    loadMan()
  }

  const pdf = () => {
    downloadPDF({
      jsonData: {
        date: watch('date'),
        project_id: watch('project_id')?.value,
        vender_id: watch('vender_id')?.value,
        item_desc: watch('work_item')?.value,
        type: 'pdf'
      },
      loading: setLoadingSample,
      success: (e: any) => {
        window.open(`${e?.data}`, '_blank')
      },
      error: (e: any) => {
        ErrorToast(e?.data)
      }
    })
  }

  const html = () => {
    downloadPDF({
      jsonData: {
        type: 'html',
        date: watch('date'),
        project_id: watch('project_id')?.value,
        vender_id: watch('vender_id')?.value,
        item_desc: watch('work_item')?.value
      },
      loading: setLoadingHtml,
      success: (e: any) => {
        window.open(`${e?.data}`, '_blank')
      },
      error: (e: any) => {
        ErrorToast(e?.data)
      }
    })
  }

  const excel = () => {
    downloadPDF({
      jsonData: {
        type: 'excel',
        date: watch('date'),
        project_id: watch('project_id')?.value,
        vender_id: watch('vender_id')?.value,
        item_desc: watch('work_item')?.value
      },
      loading: setLoadingExcel,
      success: (e: any) => {
        window.open(`${e?.data}`, '_blank')
      },
      error: (e: any) => {
        ErrorToast(e?.data)
      }
    })
  }

  const sendMail = () => {
    downloadPDF({
      jsonData: {
        type: 'mail',
        date: watch('date'),
        project_id: watch('project_id')?.value,
        vender_id: watch('vender_id')?.value,
        item_desc: watch('work_item')?.value,
        //email: dprReportEmails,
        email: sendEmails(dprReportEmails)
      },
      loading: setLoadingMail,
      success: (e: any) => {
        //  SuccessToast(e?.message)
      },
      error: (e: any) => {
        ErrorToast(e?.message)
      }
    })
  }

  useEffect(() => {
    setDprReportsEmail(getEmails(data?.email))
  }, [data?.email])

  const tests = resultData?.data?.data
  // sum all the manpower by project and work_package
  const groupProject = () => {
    const re: any[] = []
    fastLoop(tests, (test, index) => {
      if (re?.hasOwnProperty(test?.project)) {
        re[test?.project] = ''
      } else {
        re[test?.project] = ''
      }
    })
    // log(re)
    return re
  }

  // merge work_package
  const getWorkPackage = (key?: string) => {
    const oreo: any[] = []
    const re: any[] = []
    fastLoop(tests, (test, index) => {
      if (key) {
        if (re?.hasOwnProperty(test?.project)) {
          re[test?.project] = {
            data: [...re[test?.project]?.data, ...test?.profiles?.map((a) => a)],
            project: test?.project
          }
        } else {
          re[test?.project] = { data: test?.profiles?.map((a) => a), project: test?.project }
        }
      }
      fastLoop(test?.profiles, (profile, index) => {
        // find name
        const findIndex = oreo?.findIndex((a) => a?.name === profile?.work_package)
        if (findIndex !== -1) {
          oreo[findIndex] = {
            name: profile?.work_package,
            manpower: key
              ? re[key]?.data
                  ?.filter((a) => a?.work_package === profile?.work_package)
                  ?.map((a) => a?.manpower)
                  .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
              : 0,
            key
          }
        } else {
          oreo.push({
            name: profile?.work_package,
            manpower: key
              ? re[key]?.data
                  ?.filter((a) => a?.work_package === profile?.work_package)
                  ?.map((a) => a?.manpower)
                  .reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
              : 0,
            key
          })
        }
      })
    })
    // log(oreo)
    return oreo
  }

  // get the manpower by work_package
  const getPackageWiseData = (key: string) => {
    const re: any[] = []
    fastLoop(getWorkPackage(key), (work_package, index) => {
      re.push(<td>{work_package?.manpower ?? 0}</td>)
    })
    return re
  }

  // loop through all the projects
  const renderTrTd = () => {
    const re: any[] = []
    for (const [key, value] of Object.entries(groupProject())) {
      re.push(
        <tr>
          <td>{key}</td>
          {getPackageWiseData(key)}
        </tr>
      )
    }
    return re
  }

  const renderFormula = (index: any) => {
    //const total_number_of_days_in_month = new Date(new Date(watch('date')).getFullYear(), new Date(watch('date')).getMonth() + 1, 0).getDate()
    const total_number_of_days_in_month = new Date(
      new Date(watch('date')).getFullYear(),
      new Date(watch('date')).getMonth() + 1,
      0
    ).getDate()
    const getDate = new Date(watch('date')).getDate()

    const selectedDate = new Date(watch('date'))
    const years = selectedDate.getFullYear()
    const months = selectedDate.getMonth() // 0-based month

    const totalDaysInMonth = new Date(years, months + 1, 0).getDate()

    let sundayCounts = 0

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const currentDate = new Date(years, months, day)
      if (currentDate.getDay() === 0) {
        // 0 = Sunday
        sundayCounts++
      }
    }

    function countSundaysBetweenDates(startDateStr: string, endDateStr: string): number {
      const startDate = new Date(startDateStr)
      const endDate = new Date(endDateStr)

      let count = 0

      // loop through the dates
      while (startDate <= endDate) {
        if (startDate.getDay() === 0) {
          // Sunday is 0 in getDay()
          count++
        }
        startDate.setDate(startDate.getDate() + 1) // move to next day
      }

      return count
    }

    // Example usage:
    const day = 1
    const month = formatDate(new Date(watch('date')), 'MM')
    const year = formatDate(new Date(watch('date')), 'YYYY')
    const end = formatDate(new Date(watch('date')), 'YYYY-MM-DD')
    const start = `${year}-${month}-${day}`
    const today = new Date()
    // const years = today.getFullYear()
    // const months = today.getMonth() + 1 // since getMonth() is 0-based

    // const lastDateOfCurrentMonth = new Date(years, months, 0)
    // console.log(lastDateOfCurrentMonth, 'fdf')

    const sundaysCount = countSundaysBetweenDates(start, end)

    const workingDays = getDate - sundaysCount
    const CountMonth = total_number_of_days_in_month - sundayCounts

    //remove sunday count
    //     const workingDays = getDate
    // const CountMonth = total_number_of_days_in_month

    //     log(`Total Sundays between ${start} and ${end}:`, sundaysCount)
    //    log(`Working Days (excluding Sundays):`, workingDays)

    if (index === 0) {
      return 'A'
    } else if (index === 1) {
      return 'B'
    } else if (index === 2) {
      return 'C'
    } else if (index === 3) {
      return `D`
    } else if (index === 4) {
      return `E=(D/A)%`
    } else if (index === 5) {
      return `F=A-D`
    } else if (index === 6) {
      return `G`
    } else if (index === 7) {
      return `H`
    } else if (index === 8) {
      return `I`
    } else if (index === 9) {
      // J=[H/{G*(12/25)}]%
      return `J=[H/{G*(${workingDays}/${CountMonth})}]%`
    } else if (index === 10) {
      return `K`
    } else if (index === 11) {
      return `L=H/avg(K)*(${workingDays}/${CountMonth})`
    } else if (index === 12) {
      //   M = [(G - H) / (25 - 12)]
      return `M=[(G-H)/(${CountMonth}-${workingDays})]`
    }
  }

  const renderDashValue = (header: string, data: any) => {
    const vendorData = data
    const scope: number = isValid(parseFloat(vendorData?.Scope)) ? parseFloat(vendorData?.Scope) : 0
    const dr: number = isValid(vendorData?.['Drawing Released'])
      ? parseFloat(vendorData?.['Drawing Released'])
      : 0
    const workdoneTillDate = isValid(vendorData?.['Work Done Till Date'])
      ? parseFloat(vendorData?.['Work Done Till Date'])
      : 0
    const planFTM = isValid(vendorData?.['Plan FTM']) ? parseFloat(vendorData?.['Plan FTM']) : 0
    const achievedFTM = isValid(vendorData?.['Achieved FTM'])
      ? parseFloat(vendorData?.['Achieved FTM'])
      : 0
    const achievedFTD: number = isValid(vendorData?.['Achieved FTD'])
      ? parseFloat(vendorData?.['Achieved FTD'])
      : 0
    const frontAvailable: number = isValid(vendorData?.['Front Available'])
      ? parseFloat(vendorData?.['Front Available'])
      : 0
    const getDate = new Date(watch('date')).getDate()
    const isThisMonthSubmitted: boolean = vendorData?.is_this_month_submit
    const isDprSubmitted: boolean = vendorData?.is_dpr_submit
    const total_number_of_days_in_month = new Date(
      new Date(watch('date')).getFullYear(),
      new Date(watch('date')).getMonth() + 1,
      0
    ).getDate()
    // log('vendorData', vendorData)
    let total: any = 0

    if (header === 'Scope') {
      if (scope > 0) {
        total = scope
      } else {
        total = '-'
      }
    } else if (header === 'Front Available') {
      if (frontAvailable > 0) {
        total = frontAvailable
      } else {
        total = '-'
      }
    } else if (header === 'Drawing Released') {
      if (dr > 0) {
        total = dr
      } else {
        total = '-'
      }
    } else if (header === '% Complete') {
      if (scope > 0 && workdoneTillDate > 0) {
        total = (workdoneTillDate / scope) * 100
      } else {
        total = 0
      }
    } else if (header === 'Work Done Till Date') {
      if (workdoneTillDate > 0) {
        total = workdoneTillDate
      } else {
        total = '-'
      }
    } else if (header === 'Balance') {
      if (scope >= 0 && workdoneTillDate >= 0) {
        total = scope - workdoneTillDate
      } else {
        total = vendorData?.[header]
      }
    } else {
      if (vendorData?.[header] > 0) {
        total = vendorData?.[header]
      }
    }
    if (isThisMonthSubmitted === true) {
      if (header === 'Plan FTM') {
        if (planFTM > 0) {
          total = planFTM
        } else {
          total = '-'
        }
      } else if (header === 'Achieved FTM') {
        if (achievedFTM > 0) {
          total = achievedFTM
        } else {
          total = '-'
        }
      } else if (header === '% Achievement Against Plan Progressive FTM') {
        if (achievedFTM > 0 && planFTM > 0) {
          total = (achievedFTM / (planFTM * (getDate / total_number_of_days_in_month))) * 100
        } else {
          total = '-'
        }
      } else if (header === 'Achieved FTD') {
        if (isDprSubmitted === true) {
          if (achievedFTD > 0) {
            total = achievedFTD
          } else {
            total = '-'
          }
        } else {
          total = '-'
        }
      }
    } else {
      if (header === '% Achievement Against Plan Progressive FTM') {
        total = 0
      } else if (header === 'Achieved FTD') {
        total = '-'
      } else if (header === 'Plan FTM') {
        total = '-'
      } else if (header === 'Achieved FTM') {
        total = '-'
      } else if (header === '% Complete') {
        total = vendorData?.[header]
      } else if (header === 'Balance') {
        if (vendorData?.[header] > 0) {
          total = vendorData?.[header]
        } else {
          total = 0
        }
      } else {
        if (vendorData?.[header] > 0) {
          total = vendorData?.[header]
        } else {
          total = '-'
        }
      }
    }

    return total
  }
  const calculateTotal = (header: string, data?: any) => {
    //log(data, "data")
    let totalPlanFTM: number = 0
    data?.forEach((item) => {
      if (item?.hasOwnProperty(header)) {
        if (isValid(item[header])) {
          if (item?.is_this_month_submit === true) {
            if (header === 'Plan FTM') {
              totalPlanFTM += parseFloat(item[header])
            } else if (header === 'Achieved FTM') {
              totalPlanFTM += parseFloat(item[header])
            } else if (header === 'Achieved FTD') {
              if (item?.is_dpr_submit === true) {
                totalPlanFTM += parseFloat(item[header])
              } else {
                totalPlanFTM += 0
              }
            } else if (header === '% Achievement Against Plan Progressive FTM') {
              totalPlanFTM += parseFloat(item[header])
            } else {
              totalPlanFTM += parseFloat(item[header])
            }
          } else {
            if (header === '% Achievement Against Plan Progressive FTM') {
              totalPlanFTM += 0
            } else if (header === 'Plan FTM') {
              totalPlanFTM += 0
            } else if (header === 'Achieved FTM') {
              totalPlanFTM += 0
            } else if (header === 'Achieved FTD') {
              totalPlanFTM += 0
            } else if (header === 'Manpower') {
              totalPlanFTM += parseFloat(item[header])
            } else {
              totalPlanFTM += parseFloat(item[header])
            }
          }
        }
      }
    })
    return totalPlanFTM
  }

  const calculateAvg = (header: string, data?: any) => {
    //log(data, "data")
    let totalPlanFTM: number = 0
    let length = data?.length
    log(length, 'length')
    data?.forEach((item) => {
      if (item?.hasOwnProperty(header)) {
        if (isValid(item[header])) {
          if (item?.is_this_month_submit === true) {
            if (header === 'Plan FTM') {
              totalPlanFTM += parseFloat(item[header])
            } else if (header === 'Achieved FTM') {
              totalPlanFTM += parseFloat(item[header])
            } else if (header === 'Achieved FTD') {
              if (item?.is_dpr_submit === true) {
                totalPlanFTM += parseFloat(item[header])
              } else {
                totalPlanFTM += 0
              }
            } else if (header === '% Achievement Against Plan Progressive FTM') {
              totalPlanFTM += parseFloat(item[header])
            } else {
              totalPlanFTM += parseFloat(item[header])
            }
          } else {
            if (header === '% Achievement Against Plan Progressive FTM') {
              totalPlanFTM += 0
            } else if (header === 'Plan FTM') {
              totalPlanFTM += 0
            } else if (header === 'Achieved FTM') {
              totalPlanFTM += 0
            } else if (header === 'Achieved FTD') {
              totalPlanFTM += 0
            } else if (header === 'Manpower') {
              totalPlanFTM = (totalPlanFTM + parseFloat(item[header])) / length
            } else {
              totalPlanFTM += parseFloat(item[header])
            }
          }
        }
      }
    })
    return totalPlanFTM
  }

  //   const calculateAllTotal = (header: string, data?: any) => {
  //     let re: number = 0
  //     data?.forEach((item) => {
  //       if (item?.hasOwnProperty(header)) {
  //         const totalScope = calculateTotal('Scope', data)
  //         const totalDrawingReleased = calculateTotal('Drawing Released', data)
  //         const totalFrontAvailable = calculateTotal('Front Available', data)
  //         const totalWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
  //         const totalData =
  //           Number(calculateTotal('Scope', data)) -
  //           Number(calculateTotal('Work Done Till Date', data))

  //         const totalPlanFTM = calculateTotal('Plan FTM', data)
  //         const totalAchievedFTM = calculateTotal('Achieved FTM', data)
  //         const totalAchievedFTD = calculateTotal('Achieved FTD', data)
  //         const totalProductivity = calculateTotal('Productivity', data)
  //         const totalAskingRate = calculateTotal('Asking Rate', data)
  //         const getDate = new Date(watch('date')).getDate()
  //         const total_number_of_days_in_month = new Date(
  //           new Date(watch('date')).getFullYear(),
  //           new Date(watch('date')).getMonth() + 1,
  //           0
  //         ).getDate()

  //         const selectedDate = new Date(watch('date'))
  //         const years = selectedDate.getFullYear()
  //         const months = selectedDate.getMonth() // 0-based month

  //         const totalDaysInMonth = new Date(years, months + 1, 0).getDate()

  //         let sundayCounts = 0

  //         for (let day = 1; day <= totalDaysInMonth; day++) {
  //           const currentDate = new Date(years, months, day)
  //           if (currentDate.getDay() === 0) {
  //             // 0 = Sunday
  //             sundayCounts++
  //           }
  //         }

  function countSundaysBetweenDates(startDateStr: string, endDateStr: string): number {
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    let count = 0

    // loop through the dates
    while (startDate <= endDate) {
      if (startDate.getDay() === 0) {
        // Sunday is 0 in getDay()
        count++
      }
      startDate.setDate(startDate.getDate() + 1) // move to next day
    }

    return count
  }

  //         // Example usage:
  //         const day = 1
  //         const month = formatDate(new Date(watch('date')), 'MM')
  //         const year = formatDate(new Date(watch('date')), 'YYYY')
  //         const end = formatDate(new Date(watch('date')), 'YYYY-MM-DD')
  //         const start = `${year}-${month}-${day}`
  //         const today = new Date()
  //         // const years = today.getFullYear()
  //         // const months = today.getMonth() + 1 // since getMonth() is 0-based

  //         // const lastDateOfCurrentMonth = new Date(years, months, 0)
  //         // console.log(lastDateOfCurrentMonth, 'fdf')

  //         const sundaysCount = countSundaysBetweenDates(start, end)

  //         const workingDays = getDate - sundaysCount
  //         const CountMonth = total_number_of_days_in_month - sundayCounts

  //         if (isValid(item[header])) {
  //           if (header === 'Scope') {
  //             //A
  //             re = totalScope
  //             // console.log(re, 'RES')
  //           } else if (header === 'Front Available') {
  //             //C
  //             re = totalFrontAvailable
  //           } else if (header === 'Drawing Released') {
  //             //B
  //             re = totalDrawingReleased
  //           } else if (header === 'Work Done Till Date') {
  //             //D

  //             re = totalWorkDoneTillDate
  //           } else if (header === '% Completed w.r.t. total scope') {
  //             //E = (D/A)%
  //             re = Number(
  //               ((totalWorkDoneTillDate / totalScope) * 100).toFixed(2).replace(/\.?0*$/, '')
  //             )
  //             console.log(re, 'RES Comp')
  //           } else if (header === 'Balance w.r.t. total scope') {
  //             //F = A-D
  //             re = Number((totalScope - totalWorkDoneTillDate).toFixed(2).replace(/\.?0*$/, ''))
  //           } else if (header === 'Plan FTM') {
  //             //G
  //             re = totalPlanFTM
  //           } else if (header === 'Achieved FTM') {
  //             //H
  //             re = totalAchievedFTM
  //           } else if (header === 'Achieved FTD') {
  //             //I
  //             re = totalAchievedFTD
  //           } else if (header === '% Achievement Against Plan FTM') {
  //             //J = [H/{G*(getDate/total_number_of_days_in_month)}]%
  //             re = Number((totalAchievedFTM / (totalPlanFTM * (workingDays / CountMonth))) * 100)
  //           } else if (header === 'Productivity') {
  //             re = totalProductivity
  //           } else if (header === 'Asking Rate') {
  //             re = totalAskingRate
  //           } else {
  //             re = item[header]
  //           }
  //         }
  //       }
  //     })
  //     return re
  //   }
  const calculateAllTotal = (header: string, data?: any) => {
    let re: number = 0

    if (!data) return re

    const totalScope = calculateTotal('Scope', data)
    const totalDrawingReleased = calculateTotal('Drawing Released', data)
    const totalFrontAvailable = calculateTotal('Front Available', data)
    const totalWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
    const totalPlanFTM = calculateTotal('Plan FTM', data)
    const totalAchievedFTM = calculateTotal('Achieved FTM', data)
    const totalAchievedFTD = calculateTotal('Achieved FTD', data)
    const totalProductivity = calculateTotal('Productivity', data)
    const totalAskingRate = calculateTotal('Asking Rate', data)
    const totalManpower = calculateTotal('Manpower', data)

    const getDate = new Date(watch('date')).getDate()
    const selectedDate = new Date(watch('date'))
    const years = selectedDate.getFullYear()
    const months = selectedDate.getMonth()
    const total_number_of_days_in_month = new Date(years, months + 1, 0).getDate()

    // Count Sundays in month
    let sundayCounts = 0
    for (let day = 1; day <= total_number_of_days_in_month; day++) {
      if (new Date(years, months, day).getDay() === 0) sundayCounts++
    }

    const start = `${years}-${formatDate(selectedDate, 'MM')}-01`
    const end = formatDate(selectedDate, 'YYYY-MM-DD')
    const sundaysCount = countSundaysBetweenDates(start, end)

    const workingDays = getDate - sundaysCount
    const CountMonth = total_number_of_days_in_month - sundayCounts

    //remove sunday count
    // const workingDays = getDate
    // const CountMonth = total_number_of_days_in_month

    // Now compute the required total based on header
    if (header === 'Scope') {
      re = totalScope
    } else if (header === 'Front Available') {
      re = totalFrontAvailable
    } else if (header === 'Drawing Released') {
      re = totalDrawingReleased
    } else if (header === 'Work Done Till Date') {
      re = totalWorkDoneTillDate
    } else if (header === '% Completed w.r.t. total scope') {
      re = Number(((totalWorkDoneTillDate / totalScope) * 100).toFixed(2))
    } else if (header === 'Balance w.r.t. total scope') {
      re = Number((totalScope - totalWorkDoneTillDate).toFixed(2))
    } else if (header === 'Plan FTM') {
      re = totalPlanFTM
    } else if (header === 'Achieved FTM') {
      re = totalAchievedFTM
    } else if (header === 'Achieved FTD') {
      re = totalAchievedFTD
    } else if (header === 'Manpower') {
      re = totalManpower
    } else if (header === '% Achievement Against Plan Progressive FTM') {
      // [H/{G*(12/25)}]%
      const number = Number(totalAchievedFTM / (totalPlanFTM * (workingDays / CountMonth)))
      const percentage = Number((number * 100).toFixed(2))
      re = percentage
    } else if (header === 'Productivity') {
       re = Number(totalAchievedFTM / (totalManpower * (workingDays / CountMonth)))
 
    } else if (header === 'Asking Rate') {
      re = totalAskingRate
    } else {
      // If header not matching known keys, just pick first available item's value for that header
      const item = data.find((item) => item?.hasOwnProperty(header))
      if (item && isValid(item[header])) re = item[header]
    }

    return re
  }

  const renderWithPercentage = (value?: any, header?: any) => {
    log(header, 'Val')
    if (header === '% Completed w.r.t. total scope') {
      if (value >= 0) {
        return `${value}%`
      }
    } else if (header === '% Achievement Against Plan Progressive FTM') {
      if (value > 0) {
        return `${value}%`
      } else {
        return '-'
      }
    }
    return value
  }
  const dashValueWithFormula = (header: string, data: any, itemData: any) => {
    // console.log(header, data, 'header')
    console.log('header', { header }, 'header')
    const dynamicTotal: number = calculateTotal(header, data)
    let total: any = dynamicTotal
    //calculate total sum of Plan FTM in is array of data find total of Plan FTM
    const sumOfPlanFTM = calculateTotal('Plan FTM', data)
    const someOfFrontAvailable = calculateTotal('Front Available', data)
    const sumOfWorkDoneTillDate = calculateTotal('Work Done Till Date', data)
    const sumOfAchievedFTD = calculateTotal('Achieved FTD', data)
    const sumOfScope = calculateTotal('Scope', data)
    const sumOfAchievedFTM = calculateTotal('Achieved FTM', data)
    const sumOfDrawingRelease = calculateTotal('Drawing Released', data)

    const getDate = new Date(watch('date')).getDate()
    const selectedDate = new Date(watch('date'))
    const years = selectedDate.getFullYear()
    const months = selectedDate.getMonth()
    const total_number_of_days_in_month = new Date(years, months + 1, 0).getDate()

    // Count Sundays in month
    let sundayCounts = 0
    for (let day = 1; day <= total_number_of_days_in_month; day++) {
      if (new Date(years, months, day).getDay() === 0) sundayCounts++
    }

    const start = `${years}-${formatDate(selectedDate, 'MM')}-01`
    const end = formatDate(selectedDate, 'YYYY-MM-DD')
    const sundaysCount = countSundaysBetweenDates(start, end)

    const workingDays = getDate - sundaysCount
    const CountMonth = total_number_of_days_in_month - sundayCounts

    // log('formuladata', itemData?.is_this_month_submit)
    if (header === 'Drawing Released') {
      if (sumOfDrawingRelease > 0) {
        total = sumOfDrawingRelease
      } else {
        total = '-'
      }
    } else if (header === 'Scope') {
      if (sumOfScope > 0) {
        total = sumOfScope
      } else {
        total = '-'
      }
    } else if (header === 'Work Done Till Date') {
      if (sumOfWorkDoneTillDate > 0) {
        total = sumOfWorkDoneTillDate
      } else {
        total = '-'
      }
    } else if (header === 'Front Available') {
      total = someOfFrontAvailable
    } else if (header === 'Plan FTM') {
      if (sumOfPlanFTM > 0) {
        total = sumOfPlanFTM
      } else {
        total = '-'
      }
    } else if (header === 'Achieved FTM') {
      if (sumOfAchievedFTM > 0) {
        return sumOfAchievedFTM
      } else {
        return '-'
      }
    } else if (header === 'Achieved FTD') {
      if (sumOfAchievedFTD > 0) {
        total = sumOfAchievedFTD
      } else {
        total = '-'
      }
    } else if (header === '% Achievement Against Plan Progressive FTM') {
      if (sumOfPlanFTM > 0 && sumOfAchievedFTM > 0) {
        // J=[H/{G*(11/27)}]%

        console.log(
          `(${sumOfAchievedFTM}/(${sumOfPlanFTM} * (${workingDays} / ${CountMonth}))) * 100`
        )

        total = (sumOfAchievedFTM / (sumOfPlanFTM * (workingDays / CountMonth))) * 100
        // log('Achievement Against Plan', total)
        // }
      } else {
        total = 0
      }
    } else if (header === '% Completed w.r.t. total scope') {
      log('anil', total, 'scope', sumOfScope, 'work_done_till_date', sumOfWorkDoneTillDate)

      if (sumOfWorkDoneTillDate > 0 && sumOfScope > 0) {
        total = ((sumOfWorkDoneTillDate / sumOfScope) * 100).toFixed(2).replace(/\.?0*$/, '')
        console.log(total, 'total')
        // }
      } else {
        total = 0
      }
    } else if (header === 'Balance w.r.t. total scope') {
      if (sumOfScope >= 0 && sumOfWorkDoneTillDate >= 0) {
        total = (sumOfScope - sumOfWorkDoneTillDate).toFixed(2).replace(/\.?0*$/, '')
      } else {
        total = 0
      }
    }

    return total
  }

  const fixHeaderPosition = (header?: any, index?: any) => {
    if (index === 0) {
      return 'Scope'
    } else if (index === 1) {
      return 'Drawing Released'
    } else if (index === 2) {
      return 'Front Available'
    } else if (index === 3) {
      return 'Work Done Till Date'
    } else if (index === 4) {
      return '% Completed w.r.t. total scope'
    } else if (index === 5) {
      return 'Balance w.r.t. total scope'
    } else if (index === 6) {
      return 'Plan FTM'
    } else if (index === 7) {
      return 'Achieved FTM'
    } else if (index === 8) {
      return 'Achieved FTD'
    } else if (index === 9) {
      return '% Achievement Against Plan Progressive FTM'
    } else if (index === 10) {
      return 'Manpower'
    } else if (index === 11) {
      return 'Productivity'
    } else if (index === 12) {
      return 'Asking Rate'
    }

    return header
  }
  // Extract the keys (table headers) from the first data item
  const dataArray = data?.data?.map((a: any) => a) || []
  //   console.log('dataArray', dataArray)

  return (
    <>
      <Header onClickBack={() => nav(-1)} goBackTo title={FM('dpr-report')}></Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className='flex-1'>
              <Row className='flex-1 g-1'>
                <Col md='2'>
                  <FormGroupCustom
                    placeholder={FM('select-data-date')}
                    label={FM('select-data-date')}
                    name={'date'}
                    type={'date'}
                    className='mb-2'
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
                <Col md='2'>
                  <FormGroupCustom
                    label={FM('select-vendor')}
                    name={'vender_id'}
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
                      required: false
                    }}
                  />
                </Col>
                <Col md='3'>
                  <FormGroupCustom
                    label={FM('select-project')}
                    name={'project_id'}
                    type={'select'}
                    className='mb-2'
                    placeholder='Project Name'
                    path={ApiEndpoints.list_project}
                    selectLabel='name'
                    // onOptionData={(data: any[]) => {
                    //   return data?.map((a: any) => {
                    //     return {
                    //       ...a,
                    //       name_X_work_package: `${a?.name} - ${a?.work_package_name}`
                    //     }
                    //   })
                    // }}
                    jsonData={{
                      status: 1
                    }}
                    selectValue={'id'}
                    isClearable
                    async
                    defaultOptions
                    loadOptions={loadDropdown}
                    control={control}
                    rules={{
                      required: false
                    }}
                  />
                </Col>
                <Col md='3'>
                  <FormGroupCustom
                    label={FM('item-desc')}
                    name={'work_item'}
                    type={'select'}
                    className='mb-2'
                    placeholder='Item Description'
                    path={ApiEndpoints.list_item}
                    selectLabel='title'
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
                      required: false
                    }}
                  />
                </Col>
                <Col md='2' className='mt-2'>
                  <LoadingButton
                    block
                    type='submit'
                    className='mt-1'
                    loading={isLoading}
                    color='primary'
                  >
                    {FM('submit')}
                  </LoadingButton>
                  {/* <Button color='primary' type='submit' className='mt-2' block rounded>
                                        {FM('submit')}
                                    </Button> */}
                </Col>
                <Show IF={isValidArray(data?.data)}>
                  <Show IF={watch('date')}>
                    <Col md='3' className=''>
                      <Button color='primary' block rounded onClick={pdf}>
                        {loadingSample ? (
                          <>
                            <Spinner animation='border' size={'sm'}>
                              <span className='visually-hidden'>Loading...</span>
                            </Spinner>
                          </>
                        ) : (
                          <>
                            <Download size={14} /> {FM('download-pdf')}
                          </>
                        )}
                      </Button>
                    </Col>
                    <Col md='3' className=''>
                      <Button color='primary' block rounded onClick={excel}>
                        {loadingExcel ? (
                          <>
                            <Spinner animation='border' size={'sm'}>
                              <span className='visually-hidden'>Loading...</span>
                            </Spinner>
                          </>
                        ) : (
                          <>
                            <Download size={14} /> {FM('download-excel')}
                          </>
                        )}
                      </Button>
                    </Col>
                    <Col md='3' className=''>
                      <Button color='primary' block rounded onClick={html}>
                        {loadingHtml ? (
                          <>
                            <Spinner animation='border' size={'sm'}>
                              <span className='visually-hidden'>Loading...</span>
                            </Spinner>
                          </>
                        ) : (
                          <>
                            <Download size={14} /> {FM('download-html')}
                          </>
                        )}
                      </Button>
                    </Col>
                    <Col md='12' className=''>
                      <Row>
                        <Col md='9'>
                          <ReactMultiEmail
                            // inputClassName=''
                            placeholder='Enter your email'
                            emails={dprReportEmails}
                            onChange={(_emails: string[]) => {
                              setDprReportsEmail(_emails)
                            }}
                            className='form-control'
                            style={{
                              minHeight: 25
                            }}
                            autoFocus={true}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            getLabel={(email, index, removeEmail) => {
                              return (
                                <div className='bg-light-primary fw-bold ' data-tag key={index}>
                                  <div data-tag-item className='m-20 p-20'>
                                    <strong>{email}</strong>
                                  </div>
                                  <span data-tag-handle onClick={() => removeEmail(index)}>
                                    <XCircle height={15} />
                                  </span>
                                </div>
                              )
                            }}
                          />
                        </Col>
                        <Col md='3'>
                          <Button
                            color='primary'
                            className='mt-25'
                            block
                            rounded
                            onClick={(e) => sendMail()}
                          >
                            {loadingMail ? (
                              <>
                                <Spinner animation='border' size={'sm'}>
                                  <span className='visually-hidden'>Loading...</span>
                                </Spinner>
                              </>
                            ) : (
                              <>{FM('send-email-pdf')}</>
                            )}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Show>
                </Show>
              </Row>
            </div>
          </CardHeader>
        </Card>
        <Show IF={watch('date')}>
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
          {dataArray?.map((item: any, index: any) => {
            const itemData = item?.item_data || []
            const uniqueKeys = new Set()

            // itemData?.forEach((d: any) => {
            //     d?.data?.forEach((dataObj: any) => {
            //         Object.keys(dataObj).forEach((key) => {
            //             uniqueKeys.add(key)
            //         })
            //     })
            // })
            const fixedObj = {
              Scope: 0,
              'Drawing Released': 0,
              'Front Available': 0,
              'Work Done Till Date': 0,
              'Plan FTM': 0,
              'Achieved FTM': 0,

              'Achieved FTD': 0,
              '% Complete': 0,
              Manpower: 0,
              '% Achievement Against Plan': 0,
              Productivity: 0,
              'Asking Rate': 0,
              Balance: 0
            }

            const objFromApi = isValid(itemData[0]?.data[0]) ? itemData[0]?.data[0] : {}

            const obj = {
              ...fixedObj,
              ...objFromApi
            }

            Object.keys(obj).forEach((key) => {
              uniqueKeys.add(key)
            })
            const tableHeaders1 = Array.from(uniqueKeys)
            const tableHeaders = tableHeaders1

            const sortedHeaders = tableHeaders
              ?.filter((header: any, headerIndex) => {
                // Specify the headers you want to keep
                const headersToKeep = [
                  'original_csv',
                  'project_name',
                  'project_status',
                  'vendor_name',
                  'file_name',
                  'is_dpr_submit',
                  'is_this_month_submit',
                  'Reporting Date',
                  'Available Manpower'
                ] // Replace with your desired headers
                return !headersToKeep.includes(header) // Only keep headers in the headersToKeep array
              })
              ?.map((header: any, index: any) => fixHeaderPosition(header, index))

            // log('sortedHeaders', sortedHeaders)
            return (
              <>
                <Card>
                  <CardBody className='border-bottom'>
                    <ScrollBar>
                      <Row md='12' className='d-flex justify-contents-between align-items-between'>
                        <Col className=''>
                          <h5 className='fw-bolder mb-1 text-capitalize'>
                            {FM('work-item')} : {item?.work_item}
                            {item?.unit_of_measure}
                          </h5>
                        </Col>
                        <Col>
                          <h5 className='fw-bolder text-end mb-1'>
                            {FM('date')} : {item?.date}{' '}
                          </h5>
                        </Col>
                      </Row>
                      <Table bordered>
                        <thead>
                          <tr>
                            <th rowSpan={2}>{FM('project')}</th>
                            {sortedHeaders?.map((header: any, index: number) => (
                              <th key={index} style={{
                                textTransform:'none'
                              }}>
                                {header === 'Manpower'
                                  ? 'Manpower FTD'
                                  : header === 'Productivity'
                                  ? 'Productivity (UoM/Man-Month)'
                                  : header === 'Asking Rate'
                                  ? 'Asking Rate (UoM/Day)'
                                  : header}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            {sortedHeaders?.map((header: any, index: any) => (
                              <th key={index}>{renderFormula(index)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {itemData?.map((itemD: any, itemIndex: any) => {
                            // console.log(sortedHeaders, 'sortedHeaders')
                            return (
                              <>
                                <tr>
                                  <td className='fw-bolder'>{itemD?.project_name}</td>

                                  {sortedHeaders?.map((header: any, headerIndex: any) => {
                                    if (header === 'Change reason for plan ftm') {
                                      return <>{null}</>
                                    }

                                    // if (header === 'Asking Rate') {
                                    //     return <td className='fw-bolder'>{itemD?.askingRate}</td>

                                    // }
                                    // if (header === 'Productivity') {
                                    //     return <td className='fw-bolder'>{itemD?.productivity}</td>

                                    // }
                                    // console.log('headersdsds', { header })

                                    return (
                                      <th key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
                                        {header === '% Completed w.r.t. total scope' ||
                                        header === '% Achievement Against Plan Progressive FTM'
                                          ? commaFormatter(
                                              dashValueWithFormula(
                                                header,
                                                itemD?.data,

                                                itemD
                                              )
                                            ) >= 0
                                            ? renderWithPercentage(
                                                commaFormatter(
                                                  dashValueWithFormula(header, itemD?.data, itemD)
                                                ),
                                                header
                                              )
                                            : '-'
                                          : commaFormatter(
                                              dashValueWithFormula(header, itemD?.data, itemD)
                                            )}
                                      </th>
                                    )
                                  })}
                                </tr>

                                {itemD.data?.map((data: any, dataIndex: any) => {
                                  //divide project value  -
                                  // return (<>
                                  //     <tr key={`${itemIndex}`}>
                                  //         <td>
                                  //             {/* <a href={data?.original_csv}>{data?.vendor_name}</a> */}
                                  //         </td>
                                  //         {sortedHeaders.map((header: any, headerIndex: any) => {
                                  //             const headerValue = isValid(data?.[header])
                                  //                 ? data?.[header]
                                  //                 : 0
                                  //             return (
                                  //                 <td key={`${itemIndex}-${itemIndex}-${headerIndex}`}>
                                  //                     {/* {header === "% Complete" || header === "% Achievement Against Plan" ? `${commaFormatter(headerValue)}%` : commaFormatter(headerValue)} */}
                                  //                     {(header === '% Complete' ||
                                  //                         header === '% Achievement Against Plan') &&
                                  //                         headerValue >= 0
                                  //                         ? parseFloat(commaFormatter(
                                  //                             renderDashValue(
                                  //                                 header,
                                  //                                 data
                                  //                             )
                                  //                         )) >= 0 ? renderWithPercentage(commaFormatter(
                                  //                             renderDashValue(
                                  //                                 header,
                                  //                                 data
                                  //                             )
                                  //                         ), header) : '-'
                                  //                         : (header === '% Complete' ||
                                  //                             header === '% Achievement Against Plan') &&
                                  //                             headerValue === 0
                                  //                             ? renderWithPercentage(commaFormatter(
                                  //                                 renderDashValue(
                                  //                                     header,
                                  //                                     data
                                  //                                 )
                                  //                             ), header)
                                  //                             : commaFormatter(
                                  //                                 renderDashValue(
                                  //                                     header,
                                  //                                     data
                                  //                                 )
                                  //                             )}
                                  //                 </td>
                                  //             )
                                  //         })}
                                  //     </tr>
                                  // </>
                                  // )
                                })}
                              </>
                            )
                          })}
                          <tr>
                            <td className='fw-bolder'>{FM('total')}</td>
                            {sortedHeaders?.map((header: any, headerIndex: any) => {
                              if (header === 'Change reason for plan ftm') {
                                return <>{null}</>
                              }

                              const total = calculateAllTotal(
                                header,
                                itemData
                                  .flat(Infinity)
                                  ?.map((a: any) => a?.data)
                                  .flat(Infinity)
                              )
                              const totalAskingRate = itemData?.reduce((sum, item) => {
                                const rate = parseFloat(item.askingRate || 0)
                                return sum + rate
                              }, 0)

                              const totalProductivity = itemData?.reduce((sum, item) => {
                                const rate = parseFloat(item.productivity || 0)
                                return sum + rate
                              }, 0)

                              const totalManpower = itemData?.reduce((sum, item) => {
                                const rate = parseFloat(item.Manpower || 0)
                                return sum + rate
                              }, 0)

                              //   log(Manpower, 'total')

                              return (
                                <>
                                  <th>
                                    {header === '% Completed w.r.t. total scope' ||
                                    header === '% Achievement Against Plan Progressive FTM'
                                      ? commaFormatter(total) >= 0
                                        ? renderWithPercentage(commaFormatter(total), header)
                                        : '-'
                                      : commaFormatter(total)}
                                  </th>
                                </>
                              )
                            })}
                          </tr>
                        </tbody>
                      </Table>
                    </ScrollBar>
                  </CardBody>
                </Card>
              </>
            )
          })}
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
          <Show IF={isValidArray(resultData?.data?.data)}>
            <Card>
              <CardBody className='pb-0 border-bottom mb-2 pt-1'>
                <Row md='12' className='d-flex justify-contents-between align-items-between'>
                  <Col className=''>
                    <h5 className='fw-bolder mb-1'>{FM('manpower-table')}</h5>
                  </Col>
                  <Col>
                    <h5 className='fw-bolder text-end mb-1'>
                      {FM('data-date')} : {formatDate(watch('date'), 'DD MMM YYYY')}{' '}
                    </h5>
                  </Col>
                </Row>
              </CardBody>
              <CardBody className='border-bottom pt-0'>
                <ScrollBar>
                  <Table>
                    <thead>
                      <tr>
                        <th>{FM('project')}</th>
                        {getWorkPackage().map((workPackage, index) => {
                          return <th>{workPackage?.name}</th>
                        })}
                      </tr>
                    </thead>
                    <tbody>{renderTrTd()}</tbody>
                  </Table>
                </ScrollBar>
              </CardBody>
            </Card>
          </Show>
        </Show>
      </Form>
    </>
  )
}

export default DPRReport
