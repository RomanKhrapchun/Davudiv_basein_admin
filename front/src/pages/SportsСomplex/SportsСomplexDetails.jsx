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
import Dropdown from "../../components/common/Dropdown/Dropdown";
import Modal from "../../components/common/Modal/Modal.jsx";
import {Transition} from "react-transition-group";

const viewIcon = generateIcon(iconMap.view);
const downloadIcon = generateIcon(iconMap.download);
const editIcon = generateIcon(iconMap.edit);
const filterIcon = generateIcon(iconMap.filter);
const searchIcon = generateIcon(iconMap.search, 'input-icon');
const dropDownIcon = generateIcon(iconMap.arrowDown);
const dropDownStyle = {width: '100%'};
const childDropDownStyle = {justifyContent: 'center'};

const SportsComplexDetails = () => {
    const navigate = useNavigate();
    const notification = useNotification();
    const nodeRef = useRef(null);
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
    const isFirstRun = useRef(true);

    const {error, status, data, retryFetch} = useFetch('api/sportscomplex/filter-requisites', {
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
                    <Button title="Перегляд" icon={viewIcon} onClick={() => navigate(`/requisites/${id}`)} />
                    <Button title="Завантажити" icon={downloadIcon} onClick={() => handleOpenModal(id)} />
                    <Button title="Реквізити" icon={editIcon} onClick={() => navigate(`/requisites/${id}/print`)} />
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

    const resetFilters = () => {
        setState(prev => ({...prev, selectData: {}, sendData: {...prev.sendData, page: 1}}));
    };

    const applyFilter = () => {
        if (Object.values(state.selectData).some(val => val)) {
            const dataValidation = validateFilters(state.selectData);
            if (!dataValidation.error) {
                setState(prev => ({...prev, sendData: {...dataValidation, limit: prev.sendData.limit, page: 1}}));
            } else {
                notification({ type: 'warning', title: 'Помилка', message: dataValidation.message });
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

    const handleGenerate = async () => {
        try {
            const blobRes = await fetchFunction(`api/sportscomplex/generate/${state.itemId}`, { method: 'get', responseType: 'blob' });
            const blob = blobRes.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated.docx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            notification({ type: 'warning', title: 'Помилка', message: error.message });
        } finally {
            handleCloseModal();
        }
    };

    if (status === STATUS.ERROR) return <PageError title={error.message} statusError={error.status} />;

    return (
        <>
            <div className="table-elements">
                <div className="table-header">
                    <h2 className="title title--sm">
                        {data?.items?.length ? `Показує ${startRecord}-${endRecord} з ${data?.totalItems}` : 'Записів не знайдено'}
                    </h2>
                    <div className="table-header__buttons">
                        <Button text="Додати реквізити" onClick={() => navigate('/requisites/create')} />
                        <Dropdown icon={dropDownIcon} iconPosition="right" style={dropDownStyle} childStyle={childDropDownStyle} caption={`Записів: ${state.sendData.limit}`} menu={itemMenu} />
                        <Button className="table-filter-trigger" onClick={filterHandleClick} icon={filterIcon}>Фільтри</Button>
                    </div>
                </div>
                <div className="table-main">
                    <div style={{width: data?.items?.length > 0 ? 'auto' : '100%'}} className={classNames("table-and-pagination-wrapper", {"table-and-pagination-wrapper--active": state.isOpen})}>
                        <Table columns={columnTable} dataSource={tableData} />
                        <Pagination className="m-b" currentPage={parseInt(data?.currentPage) || 1} totalCount={data?.totalItems || 1} pageSize={state.sendData.limit} onPageChange={onPageChange} />
                    </div>
                    <div className={`table-filter ${state.isOpen ? "table-filter--active" : ""}`}>
                        <h3 className="title title--sm">Фільтри</h3>
                        <div className="btn-group">
                            <Button onClick={applyFilter}>Застосувати</Button>
                            <Button className="btn--secondary" onClick={resetFilters}>Скинути</Button>
                        </div>
                        <div className="table-filter__item">
                            <Input icon={searchIcon} name="kved" placeholder="КВЕД" value={state.selectData?.kved || ''} onChange={onHandleChange} />
                        </div>
                        <div className="table-filter__item">
                            <Input icon={searchIcon} name="iban" placeholder="IBAN" value={state.selectData?.iban || ''} onChange={onHandleChange} />
                        </div>
                        <div className="table-filter__item">
                            <Input icon={searchIcon} name="edrpou" placeholder="ЄДРПОУ" value={state.selectData?.edrpou || ''} onChange={onHandleChange} />
                        </div>
                    </div>
                </div>
            </div>
            <Transition in={!!state.itemId} timeout={200} unmountOnExit nodeRef={nodeRef}>
                {state => (
                    <Modal
                        className={state === 'entered' ? "modal-window-wrapper--active" : ""}
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
        </>
    );
};

export default SportsComplexDetails;
