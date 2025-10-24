import LoadingButton from '@src/modules/common/components/buttons/LoadingButton'
import FormGroupCustom from '@src/modules/common/components/formGroupCustom/FormGroupCustom'
import Shimmer from '@src/modules/common/components/shimmers/Shimmer'
import { useCreateOrUpdateDPRMutation } from '@src/modules/dpr/redux/RTKQuery/DPRRTK'
import { useLoadItemDescMutation } from '@src/modules/dpr/redux/RTKQuery/ItemDescRTK'
import Emitter from '@src/utility/Emitter'
import Hide from '@src/utility/Hide'
import ApiEndpoints from '@src/utility/http/ApiEndpoints'
import { loadDropdown } from '@src/utility/http/Apis/dropdown'
import Show from '@src/utility/Show'
import { stateReducer } from '@src/utility/stateReducer'
import { DPR } from '@src/utility/types/typeDPR'
import { createConstSelectOptions, createSelectOptions, FM, isValid, log } from '@src/utility/Utils'
import { useEffect, useReducer } from 'react'
import { Control, useFieldArray, useForm } from 'react-hook-form'
import { Button, Card, CardBody, Col, Form, Label, Row } from 'reactstrap'
import { number } from 'yup'

type theProps = {
  loading?: boolean
  filterTransaction?: boolean
  filterMap?: boolean
  closeForm: () => void
  sheetName?: any
  configName?: any
  getData?: any
}

type States = {
  active?: string
  loading?: boolean
  descriptionData?: any
  list?: any
  formData?: any
  lastRefresh?: any
  sheet_name?: any
}

const Map = (props: theProps) => {
  const initState: States = {
    list: null,
    descriptionData: [],
    formData: {
      id: null,
      sheet_name: null,
      name: null,
      orderno: null,
      item_desc: null,
      cell_value: null,
      row_position: null,
      row_new_position: null
    }
  }
  const form = useForm()
  const { handleSubmit, control, reset, setValue, watch } = form
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'dpr_map' // unique name for your Field Array
  })

  const reducers = stateReducer<States>
  const [state, setState] = useReducer(reducers, initState)
  const [createDPRMap, result] = useCreateOrUpdateDPRMutation()
  const [loadeDesc, descRes] = useLoadItemDescMutation()
  useEffect(() => {
    if (result.isSuccess) {
      Emitter.emit('reloadMap', true)
    }
  }, [result])

  useEffect(() => {
    loadeDesc({})
  }, [])
  useEffect(() => {
    if (descRes?.isSuccess) {
      const data = descRes?.data?.data as unknown as any[]
      setState({
        descriptionData: data?.map((m) => {
          return {
            value: m?.id,
            label: m?.title
          }
        })
      })
    }
  }, [descRes])

  log('descRes', state.descriptionData)

  const onSubmit = (dataMap: DPR, index: any) => {
    if (isValid(dataMap?.sheet_name) && isValid(props?.configName)) {
      createDPRMap({
        dpr_config_id: props?.configName,
        // ...dataMap,
        sheet_name: dataMap?.sheet_name,
        dpr_map: dataMap?.dpr_map?.map((m) => {
          return {
            name: m?.name,
            orderno: m?.orderno,
            map_value: m?.map_value?.map((v) => {
              return {
                item_desc: v?.item_desc?.label,
                cell_value: v?.cell_value,
                row_position: v?.row_position,
                row_new_position: v?.row_new_position
              }
            })
          }
        })
      })
    }
  }

  const returnMapValue = (array: any) => {
    const map2 = [...array]
    const map1 = [
      {
        name: 'Data Date',
        orderno: 1,
        map_value: []
      },
      {
        name: 'ISBL',
        orderno: 2,
        map_value: []
      },
      {
        name: 'OSBL',
        orderno: 3,
        map_value: []
      },
      {
        name: 'Drawing Released',
        orderno: 4,
        map_value: []
      },
      {
        name: 'Front Available',
        orderno: 5,
        map_value: []
      },
      { name: 'Work Done Till Date', orderno: 6, map_value: [] },
      { name: 'Plan For The Month', orderno: 7, map_value: [] },
      { name: 'Achieved FTM', orderno: 8, map_value: [] }
      //   { name: 'Achieved FTD', orderno: 8, map_value: [] }
    ]
    const output = map1?.map((m1) => {
      const m2 = map2?.find((m) => m?.name === m1?.name && `${m?.orderno}` === `${m1?.orderno}`)
      if (m2) {
        return m2
      } else {
        return {
          name: m1?.name,
          orderno: `${m1?.orderno}`,
          map_value: []
        }
      }
    })
    const filteredMap1 = map2.filter((item) => item.name !== 'ISBL' && item.name !== 'OSBL')
    // const newArr = output?.concat(map2.filter((m) => !output?.includes(m)))
    const newArr = filteredMap1
    return newArr
  }

  useEffect(() => {
    const data = props?.getData
    setValue('sheet_name', data?.sheet_name)
    // convert object to array
    log('data', data)
    const mapValue: any[] = []
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]
        log(element, 'element')
        const parts = key.split('-OrderNo#')

        log('parts', parts)
        log('key', key)
        if (key !== 'sheet_name') {
          mapValue.push({
            name: parts[0],
            orderno: parts[1],
            // map_value: element,
            map_value: element?.map((v) => {
              return {
                item_desc: {
                  value: v?.item_desc?.id,
                  label: v?.item_desc?.title
                },
                orderno: v?.orderno, //v?.orderno
                cell_value: v?.cell_value,
                row_position: v?.row_position,
                row_new_position: v?.row_new_position
              }
            })
          })
        }
      }
    }

    log('mapValue1111', mapValue)
    if (data?.sheet_name === '' && mapValue.length === 0) {
      log('1', 'test')
      append({
        name: 'Data Date',
        orderno: 1,
        map_value: []
      }),
        //     append({
        //       name: 'ISBL',
        //       orderno: 2,
        //       map_value: []
        //     })
        //   append({
        //     name: 'OSBL',
        //     orderno: 3,
        //     map_value: []
        //   })
        append({
          name: 'Drawing Released',
          orderno: 4,
          map_value: []
        })
      append({
        name: 'Front Available',
        orderno: 5,
        map_value: []
      })
      append({
        name: 'Work Done Till Date',
        orderno: 6,
        map_value: []
      })
      append({
        name: 'Plan For The Month',
        orderno: 7,
        map_value: []
      })
      append({
        name: 'Achieved FTM',
        orderno: 8,
        map_value: []
      })
      //   append({
      //     name: 'Achieved FTD',
      //     orderno: 8,
      //     map_value: []
      //   })
    } else if (isValid(data?.sheet_name) && mapValue.length === 0) {
      log('2', 'test')
      append({
        name: 'Data Date',
        orderno: 1,
        map_value: []
      }),
        //     append({
        //       name: 'ISBL',
        //       orderno: 2,
        //       map_value: []
        //     })
        //   append({
        //     name: 'OSBL',
        //     orderno: 3,
        //     map_value: []
        //   })
        append({
          name: 'Drawing Released',
          orderno: 4,
          map_value: []
        })
      append({
        name: 'Front Available',
        orderno: 5,
        map_value: []
      })
      append({
        name: 'Work Done Till Date',
        orderno: 6,
        map_value: []
      })
      append({
        name: 'Plan For The Month',
        orderno: 7,
        map_value: []
      })
      append({
        name: 'Achieved FTM',
        orderno: 8,
        map_value: []
      })
      //   append({
      //     name: 'Achieved FTD',
      //     orderno: 8,
      //     map_value: []
      //   })
    } else {
      if (mapValue.length > 0) {
        log('3', 'test')
        setValue('dpr_map', returnMapValue(mapValue))
      }
    }
  }, [props?.getData])

  log('getDattadfdsf', props?.getData)
  log('fields in map', fields)

  const isDisabledCellDesc = (name: string) => {
    if (
      name === 'Data Date' ||
      name === 'Work Item' ||
      //   name === 'ISBL' ||
      //   name === 'OSBL' ||
      name === 'Drawing Released' ||
      name === 'Release' ||
      name === 'Work Done Till Date' ||
      name === 'Front Available' ||
      name === 'Plan For The Month' ||
      name === 'Achieved FTM' ||
      name === 'Achieved FTD' ||
      name === 'Scope'
    ) {
      return true
    }
    return false
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Col md='12' className=''>
          <Card>
            <CardBody className='pt-2' key={props?.getData?.sheet_name}>
              <Show IF={result?.isLoading}>
                <>
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                  <Shimmer style={{ height: 50, marginBottom: 20 }} />
                </>
              </Show>
              <Hide IF={result?.isLoading}>
                <>
                  <Row>
                    <Col md='12'>
                      <Label className='text-10 fw-bolder'>{FM('sheet-name')}</Label>
                    </Col>
                    <Col md='3'>
                      <FormGroupCustom
                        noLabel
                        key={props?.getData?.sheet_name}
                        name={'sheet_name'}
                        label={FM('sheet-name')}
                        // defaultValue={props?.getData?.sheet_name}
                        type={'text'}
                        onRegexValidation={{
                          form: form,
                          fieldName: 'sheet_name'
                        }}
                        className='mb-2'
                        control={control}
                        rules={{ required: true }}
                      />
                    </Col>
                    <Col md='1'>
                      <Button
                        outline
                        block
                        color='primary'
                        onClick={() => {
                          append({
                            name: '',
                            map_value: []
                          })
                        }}
                      >
                        {FM('add')}
                      </Button>
                    </Col>
                  </Row>
                  {fields?.map((f: any, i) => {
                    return (
                      <>
                        {/* <Hide IF={f?.name === 'Work Item'}> */}
                        <Row key={f.id} className='mb-2 border pb-2 pt-2'>
                          <Col md='2'>
                            <FormGroupCustom
                              //   isDisabled={isDisabledCellDesc(f?.name)}
                              name={`dpr_map.${i}.name`}
                              label={FM('cell-desc')}
                              type={'text'}
                              onRegexValidation={{
                                form: form,
                                fieldName: `dpr_map.${i}.name`
                              }}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                            />
                            <FormGroupCustom
                              key={`${f?.name}`}
                              //   isDisabled={isDisabledCellDesc(f?.name)}
                              //defaultValue={setDefaultOrderNo(f?.name)}
                              name={`dpr_map.${i}.orderno`}
                              label={FM('order-no')}
                              type={'number'}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                            />

                            <Hide IF={isDisabledCellDesc(f?.name)}>
                              <Button
                                color='danger'
                                outline
                                block
                                onClick={() => {
                                  remove(i)
                                }}
                              >
                                {FM('delete')}
                              </Button>
                            </Hide>
                          </Col>
                          <Col md='10'>
                            <FieldArray
                              control={control}
                              index={i}
                              selectState={state.descriptionData}
                            />
                          </Col>
                        </Row>
                        {/* </Hide> */}
                      </>
                    )
                  })}
                </>
              </Hide>
              <Col sm='3'>
                <LoadingButton
                  loading={result?.isLoading || props?.getData?.isLoading}
                  className=''
                  color='primary'
                >
                  <>{FM('submit-map')}</>
                </LoadingButton>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}

export default Map

// custom hook for rendering each item in the array
function FieldArray(props: { control: Control<any>; index: number; selectState: any[] }) {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control: props.control, // control props comes from useForm (optional: if you are using FormContext)
    name: `dpr_map.${props.index}.map_value` // unique name for your Field Array
  })
  useEffect(() => {
    // initialize the array if not exist
    if (fields.length === 0) {
      append({
        item_desc: '',
        cell_value: '',
        row_position: '',
        row_new_position: ''
      })
    }
  }, [fields])
  return (
    <>
      <Row>
        {fields.map((field, index) => (
          <>
            <Col md='3' key={field.id}>
              <FormGroupCustom
                label={FM('item-description')}
                name={`dpr_map.${props.index}.map_value.${index}.item_desc`}
                type={'select'}
                className='mb-2'
                control={props.control}
                // message={FM('select-discount-type-fixed-or-percentage')}
                selectOptions={props.selectState}
                rules={{ required: true }}
              />
            </Col>
            <Col md='3'>
              <FormGroupCustom
                name={`dpr_map.${props.index}.map_value.${index}.cell_value`}
                label={FM('cell-value')}
                type={'text'}
                className='mb-2'
                control={props.control}
                rules={{ required: true }}
              />
            </Col>
            <Col md='2'>
              <FormGroupCustom
                name={`dpr_map.${props.index}.map_value.${index}.row_position`}
                label={FM('row-position')}
                type={'text'}
                className='mb-2'
                control={props.control}
                rules={{ required: true }}
              />
            </Col>
            {/* <Col md='2'>
              <FormGroupCustom
                name={`dpr_map.${props.index}.map_value.${index}.row_new_position`}
                label={FM('row-new-position')}
                type={'text'}
                className='mb-2'
                control={props.control}
                rules={{ required: true }}
              />
            </Col> */}
            <Col md='2'>
              {index + 1 === fields.length ? (
                <Button
                  outline
                  block
                  color='primary'
                  className='mt-2'
                  onClick={() => {
                    append({
                      cell_value: '',
                      row_position: '',
                      row_new_position: ''
                    })
                  }}
                >
                  {FM('insert')}
                </Button>
              ) : (
                <Button
                  block
                  color='danger'
                  outline
                  className='mt-2'
                  onClick={() => {
                    log('index', index)
                    remove(index)
                  }}
                >
                  {FM('remove')}
                </Button>
              )}
            </Col>
          </>
        ))}
      </Row>
    </>
  )
}
