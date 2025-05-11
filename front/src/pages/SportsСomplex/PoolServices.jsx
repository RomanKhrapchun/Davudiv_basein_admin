import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import useFetch from "../../hooks/useFetch";
import Table from "../../components/common/Table/Table";
import {generateIcon, iconMap, STATUS} from "../../utils/constans";
import Button from "../../components/common/Button/Button";
import PageError from "../ErrorPage/PageError";
import classNames from "classnames";
import Pagination from "../../components/common/Pagination/Pagination";
import Input from "../../components/common/Input/Input";
import {fetchFunction, hasOnlyAllowedParams, validateFilters} from "../../utils/function";
import {useNotification} from "../../hooks/useNotification";
import {Context} from "../../main";
import Dropdown from "../../components/common/Dropdown/Dropdown";
import SkeletonPage from "../../components/common/Skeleton/SkeletonPage";
import Modal from "../../components/common/Modal/Modal.jsx";
import {Transition} from "react-transition-group";

const viewIcon = generateIcon(iconMap.view)
const downloadIcon = generateIcon(iconMap.download)
const editIcon = generateIcon(iconMap.edit)
const filterIcon = generateIcon(iconMap.filter)
const searchIcon = generateIcon(iconMap.search, 'input-icon')
const dropDownIcon = generateIcon(iconMap.arrowDown)
const dropDownStyle = {width: '100%'}
const childDropDownStyle = {justifyContent: 'center'}
const PoolServices = () => {
        const navigate = useNavigate()
        const notification = useNotification()
        const {store} = useContext(Context)
        const nodeRef = useRef(null)
        const [stateDebtor, setStateDebtor] = useState({
            isOpen: false,
            selectData: {},
            confirmLoading: false,
            itemId: null,
            sendData: {
                limit: 16,
                page: 1,
            }
        })
        const isFirstRun = useRef(true)
        const {error, status, data, retryFetch} = useFetch('/api/sportscomplex/filter-pool', {
            method: 'post',
            data: stateDebtor.sendData
        })
        const startRecord = ((stateDebtor.sendData.page || 1) - 1) * stateDebtor.sendData.limit + 1;
        const endRecord = Math.min(startRecord + stateDebtor.sendData.limit - 1, data?.totalItems || 1);

        useEffect(() => {
            if (isFirstRun.current) {
                isFirstRun.current = false
                return;
            }
            retryFetch('/api/sportscomplex/filter-pool', {
                method: 'post',
                data: stateDebtor.sendData,
            })
        }, [stateDebtor.sendData, retryFetch])

        const columnTable = useMemo(() => {
            return [
                {
                    title: 'Назва послуги',
                    dataIndex: 'serviceName',
                },
                {
                    title: 'Одиниці',
                    dataIndex: 'unit',
                },
                {
                    title: 'Ціна',
                    dataIndex: 'price',
                },
                {
                    title: 'Дія',
                    dataIndex: 'action',
                    render: (_, { id }) => (
                        <div className="btn-sticky" style={{ justifyContent: 'center' }}>
                            <Button
                                title="Перегляд"
                                icon={viewIcon}
                                onClick={() => navigate(`/subscription/${id}`)}
                            />
                            <Button
                                title="Редагувати"
                                icon={editIcon}
                                onClick={() => navigate(`/subscription/${id}/edit`)}
                            />
                        </div>
                    ),
                }
            ];
        }, [navigate]);                

        const tableData = useMemo(() => {
            if (data?.items?.length) {
                return data?.items?.map(el => ({
                    key: el.id,
                    id: el.id,
                    serviceName: el.serviceName,
                    unit: el.unit,
                    price: el.price,
                }))                
            }
            return []
        }, [data])        

        const itemMenu = [
            {
                label: '16',
                key: '16',
                onClick: () => {
                    if (stateDebtor.sendData.limit !== 16) {
                        setStateDebtor(prevState => ({
                            ...prevState,
                            sendData: {
                                ...prevState.sendData,
                                limit: 16,
                                page: 1,
                            }
                        }))
                    }
                },
            },
            {
                label: '32',
                key: '32',
                onClick: () => {
                    if (stateDebtor.sendData.limit !== 32) {
                        setStateDebtor(prevState => ({
                            ...prevState,
                            sendData: {
                                ...prevState.sendData,
                                limit: 32,
                                page: 1,
                            }
                        }))
                    }
                },
            },
            {
                label: '48',
                key: '48',
                onClick: () => {
                    if (stateDebtor.sendData.limit !== 48) {
                        setStateDebtor(prevState => ({
                            ...prevState,
                            sendData: {
                                ...prevState.sendData,
                                limit: 48,
                                page: 1,
                            }
                        }))
                    }
                },
            },
        ]

        const filterHandleClick = () => {
            setStateDebtor(prevState => ({
                ...prevState,
                isOpen: !prevState.isOpen,
            }))
        }

        const onHandleChange = (name, value) => {
            setStateDebtor(prevState => ({
                ...prevState,
                selectData: {
                    ...prevState.selectData,
                    [name]: value
                }
            }))
        }

        const resetFilters = () => {
            if (Object.values(stateDebtor.selectData).some(value => value)) {
                setStateDebtor(prevState => ({
                    ...prevState,
                    selectData: {},
                }));
            }
            const dataReadyForSending = hasOnlyAllowedParams(stateDebtor.sendData, ['limit', 'page'])
            if (!dataReadyForSending) {
                setStateDebtor(prevState => ({
                    ...prevState,
                    sendData: {
                        limit: prevState.sendData.limit,
                        page: 1,
                    }
                }))
            }
        }

        const applyFilter = () => {
            const isAnyInputFilled = Object.values(stateDebtor.selectData).some(value => {
                if (Array.isArray(value) && !value.length) {
                    return false
                }
                return value
            })
            if (isAnyInputFilled) {
                const dataValidation = validateFilters(stateDebtor.selectData)
                if (!dataValidation.error) {
                    setStateDebtor(prevState => ({
                        ...prevState,
                        sendData: {
                            ...dataValidation,
                            limit: prevState.sendData.limit,
                            page: 1,
                        }
                    }))
                } else {
                    notification({
                        type: 'warning',
                        placement: 'top',
                        title: 'Помилка',
                        message: dataValidation.message ?? 'Щось пішло не так.',
                    })
                }
            }
        }

        const onPageChange = useCallback((page) => {
            if (stateDebtor.sendData.page !== page) {
                setStateDebtor(prevState => ({
                    ...prevState,
                    sendData: {
                        ...prevState.sendData,
                        page,
                    }
                }))
            }
        }, [stateDebtor.sendData.page])

        const handleOpenModal = (recordId) => {
            setStateDebtor(prevState => ({
                ...prevState,
                itemId: recordId,
            }))
            document.body.style.overflow = 'hidden'
        }

        const handleCloseModal = () => {
            setStateDebtor(prevState => ({
                ...prevState,
                itemId: null,
            }))
            document.body.style.overflow = 'auto';
        }

        const handleGenerate = async () => {
            if (stateDebtor.itemId) {
                try {
                    setStateDebtor(prevState => ({
                        ...prevState,
                        confirmLoading: true,
                    }))
                    const fetchData = await fetchFunction(`api/debtor/generate/${stateDebtor.itemId}`, {
                        method: 'get',
                        responseType: 'blob'
                    })
                    notification({
                        placement: "top",
                        duration: 2,
                        title: 'Успіх',
                        message: "Успішно сформовано.",
                        type: 'success'
                    })
                    const blob = fetchData.data
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'generated.docx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                } catch (error) {
                    if (error?.response?.status === 401) {
                        notification({
                            type: 'warning',
                            title: "Помилка",
                            message: error?.response?.status === 401 ? "Не авторизований" : error.message,
                            placement: 'top',
                        })
                        store.logOff()
                        return navigate('/')
                    }
                    notification({
                        type: 'warning',
                        title: "Помилка",
                        message: error?.response?.data?.message ? error.response.data.message : error.message,
                        placement: 'top',
                    })
                } finally {
                    setStateDebtor(prevState => ({
                        ...prevState,
                        confirmLoading: false,
                        itemId: null,
                    }))
                    document.body.style.overflow = 'auto';
                }
            }
        }

        if (status === STATUS.ERROR) {
            return <PageError title={error.message} statusError={error.status}/>
        }

        return (
            <React.Fragment>
                {status === STATUS.PENDING ? <SkeletonPage/> : null}
                {status === STATUS.SUCCESS ?
                    <React.Fragment>
                        <div className="table-elements">
                            <div className="table-header">
                                <h2 className="title title--sm">
                                    {data?.items && Array.isArray(data?.items) && data?.items.length > 0 ?
                                        <React.Fragment>
                                            Показує {startRecord !== endRecord ? `${startRecord}-${endRecord}` : startRecord} з {data?.totalItems || 1}
                                        </React.Fragment> : <React.Fragment>Записів не знайдено</React.Fragment>
                                    }
                                </h2>
                                <div className="table-header__buttons">
                                    <Button
                                        onClick={() => navigate('/debtor/create')}
                                        className="btn--primary"
                                    >
                                        Додати сервіс
                                    </Button>
                                    <Dropdown
                                        icon={dropDownIcon}
                                        iconPosition="right"
                                        style={dropDownStyle}
                                        childStyle={childDropDownStyle}
                                        caption={`Записів: ${stateDebtor.sendData.limit}`}
                                        menu={itemMenu}
                                    />
                                    <Button
                                        className="table-filter-trigger"
                                        onClick={filterHandleClick}
                                        icon={filterIcon}
                                    >
                                        Фільтри
                                    </Button>
                                </div>
                            </div>
                            <div className="table-main">
                                <div style={{width: `${data?.items?.length > 0 ? 'auto' : '100%'}`}}
                                     className={classNames("table-and-pagination-wrapper", {"table-and-pagination-wrapper--active": stateDebtor.isOpen})}>
                                    <Table columns={columnTable} dataSource={tableData}/>
                                    <Pagination
                                        className="m-b"
                                        currentPage={parseInt(data?.currentPage) || 1}
                                        totalCount={data?.totalItems || 1}
                                        pageSize={stateDebtor.sendData.limit}
                                        onPageChange={onPageChange}/>
                                </div>
                                <div className={`table-filter ${stateDebtor.isOpen ? "table-filter--active" : ""}`}>
                                    <h3 className="title title--sm">
                                        Фільтри
                                    </h3>
                                    <div className="btn-group">
                                        <Button onClick={applyFilter}>
                                            Застосувати
                                        </Button>
                                        <Button className="btn--secondary" onClick={resetFilters}>
                                            Скинути
                                        </Button>
                                    </div>
                                    <div className="table-filter__item">
                                        <Input
                                            icon={searchIcon}
                                            name="title"
                                            type="text"
                                            placeholder="Введіть прізвище"
                                            value={stateDebtor.selectData?.title || ''}
                                            onChange={onHandleChange}/>
                                    </div>
                                    <div className="table-filter__item">
                                        <h4 className="input-description">
                                            ІПН
                                        </h4>
                                        <Input
                                            icon={searchIcon}
                                            name="identification"
                                            type="text"
                                            minLength="3"
                                            placeholder="Введіть 3 останні цифри ІПН"
                                            value={stateDebtor.selectData?.identification || ''}
                                            onChange={onHandleChange}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment> : null
                }
                <Transition in={!!stateDebtor.itemId} timeout={200} unmountOnExit nodeRef={nodeRef}>
                    {state => (
                        <Modal
                            className={`${state === 'entered' ? "modal-window-wrapper--active" : ""}`}
                            onClose={handleCloseModal}
                            onOk={handleGenerate}
                            confirmLoading={stateDebtor.confirmLoading}
                            cancelText="Скасувати"
                            okText="Так, сформувати"
                            title="Підтвердження формування реквізитів">
                            <p className="paragraph">
                                Ви впевнені, що бажаєте виконати операцію &quot;Сформувати реквізити&quot;?
                            </p>
                        </Modal>
                    )}
                </Transition>
            </React.Fragment>
        )
    }
;
export default PoolServices;