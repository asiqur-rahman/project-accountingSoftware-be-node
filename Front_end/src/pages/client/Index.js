import React,  { useState,useEffect } from 'react';
import { Row, Button, Col, Card, CardBody, Input, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { Link, useHistory} from "react-router-dom";
import Spinner from '../../utils/Spinner';
import Modal from "react-bootstrap/Modal";

const Tables = () => {
    const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false)};
    const handleShow = () => {setShow(true)};
    const [activeBtn,setActiveBtn]=useState(1);
    const [userList,setUserList]=useState([]);
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
                handleModelEdit(row.id);
                }}
            >
            Update
            </button>
            <> </>
            {/* <button
            type="button"
            className="btn btn-outline-primary btn-sm ts-buttom"
            size="sm"
            data={cell}
            onClick={()=>{
                handleModelDelete(row.id);
            }}
            >
            Delete
            </button> */}
        </div>
        );
    };

    const handleModelEdit = (id) => {
        history.push("/user/update/" + id);
    };
    const handleModelDelete = (id) => {
        handleShow();
    };

    const columns = [
        {
            dataField: 'sl',
            text: 'SL#',
            sort: false,
        },
        {
            dataField: 'FullName',
            text: 'Full Name',
            sort: true,
        },
        {
            dataField: 'LoanTypeName',
            text: 'Loan Type',
            sort: true,
        },
        {
            dataField: 'Email',
            text: 'User Email',
            sort: true,
        },
        {
            dataField: 'Phone',
            text: 'Phone',
            sort: true,
        },
        {
            dataField: '',
            text: 'Action',
            formatter:GetActionFormat,  
            sort: false,
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

    const GetClients = async (loanConditionId) => {
        setLoader(true);
        await Axios.get('/client')
        .then(function (response) {
            if(response.data){
                var list=response.data.clients;
                if(list.length>0){
                    setUserList(list);
                }
                else{
                    setUserList([]);
                }
            }else{
                setUserList([]);
            }
            setLoader(false);
        })
        .catch(function (error) {
            setLoader(false);
        //   setModalDetails({header:"FetchData error response !",body:error});
        });
    };

    useEffect(() => {
        GetClients(1);
    }, [])


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
                        data={userList} 
                        columns={columns} 
                        columnToggle
                        search
                        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
                        >
                        {props => (
                            <div>
                                <Row>
                                    <Col xl={8}>
                                    <Link className="btn btn-danger mb-sm-0" to="/client/create" ><i className="uil-plus mr-1"></i>Create</Link>
                                        <div className="btn-group ml-1">
                                            <Link className="btn btn-white" to="/client/index/processing" >Processing</Link>
                                            <Link className="btn btn-white" to="/client/index/notProcessing" >Not Processing</Link>
                                            <Link className="btn btn-white" to="/client/index/conditional" >Conditional</Link>
                                            <Link className="btn btn-white" to="/client/index/approved" >Approved</Link>
                                            <Link className="btn btn-white" to="/client/index/settled" >Settled</Link>
                                            <Link className="btn btn-white" to="/client/index/settled" >Settled</Link>
                                        </div>
                                    </Col>
                                    <Col xl={4}>
                                        <Row>
                                            <Col xl={8}>
                                                <SearchBar {...props.searchProps} />
                                            </Col>
                                            {/* <CustomToggleList {...props.columnToggleProps} /> */}
                                            <Col xl={4}>
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
                                    pagination={paginationFactory({ sizePerPage: 5, sizePerPageRenderer: sizePerPageRenderer, sizePerPageList: [{ text: '5', value: 5, }, { text: '10', value: 10 }, { text: '25', value: 25 }, { text: 'All', value: userList.length }] })}
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
                            { label: 'User', path: '/tables/advanced' },
                            { label: 'Index', path: '/tables/advanced', active: true },
                        ]}
                        title={'Users List'}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <TableWithColumnToggle />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="page-title">
                        <Col md={12}>
                            <PageTitle
                                breadCrumbItems={[
                                    { label: 'User', path: '/user/index' },
                                    { label: 'Update', path: '/user/update', active: true },
                                ]}
                                title={'Update User'}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Spinner active={loader}></Spinner>
        </>
    );
};

export default Tables;
