/* eslint-disable no-confusing-arrow */
// ** Redux Imports
import { createApi } from '@reduxjs/toolkit/query/react'
import { HttpListResponse, HttpResponse, PagePerPageRequest } from '@src/utility/types/typeResponse'
import { isValid } from '@src/utility/Utils'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { axiosBaseQuery } from '@src/utility/http/Http'
import { DPR } from '@src/utility/types/typeDPR'

interface RequestType extends PagePerPageRequest {
    id?: any
    jsonData?: any
    sheet_name?: any
    eventId?: any
}
interface ResponseType extends HttpResponse<DPR> {
    someExtra: any
    page?: any
    per_page_record?: any
}

interface ResponseTypeList extends HttpListResponse<DPR> {
    someExtra: any
}

export const ReportEmail = createApi({
    reducerPath: 'ReportEmail',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        loadReportEmail: builder.mutation<ResponseTypeList, RequestType>({
            query: (a) => ({
                jsonData: a?.jsonData,
                params: { page: a?.page, per_page_record: a?.per_page_record },
                method: 'post',
                path: ApiEndpoints.list_report_email
            })
        }),
        createOrUpdateReportEmail: builder.mutation<ResponseType, DPR>({
            query: (jsonData) => ({
                jsonData,
                showSuccessToast: true,
                method: isValid(jsonData?.id) ? 'put' : 'post',
                path: isValid(jsonData?.id) ? ApiEndpoints?.update_report_email + jsonData?.id : ApiEndpoints.create_report_email
            })
        }),
        deleteReportEmailById: builder.mutation<ResponseType, DPR>({
            query: ({ id }) => ({
                method: 'delete',
                path: ApiEndpoints.delete_report_email + id
            })
        }),
       UpdateEmail: builder.mutation<ResponseType, DPR>({
            query: (jsonData) => ({
                jsonData,
                showSuccessToast: true,
                method:  'post',
                path:  ApiEndpoints.update_email_trigger
            })
        }),
         emailTrigger: builder.mutation<ResponseType, DPR>({
            query: (jsonData) => ({
                jsonData,
                showSuccessToast: true,
                method:  'post',
                path:  ApiEndpoints.email_trigger
            })
        }),

    })
})
export const {
    useLoadReportEmailMutation,
    useCreateOrUpdateReportEmailMutation,
    useDeleteReportEmailByIdMutation,
    useUpdateEmailMutation,
    useEmailTriggerMutation
} = ReportEmail
