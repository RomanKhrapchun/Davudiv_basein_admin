import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from "../../hooks/useFetch";
import Table from "../../components/common/Table/Table";
import { generateIcon, iconMap, STATUS } from "../../utils/constans";
import Button from "../../components/common/Button/Button";
import PageError from "../ErrorPage/PageError";
import classNames from "classnames";
import Pagination from "../../components/common/Pagination/Pagination";
import Input from "../../components/common/Input/Input";
import { fetchFunction, hasOnlyAllowedParams, validateFilters } from "../../utils/function";
import { useNotification } from "../../hooks/useNotification";
import { Context } from "../../main";
import Dropdown from "../../components/common/Dropdown/Dropdown";
import Modal from "../../components/common/Modal/Modal.jsx";
import { Transition } from "react-transition-group";
import SkeletonPage from "../../components/common/Skeleton/SkeletonPage";
import FormItem from "../../components/common/FormItem/FormItem"; // Додано для форми

const viewIcon = generateIcon(iconMap.view);
const downloadIcon = generateIcon(iconMap.download);
const editIcon = generateIcon(iconMap.edit);
const filterIcon = generateIcon(iconMap.filter);
const searchIcon = generateIcon(iconMap.search, 'input-icon');
const dropDownIcon = generateIcon(iconMap.arrowDown);
const addIcon = generateIcon(iconMap.add); // Додано іконку для кнопки додавання
const dropDownStyle = { width: '100%' };
const childDropDownStyle = { justifyContent: 'center' };

const SportsComplexDetails = () => {
    const navigate = useNavigate();
    const notification = useNotification();
    const { store } = useContext(Context);
    const nodeRef = useRef(null);
    const addFormRef = useRef(null); // Референція для модального вікна додавання
    const isFirstRun = useRef(true);
    
    const [state, setState] = useState({
        isOpen: false,
        selectData: {},
        confirmLoading: false,
        itemId: null,
        sendData: {
            limit: 16,
            page: 1,
        }
    });
    
    // Додано новий стан для модального вікна додавання
    const [addModalState, setAddModalState] = useState({
        isOpen: false,
        loading: false,
        formData: {
            kved: '',
            iban: '',
            edrpou: '',
            service_group_id: '1'
        }
    });

    const { error, status, data, retryFetch } = useFetch('api/sportscomplex/filter-requisites', {
        method: 'post',
        data: state.sendData
    });

    const startRecord = ((state.sendData.page || 1) - 1) * state.sendData.limit + 1;
    const endRecord = Math.min(startRecord + state.sendData.limit - 1, data?.totalItems || 1);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        retryFetch('api/sportscomplex/filter-requisites', {
            method: 'post',
            data: state.sendData,
        });
    }, [state.sendData, retryFetch]);

    const columnTable = useMemo(() => [
        { title: 'ID', dataIndex: 'id' },
        { title: 'КВЕД', dataIndex: 'kved' },
        { title: 'IBAN', dataIndex: 'iban' },
        { title: 'ЄДРПОУ', dataIndex: 'edrpou' },
        { title: 'Група послуг', dataIndex: 'group_name' },
        {
            title: 'Дія',
            dataIndex: 'action',
            render: (_, {id}) => (
                <div className="btn-sticky" style={{justifyContent: 'center'}}>
                    <Button 
                        title="Перегляд" 
                        icon={viewIcon} 
                        onClick={() => navigate(`/details/${id}`)} 
                    />
                    <Button 
                        title="Завантажити" 
                        icon={downloadIcon} 
                        onClick={() => handleOpenModal(id)} 
                    />
                    <Button 
                        title="Реквізити" 
                        icon={editIcon} 
                        onClick={() => navigate(`/details/${id}/print`)} 
                    />
                </div>
            )
        }
    ], [navigate]);

    const tableData = useMemo(() => (data?.items || []).map(el => ({
        key: el.id,
        id: el.id,
        kved: el.kved,
        iban: el.iban,
        edrpou: el.edrpou,
        group_name: el.group_name
    })), [data]);

    const itemMenu = [16, 32, 48].map(size => ({
        label: `${size}`,
        key: `${size}`,
        onClick: () => {
            if (state.sendData.limit !== size) {
                setState(prev => ({...prev, sendData: {...prev.sendData, limit: size, page: 1}}));
            }
        }
    }));

    const filterHandleClick = () => setState(prev => ({...prev, isOpen: !prev.isOpen}));

    const onHandleChange = (name, value) => setState(prev => ({...prev, selectData: {...prev.selectData, [name]: value}}));
    
    // Функція для зміни полів форми додавання
    const onAddFormChange = (name, value) => {
        setAddModalState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                [name]: value
            }
        }));
    };

    const resetFilters = () => {
        setState(prev => ({...prev, selectData: {}}));
        
        const dataReadyForSending = hasOnlyAllowedParams(state.sendData, ['limit', 'page']);
        if (!dataReadyForSending) {
            setState(prev => ({...prev, sendData: {limit: prev.sendData.limit, page: 1}}));
        }
    };

    const applyFilter = () => {
        if (Object.values(state.selectData).some(val => val)) {
            const dataValidation = validateFilters(state.selectData);
            if (!dataValidation.error) {
                setState(prev => ({...prev, sendData: {...dataValidation, limit: prev.sendData.limit, page: 1}}));
            } else {
                notification({ 
                    type: 'warning', 
                    title: 'Помилка', 
                    message: dataValidation.message,
                    placement: 'top' 
                });
            }
        }
    };

    const onPageChange = useCallback(page => setState(prev => ({...prev, sendData: {...prev.sendData, page}})), []);

    const handleOpenModal = (id) => {
        setState(prev => ({...prev, itemId: id}));
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setState(prev => ({...prev, itemId: null}));
        document.body.style.overflow = 'auto';
    };
    
    // Функції для модального вікна додавання
    const openAddModal = () => {
        setAddModalState(prev => ({
            ...prev,
            isOpen: true,
            formData: {
                kved: '',
                iban: '',
                edrpou: '',
                service_group_id: '1'
            }
        }));
        document.body.style.overflow = 'hidden';
    };
    
    const closeAddModal = () => {
        setAddModalState(prev => ({
            ...prev,
            isOpen: false
        }));
        document.body.style.overflow = 'auto';
    };
    
    // Функція для обробки відправки форми додавання
    const handleAddFormSubmit = async () => {
        const { kved, iban, edrpou, service_group_id } = addModalState.formData;
        
        // Валідація форми
        if (!kved || !iban || !edrpou) {
            notification({
                type: 'warning',
                placement: 'top',
                title: 'Помилка',
                message: 'Всі поля форми обов\'язкові для заповнення',
            });
            return;
        }
        
        try {
            setAddModalState(prev => ({...prev, loading: true}));
            
            // Відправка даних до серверу
            await fetchFunction('/api/sportscomplex/requisites', {
                method: 'post',
                data: {
                    kved,
                    iban,
                    edrpou,
                    service_group_id: parseInt(service_group_id)
                }
            });
            
            notification({
                type: 'success',
                placement: 'top',
                title: 'Успіх',
                message: 'Реквізити успішно додано',
            });
            
            // Оновлення даних в таблиці
            retryFetch('api/sportscomplex/filter-requisites', {
                method: 'post',
                data: state.sendData,
            });
            
            // Закриття модального вікна
            closeAddModal();
        } catch (error) {
            if (error?.response?.status === 401) {
                notification({
                    type: 'warning',
                    title: "Помилка",
                    message: "Не авторизований",
                    placement: 'top',
                });
                store.logOff();
                return navigate('/');
            }
            
            notification({
                type: 'warning',
                title: "Помилка",
                message: error?.response?.data?.message ? error.response.data.message : error.message,
                placement: 'top',
            });
        } finally {
            setAddModalState(prev => ({...prev, loading: false}));
        }
    };

    // Покращена обробка помилок як у PoolServices
    const handleGenerate = async () => {
        if (!state.itemId) return;
        
        try {
            setState(prev => ({...prev, confirmLoading: true}));
            
            const response = await fetchFunction(`api/sportscomplex/generate/${state.itemId}`, { 
                method: 'get', 
                responseType: 'blob' 
            });
            
            // Успішне повідомлення
            notification({
                placement: "top",
                duration: 2,
                title: 'Успіх',
                message: "Успішно сформовано.",
                type: 'success'
            });
            
            // Обробка скачування
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated.docx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            // Покращена обробка помилок, взята з PoolServices
            if (error?.response?.status === 401) {
                notification({
                    type: 'warning',
                    title: "Помилка",
                    message: error?.response?.status === 401 ? "Не авторизований" : error.message,
                    placement: 'top',
                });
                store.logOff();
                return navigate('/');
            }
            
            notification({
                type: 'warning',
                title: 'Помилка',
                message: error?.response?.data?.message ? error.response.data.message : error.message,
                placement: 'top'
            });
        } finally {
            setState(prev => ({...prev, confirmLoading: false, itemId: null}));
            document.body.style.overflow = 'auto';
        }
    };

    if (status === STATUS.ERROR) {
        return <PageError title={error.message} statusError={error.status} />;
    }

    return (
        <>
            {status === STATUS.PENDING && <SkeletonPage />}
            
            {status === STATUS.SUCCESS && (
                <div className="table-elements">
                    <div className="table-header">
                        <h2 className="title title--sm">
                            {data?.items?.length ? 
                                `Показує ${startRecord}-${endRecord} з ${data?.totalItems}` : 
                                'Записів не знайдено'
                            }
                        </h2>
                        <div className="table-header__buttons">
                            {/* Додано кнопку "Додати" */}
                            <Button 
                                className="btn--primary"
                                onClick={openAddModal}
                                icon={addIcon}
                            >
                                Додати
                            </Button>
                            <Dropdown 
                                icon={dropDownIcon} 
                                iconPosition="right" 
                                style={dropDownStyle} 
                                childStyle={childDropDownStyle} 
                                caption={`Записів: ${state.sendData.limit}`} 
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
                        <div 
                            style={{width: data?.items?.length > 0 ? 'auto' : '100%'}} 
                            className={classNames("table-and-pagination-wrapper", {"table-and-pagination-wrapper--active": state.isOpen})}
                        >
                            <Table columns={columnTable} dataSource={tableData} />
                            <Pagination 
                                className="m-b" 
                                currentPage={parseInt(data?.currentPage) || 1} 
                                totalCount={data?.totalItems || 1} 
                                pageSize={state.sendData.limit} 
                                onPageChange={onPageChange} 
                            />
                        </div>
                        <div className={`table-filter ${state.isOpen ? "table-filter--active" : ""}`}>
                            <h3 className="title title--sm">Фільтри</h3>
                            <div className="btn-group">
                                <Button onClick={applyFilter}>Застосувати</Button>
                                <Button className="btn--secondary" onClick={resetFilters}>Скинути</Button>
                            </div>
                            <div className="table-filter__item">
                                <Input 
                                    icon={searchIcon} 
                                    name="kved" 
                                    placeholder="КВЕД" 
                                    value={state.selectData?.kved || ''} 
                                    onChange={onHandleChange} 
                                />
                            </div>
                            <div className="table-filter__item">
                                <Input 
                                    icon={searchIcon} 
                                    name="iban" 
                                    placeholder="IBAN" 
                                    value={state.selectData?.iban || ''} 
                                    onChange={onHandleChange} 
                                />
                            </div>
                            <div className="table-filter__item">
                                <Input 
                                    icon={searchIcon} 
                                    name="edrpou" 
                                    placeholder="ЄДРПОУ" 
                                    value={state.selectData?.edrpou || ''} 
                                    onChange={onHandleChange} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Модальне вікно для підтвердження генерації */}
            <Transition in={!!state.itemId} timeout={200} unmountOnExit nodeRef={nodeRef}>
                {transitionState => (
                    <Modal
                        className={transitionState === 'entered' ? "modal-window-wrapper--active" : ""}
                        onClose={handleCloseModal}
                        onOk={handleGenerate}
                        confirmLoading={state.confirmLoading}
                        cancelText="Скасувати"
                        okText="Так, сформувати"
                        title="Підтвердження формування реквізитів"
                    >
                        <p className="paragraph">Ви впевнені, що бажаєте виконати операцію "Сформувати реквізити"?</p>
                    </Modal>
                )}
            </Transition>
            
            {/* Нове модальне вікно для додавання реквізитів */}
            <Transition in={addModalState.isOpen} timeout={200} unmountOnExit nodeRef={addFormRef}>
                {transitionState => (
                    <Modal
                        className={transitionState === 'entered' ? "modal-window-wrapper--active" : ""}
                        onClose={closeAddModal}
                        onOk={handleAddFormSubmit}
                        confirmLoading={addModalState.loading}
                        cancelText="Скасувати"
                        okText="Зберегти"
                        title="Додавання нових реквізитів"
                        width="500px"
                    >
                        <div className="form-container">
                            <FormItem 
                                label="КВЕД" 
                                required 
                                fullWidth
                            >
                                <Input
                                    name="kved"
                                    value={addModalState.formData.kved}
                                    onChange={onAddFormChange}
                                    placeholder="Введіть КВЕД"
                                />
                            </FormItem>
                            
                            <FormItem 
                                label="IBAN" 
                                required 
                                fullWidth
                            >
                                <Input
                                    name="iban"
                                    value={addModalState.formData.iban}
                                    onChange={onAddFormChange}
                                    placeholder="Введіть IBAN"
                                />
                            </FormItem>
                            
                            <FormItem 
                                label="ЄДРПОУ" 
                                required 
                                fullWidth
                            >
                                <Input
                                    name="edrpou"
                                    value={addModalState.formData.edrpou}
                                    onChange={onAddFormChange}
                                    placeholder="Введіть ЄДРПОУ"
                                />
                            </FormItem>
                            
                            <FormItem 
                                label="Група послуг" 
                                required 
                                fullWidth
                            >
                                <Input
                                    name="service_group_id"
                                    type="number"
                                    value={addModalState.formData.service_group_id}
                                    onChange={onAddFormChange}
                                    placeholder="Введіть ID групи послуг"
                                />
                            </FormItem>
                        </div>
                    </Modal>
                )}
            </Transition>
        </>
    );
};

export default SportsComplexDetails;