import { getPath } from '@src/router/RouteHelper'
import { DPR } from '@src/utility/types/typeDPR'
import { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Header from '@src/modules/common/components/header'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import useUserType from '@src/utility/hooks/useUserType'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import { stateReducer } from '@src/utility/stateReducer'
import {
    fillObject,
    FM,
    getUserData,
    isValid,
    log,
    setInputErrors,
    setValues
} from '@src/utility/Utils'
import { Patterns } from '../../../../utility/Const'
import {
    useCreateOrUpdateUserMutation,
    useLoadUserDetailsByIdMutation
} from '../../redux/RTKQuery/UserRTK'

interface States {
    category?: boolean
    subcategory?: boolean
    ip?: boolean
    patient?: boolean
    loading?: boolean
    text?: string
    list?: any
    formData?: DPR
    employee_role_only?: any | null
}
const UserForm = () => {
    const user = getUserData()
    const userType = useUserType()
    const form = useForm<DPR>()
    const navigate = useNavigate()
    const params = useParams()
    const location: any = useLocation()
    const fromVendor: boolean = location?.state?.fromVendor ?? false

    const id = params?.id
    const { handleSubmit, control, reset, setValue, watch, setError } = form
    const [loading, setLoading] = useState(false)
    const [createUser, result] = useCreateOrUpdateUserMutation()
    const initState: States = {
        category: false,
        subcategory: false,
        ip: false,
        patient: false,
        loading: false,
        text: '',
        list: [],
        formData: {
            id: null,
            name: null,
            dpr_item_desc_ids: null,
            email: null,
            password: null,
            mobile_number: null,
            status: null
        }
    }
    const reducers = stateReducer<States>
    const [state, setState] = useReducer(reducers, initState)
    const [loadEmployeeById, EmployeeData] = useLoadUserDetailsByIdMutation()
    const employeeData = EmployeeData?.data?.data

    useEffect(() => {
        if (isValid(id)) {
            loadEmployeeById({ id })
        }
    }, [id])


    useEffect(() => {
        if (isValid(employeeData) && employeeData !== undefined) {
            const f = fillObject<DPR>(state.formData, employeeData)

            const formData: DPR = {
                ...f,
                role_id: {
                    label: employeeData?.roles?.se_name,
                    value: employeeData?.roles?.id
                },
                dpr_item_desc_ids: employeeData?.ItemDesc?.map((a: any) => {
                    return {
                        label: `${a?.title}`,
                        value: a?.id
                    }
                }),
                project_ids: employeeData?.projects?.map((a: any) => {
                    return {
                        label: `${a?.name}`,
                        value: a?.id
                    }
                })
            }
            setValues<DPR>(formData, setValue)
        }
    }, [employeeData])

    log('employeeData', employeeData)

    // Test Comment //

    const onSubmit = (e: DPR) => {
        const commaSeparated = e?.dpr_item_desc_ids?.map((a: any) => a?.value).join(',')
        if (isValid(id)) {
            createUser({
                ...e,
                dpr_item_desc_ids: commaSeparated,
                status: employeeData?.status,
                role_id: e?.role_id?.value,
                project_ids: e?.project_ids?.map((a: any) => a?.value).join(',')
            })
        } else {
            createUser({
                ...e,
                status: 1,
                dpr_item_desc_ids: commaSeparated,
                role_id: e?.role_id?.value,
                project_ids: e?.project_ids?.map((a: any) => a?.value).join(',')
            })
        }
    }
    useEffect(() => {
        if (result.isSuccess) {
            // SuccessToast(FM('executed-successfully'))
            navigate(getPath('dpr.user'), { state: { reload: true } })
        }
    }, [result])

    useEffect(() => {
        if (result?.isError) {
            const e: any = result?.error
            setInputErrors(e?.data?.data, setError)
        }
    }, [result?.isError])

    return (
        <>
            <Header
                onClickBack={() => navigate(-1)}
                goBackTo
                title={
                    isValid(id) ? (
                        FM('update-user')
                    ) : fromVendor === true ? (
                        <>{FM('create-vendor')}</>
                    ) : (
                        <>{FM('create-user')}</>
                    )
                }
            ></Header>
            {loading ? (
                <>
                    <Row>
                        <Col md='12' className='d-flex align-items-stretch'>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md='6'>
                                            <Shimmer style={{ height: 40 }} />
                                        </Col>
                                        <Col md='6'>
                                            <Shimmer style={{ height: 40 }} />
                                        </Col>
                                        <Col md='12' className='mt-2'>
                                            <Shimmer style={{ height: 320 }} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='12' className='d-flex align-items-stretch'>
                                <Card>
                                    <CardBody>
                                        {
                                            <>
                                                <Row className=''>
                                                    <h4 className='mb-1 '>
                                                        <>{FM('user-details')}</>
                                                    </h4>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('name')}
                                                            name={'name'}
                                                            onRegexValidation={{
                                                                form: form,
                                                                fieldName: 'name'
                                                            }}
                                                            type={'text'}
                                                            className='mb-2'
                                                            control={control}
                                                            rules={{ required: true, pattern: Patterns.AlphaNumericForUser }}
                                                        />
                                                    </Col>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('role')}
                                                            name={'role_id'}
                                                            type={'select'}
                                                            className='mb-2'
                                                            path={ApiEndpoints.role_list}
                                                            selectLabel='se_name'
                                                            selectValue={'id'}
                                                            jsonData={{ status: 1 }}
                                                            async
                                                            defaultOptions
                                                            loadOptions={loadDropdown}
                                                            isClearable
                                                            control={control}
                                                            rules={{
                                                                required: true
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('mobile-number')}
                                                            name={'mobile_number'}
                                                            type={'number'}

                                                            className='mb-2'
                                                            control={control}
                                                            rules={{ required: false, minLength: 10, maxLength: 13, min: 0 }}
                                                        />
                                                    </Col>
                                                    {/* <Show IF={employeeData?.dpr_config_ids !== null}> */}
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            label={FM('select-project')}
                                                            name={'project_ids'}
                                                            type={'select'}
                                                            className='mb-2'
                                                            placeholder="Project Name"
                                                            path={ApiEndpoints.list_project}
                                                            selectLabel='name'
                                                            //   onOptionData={(data: any[]) => {
                                                            //     return data?.map((a: any) => {
                                                            //       return {
                                                            //         ...a,
                                                            //         name_X_work_package: `${a?.name} - ${a?.projectId}`
                                                            //       }
                                                            //     })
                                                            //   }}

                                                            selectValue={'id'}

                                                            isClearable
                                                            isMulti
                                                            async
                                                            defaultOptions
                                                            loadOptions={loadDropdown}
                                                            control={control}
                                                            rules={{
                                                                required: false
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col md='6'>
                                                        <FormGroupCustom

                                                            label={FM('item-desc')}
                                                            name={'dpr_item_desc_ids'}
                                                            type={'select'}
                                                            isMulti
                                                            placeholder={FM('item-desc')}
                                                            path={ApiEndpoints.list_item}
                                                            selectLabel='title'
                                                            className="mb-2"

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
                                                    {/* </Show> */}
                                                    <Col md='6'>
                                                        <FormGroupCustom
                                                            name={'email'}
                                                            type={'email'}
                                                            label={FM('email')}
                                                            onRegexValidation={{
                                                                form: form,
                                                                fieldName: 'email'
                                                            }}
                                                            className='mb-2'
                                                            control={control}
                                                            rules={{ required: true, pattern: Patterns.EmailOnly }}
                                                        />
                                                    </Col>
                                                    <Col sm='3'>
                                                        <LoadingButton
                                                            block
                                                            loading={result.isLoading}
                                                            className='mt-2'
                                                            color='primary'
                                                            type='submit'
                                                        >
                                                            {isValid(id) ? FM('update') : FM('save')}
                                                        </LoadingButton>
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </>
    )
}

export default UserForm
