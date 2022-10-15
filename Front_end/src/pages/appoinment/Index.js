import React,  { useState,useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { Row, Button, Col, Card, CardBody, Input,Label } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { Link, useHistory, useParams } from "react-router-dom";
import Spinner from '../../utils/Spinner';

const Tables = () => {
    const { date } = useParams();
    const [loader,setLoader]=useState(false);
    const [clientList,setClientList]=useState([]);
    const [dateFrom,setDateFrom]=useState(new Date().toISOString().substr(0,10));
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteAppoinmentId, setDeleteAppoinmentId] = useState(0);
    const history = useHistory();
    
    const GetActionFormat = (cell, row) => {    
        return (
        <div>
            <button
            type="button"
            className="btn btn-outline-primary btn-sm ts-buttom "
            size="sm"
            data={cell}
            onClick={()=>{
                handleModelEdit(row.ClientId,row.LoanTypeId);
                }}
            >
            Update
            </button>
            <> </>
            <button
            type="button"
            className="btn btn-outline-primary btn-sm ts-buttom"
            size="sm"
            data={cell}
            onClick={()=>{
                handleModelDelete(row.AppoinmentId);
            }}
            >
            Delete
            </button>
        </div>
        );
    };

    const handleModelEdit = (clientId,loanTypeId) => {
        history.push("/appoinment/update/" + clientId+"&"+loanTypeId);
        // handleShow();
    };
    const handleModelDelete = (id) => {
        setDeleteAppoinmentId(id);
        setDeleteModalShow(true);
    };

    const GetAppoinments = async (date) => {
        setLoader(true);
        await Axios.get(`/appoinment/byDate/${date?date:dateFrom}`)
        .then(function (response) {
            if(response.data){
                console.log(response.data.Appoinments)
                var list=response.data.Appoinments;
                if(list.length>0){
                    setClientList(list);
                }
                else{
                    setClientList([]);
                }
            }else{
                setClientList([]);
            }
            setLoader(false);
        })
        .catch(function (error) {
            setLoader(false);
        //   setModalDetails({header:"FetchData error response !",body:error});
        });
    };

    useEffect(() => {
        if(date){
            (async () => {
                await Promise.all([setDateFrom(date),GetAppoinments(date)]);
            })();
        }else{
            GetAppoinments()
        }
    }, [date])

    const deleteAppoinment = async () => {
        // setLoader(true);
        if(deleteAppoinmentId>0){
            await Axios.delete(`/appoinment/id/${deleteAppoinmentId}`)
            .then(function (response) {
                if(response.data){
                    window.location.reload();
                }else{
                    
                }
                setLoader(false);
            })
            .catch(function (error) {
                setLoader(false);
            //   setModalDetails({header:"FetchData error response !",body:error});
            });
        }
    };

    const columns = [
        {
            dataField: 'sl',
            text: 'SL#',
            sort: true,
        },
        {
            dataField: 'FullName',
            text: 'Full Name',
            sort: false,
        },
        {
            dataField: 'Phone',
            text: 'Phone',
            sort: false,
        },
        // {
        //     dataField: 'Date',
        //     text: 'Date',
        //     formatter: (cell) => {
        //         return new Date(cell).toISOString().substr(0,10)
        //     },
        //     sort: true,
        // },
        {
            dataField: 'Time',
            text: 'Time',
            sort: true,
        },
        {
            dataField: 'LoanTypeName',
            text: 'Loan Type',
            sort: true,
        },
        {
            dataField: 'LoanConditionName',
            text: 'Loan Condition',
            sort: true,
        },
        {
            dataField: '',
            text: 'Action',
            formatter:GetActionFormat,  
            sort: true,
        }
    ];

    const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }) => (
        <>
            <label className="d-inline mr-1">Show</label>
            <Input type="select" name="select" id="no-entries" className="custom-select custom-select-sm d-inline col-1"
                defaultValue={currSizePerPage}
                onChange={(e) => onSizePerPageChange(e.target.value)}>
                {options.map((option, idx) => {
                    return <option key={idx}>{option.text}</option>
                })}
            </Input>
            <label className="d-inline ml-1">entries</label>
        </>
    );

    const TableWithColumnToggle = () => {
        const { SearchBar } = Search;
        const { ExportCSVButton } = CSVExport;
        return (
            <Card>
                <CardBody>
                    {/* <h4 className="header-title mt-0 mb-1">Toggle Columns</h4>
                    <p className="sub-header">Show/Hide any column you want</p> */}
    
                    <ToolkitProvider 
                        keyField="id" 
                        data={clientList} 
                        columns={columns} 
                        columnToggle
                        search
                        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
                        >
                        {props => (
                            <div>
                               <Row>
                                    <Col xl={8}>
                                    <Link className="btn btn-danger mb-sm-0" to="/appoinment/create" ><i className="uil-plus mr-1"></i>Create</Link>
                                    {/* <UncontrolledButtonDropdown>
                                        <DropdownToggle color="danger" className="dropdown-toggle">
                                            <i className='uil uil-plus mr-1'></i>Create
                                                <i className="icon ml-1"><ChevronDown /></i>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                                <Link  to="/appoinment/create" >Registered Client</Link>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <Link  to="/appoinment/create" >Over Phone Call</Link>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown> */}
                                    {/* </Col>
                                    <Col xl={6}> */}
                                        <div className="btn-group">
                                            <Label md={5} className="text-md-right">Appoinment Date</Label>
                                            {/* <Flatpickr value={new Date()} options={{altInput: true, mode: "range"}}
                                                        // onChange={date => { setDates(date)}}
                                                        onClose={(selectedDates) => setDates(selectedDates[0],selectedDates[1])}
                                                        className="form-control" /> */}
                                                <Input type="date" placeholder="date" value={dateFrom} onChange={(e) =>setDateFrom(e.target.value)} required/>
                                                {/* <Input type="date" id="date-input" placeholder="date" value={dateTo} onChange={(e) =>setDateTo(e.target.value)} required/> */}
                                            <button type="button" className="btn btn-primary   mb-sm-0" onClick={(e)=>history.push("/appoinment/index/"+dateFrom)}><i className="uil-search mr-1"></i></button>
                                        </div>
                                    </Col>
                                    <Col xl={4}>
                                        <Row>
                                            <Col md={8}>
                                                <SearchBar {...props.searchProps} />
                                            </Col>
                                            {/* <CustomToggleList {...props.columnToggleProps} /> */}
                                            <Col md={4}>
                                                <ExportCSVButton {...props.csvProps} className="btn btn-primary">
                                                    CSV
                                                </ExportCSVButton>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <BootstrapTable
                                    {...props.baseProps}
                                    keyField="sl"
                                    bordered={false}
                                    pagination={paginationFactory({ sizePerPage: 5, sizePerPageRenderer: sizePerPageRenderer, sizePerPageList: [{ text: '5', value: 5, }, { text: '10', value: 10 }, { text: '25', value: 25 }, { text: 'All', value: clientList.length }] })}
                                    wrapperClasses="table-responsive"
                                />
                            </div>
                        )}
                    </ToolkitProvider>
                </CardBody>
            </Card>
        );
    };

    return (
        <>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Appoinment', path: '/appoinment/create' },
                            { label: 'Index', path: '/', active: true },
                        ]}
                        title={'Todays Appoinments List'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <TableWithColumnToggle />
                </Col>
            </Row>
            
            <Modal show={deleteModalShow} onHide={()=>{setDeleteAppoinmentId(0) && setDeleteModalShow(false)}} size="md">
                <Modal.Header>
                <Modal.Title>Appoinment Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure about this appoinment deletion ?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>deleteAppoinment()}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={()=>{setDeleteAppoinmentId(0); setDeleteModalShow(false);}}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Spinner active={loader}></Spinner>
        </>
    );
};

export default Tables;
