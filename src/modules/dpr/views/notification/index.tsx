/* eslint-disable no-mixed-operators */
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useReducer, useState } from 'react'
import {
    Bell,
    RefreshCcw
} from 'react-feather'
import { useLocation } from 'react-router-dom'
import { Badge, ButtonGroup } from 'reactstrap'

import CustomDataTable, {
    TableFormData
} from '@src/modules/common/components/CustomDataTable/CustomDataTable'
import Header from '@src/modules/common/components/header'
import { stateReducer } from '@src/utility/stateReducer'
import { FM, isValid } from '@src/utility/Utils'

import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import httpConfig from '@src/utility/http/httpConfig'
import { DPR } from '@src/utility/types/typeDPR'
import { formatDate } from '@src/utility/Utils'
import axios from 'axios'
import { TableColumn } from 'react-data-table-component'
import {
    useLoadNotificationMutation,
} from '../../redux/RTKQuery/ProjectRTK'

interface States {
    page?: any
    per_page_record?: any
    search?: any
    reload?: any
    showModal?: boolean
    rowData?: any
    isAddingNewData?: boolean
    lastRefresh?: any
    filterData?: DPR | any
}
function Notification() {
    const reloadID = new Date().getTime()
    const location: any = useLocation()
    const { colors } = useContext(ThemeColors)
    // Local States
    const initState: States = {
        page: 1,
        showModal: false,
        rowData: {},
        per_page_record: 40,
        search: '',
        filterData: null,
        lastRefresh: new Date().getTime()
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    // Load Store Data
    const [loadProject, { data, originalArgs, isLoading, isSuccess }] = useLoadNotificationMutation()
      const [error, setError] = useState(null)
        const [loadingRead, setLoadingRead] = useState(false)
    // const [deleteProject, resultDelete] = useDeleteProjectByIdMutation()
    // const [actionProject, resultAction] = useLoadProjectActionMutation()

    const handlePageChange = (e: TableFormData) => {
        setState({ ...e, filterData: null })
    }
    useEffect(() => {
        loadProject({
            jsonData: {
                name: isValid(state?.search) ? state.search : state?.filterData?.name,
                ...state?.filterData
            },
            page: state?.page,
            per_page_record: state?.per_page_record
        })
    }, [state?.search, state?.page, state?.per_page_record, state.lastRefresh, state?.filterData])

    const reloadData = () => {
        setState({
            lastRefresh: new Date().getTime()
        })
    }

    // const handleDelete = (id?: any, eventId?: any) => {
    //     if (isValid(id)) {
    //         deleteProject({
    //             id,
    //             eventId
    //         })
    //     }
    // }

    // delete item success
    // useEffect(() => {
    //     if (resultDelete?.isLoading === false) {
    //         if (resultDelete?.isSuccess) {
    //             emitAlertStatus('success', null, resultDelete?.originalArgs?.eventId)
    //         } else if (resultDelete?.error) {
    //             emitAlertStatus('failed', null, resultDelete?.originalArgs?.eventId)
    //         }
    //     }
    // }, [resultDelete])

    // const handleAction = (ids?: any, action?: any, eventId?: any) => {
    //     // log('id', id)
    //     if (isValid(ids)) {
    //         // delete single
    //         actionProject({
    //             ids,
    //             eventId,
    //             originalArgs: resultAction?.originalArgs,
    //             jsonData: {
    //                 ids,
    //                 action
    //             }
    //         })
    //     }
    // }
    // useEffect(() => {
    //     if (resultAction?.isLoading === false) {
    //         if (resultAction?.isSuccess) {
    //             emitAlertStatus('success', null, resultAction?.originalArgs?.eventId)
    //         } else if (resultAction?.error) {
    //             emitAlertStatus('failed', null, resultAction?.originalArgs?.eventId)
    //         }
    //     }
    // }, [resultAction])

    const columns: TableColumn<DPR>[] = [
        {
            name: '#',
            maxWidth: '10px',
            cell: (row, index: any) => {
                // eslint-disable-next-line no-mixed-operators
                return parseInt(state?.per_page_record) * (state?.page - 1) + (index + 1)
            }
        },

        {
            name: FM('title'),
            sortable: true,
            id: 'title',
            minWidth: '200px',
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info'>
                        <span className='d-block fw-bold text-primary text-capitalize'>{row?.title}</span>
                    </div>
                </div>
            )
        },
        {
            name: FM('message'),
            sortable: true,
            minWidth: '200px',
            id: 'message',
            cell: (row) => (
                <div className='d-flex align-items-center'>
                    <div className='user-info'>
                        <span className='d-block fw-bold text-primary text-capitalize'>{row?.message}</span>
                    </div>
                </div>
            )
        },
 
      
              {
            name: <>{FM('type')}</>,
            sortable: true,
            minWidth: '200px',
            id: 'status',
            cell: (row) => {
                return (
                    <>
                        {`${row?.type}` === `${'User'}` ? (
                            <Badge color={'light-success'} pill>
                                <>{`${row?.type}`}</>
                            </Badge>
                        ) : ''}
                          {`${row?.type}` === `${'Project'}` ? (
                            <Badge color={'light-primary'} pill>
                                <>{`${row?.type}`}</>
                            </Badge>
                        ) :''}
                         {`${row?.type}` === `${'Vendor'}` ? (
                            <Badge color={'light-info'} pill>
                                <>{`${row?.type}`}</>
                            </Badge>
                        ) :''}
                        {`${row?.type}` === `${'WorkPackage'}` ? (
                            <Badge color={'light-secodary'} pill>
                                <>{`${row?.type}`}</>
                            </Badge>
                        ) :''}
                        {`${row?.type}` === `${'Dpr-Config'}` ? (
                            <Badge color={'light-danger'} pill>
                                <>{`${row?.type}`}</>
                            </Badge>
                        ) :''}
                          {`${row?.type}` === `${'DprImport'}` ? (
                            <Badge color={'light-secondary'} pill>
                                <>{`${row?.type}`}</>
                            </Badge>
                        ) :''}
                    </>
                )
            }
        },
        {
            name: <>{FM('read-status')}</>,
            sortable: true,
            minWidth: '200px',
            id: 'status',
            cell: (row) => {
                return (
                    <>
                        {`${row?.read_status}` === `${1}` ? (
                            <Badge color={'light-success'} pill>
                                <>{FM('read')}</>
                            </Badge>
                        ) : (
                            <Badge color={'light-danger'} pill>
                                <>{FM('unread')}</>
                            </Badge>
                        )}
                        
                    </>
                )
            }
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

        // {
        //     name: <>{FM('actions')}</>,
        //     allowOverflow: true,
        //     minWidth: '150px',
        //     cell: (row) => {
        //         return (
        //             <div className='d-flex '>
        //                 <DropDownMenu
        //                     direction='up'
        //                     component={<MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />}
        //                     options={[
        //                         {
        //                             IF: Permissions.projectEdit,
        //                             icon: <Edit size={14} />,
        //                             state: row,
        //                             to: {
        //                                 pathname: getPath('dpr.project.update', { id: row?.id })
        //                             },
        //                             name: FM('edit')
        //                         },
        //                         {
        //                             IF: row?.status === 2,
        //                             noWrap: true,
        //                             name: (
        //                                 <ConfirmAlert
        //                                     menuIcon={<CheckSquare size={14} />}
        //                                     onDropdown
        //                                     eventId={`item-active-${row?.id}`}
        //                                     text={FM('are-you-sure')}
        //                                     title={FM('activate-item-name', { name: row?.name })}
        //                                     color='text-warning'
        //                                     onClickYes={() => handleAction([row?.id], 'active', `item-active-${row?.id}`)}
        //                                     onSuccessEvent={(e: any) => {
        //                                         reloadData()
        //                                     }}
        //                                     className=''
        //                                     id={`grid-active-selected`}
        //                                 >
        //                                     {FM('activate')}
        //                                 </ConfirmAlert>
        //                             )
        //                         },
        //                         {
        //                             IF: row?.status === 1,
        //                             noWrap: true,
        //                             name: (
        //                                 <ConfirmAlert
        //                                     menuIcon={<MinusCircle size={14} />}
        //                                     onDropdown
        //                                     eventId={`item-inactive-${row?.id}`}
        //                                     text={FM('are-you-sure')}
        //                                     title={FM('deactivate-item-name', { name: row?.name })}
        //                                     color='text-warning'
        //                                     onClickYes={() =>
        //                                         handleAction([row?.id], 'inactive', `item-inactive-${row?.id}`)
        //                                     }
        //                                     onSuccessEvent={(e: any) => {
        //                                         reloadData()
        //                                     }}
        //                                     className=''
        //                                     id={`grid-inactive-selected`}
        //                                 >
        //                                     {FM('deactivate')}
        //                                 </ConfirmAlert>
        //                             )
        //                         },
        //                         {
        //                             IF: Permissions.projectDelete,
        //                             noWrap: true,
        //                             name: (
        //                                 <ConfirmAlert
        //                                     menuIcon={<Trash2 size={14} />}
        //                                     onDropdown
        //                                     eventId={`delete-item-${row?.id}`}
        //                                     item={row}
        //                                     title={truncateText(`${row?.name}`, 50)}
        //                                     color='text-warning'
        //                                     onClickYes={() => handleDelete(row?.id, `delete-item-${row?.id}`)}
        //                                     onSuccessEvent={(e: any) => {
        //                                         reloadData()
        //                                     }}
        //                                     className=''
        //                                     id={`grid-delete-${row?.id}`}
        //                                 >
        //                                     {FM('delete')}
        //                                 </ConfirmAlert>
        //                             )
        //                         }
        //                     ]}
        //                 />
        //             </div>
        //         )
        //     }
        // }
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

      const readAll = () => {
        setLoadingRead(true)
            axios
                .get(`${httpConfig.baseUrl}${ApiEndpoints.notification_read_all}`, {})
                .then((res) => {
                    // log(res, 'res')
                    setLoadingRead(false)
                    reloadData()
                  
                })
                .catch((err) => {
                      setLoadingRead(false)
                    setError(err?.response?.data?.message)

                })
        }
    

    return (
        <>
            <Header icon={<Bell size='25' />} title={FM('notifications')}>
                <ButtonGroup color='dark'>
                      <LoadingButton    loading={loadingRead} color='primary' block onClick={readAll}>
                            Read all notifications
                        </LoadingButton>
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
export default Notification
