import React,  { useState,useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { Row, Button, Col, Card,FormGroup, CardBody, Input,Label } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { Link, useHistory, useParams } from "react-router-dom";
import Spinner from '../../utils/Spinner';

const Tables = () => {
    const [loader,setLoader]=useState(false);
    const [loansList,setLoansList]=useState([]);
    const [dateFrom,setDateFrom]=useState(new Date().toISOString().substr(0,10));
    const [dateTo,setDateTo]=useState(new Date().toISOString().substr(0,10));

    const [totalAmount,setTotalAmount]=useState(0);

    const handleSubmit = async (date) => {
        setLoader(true);
        await Axios.get(`/client/getSettledAmountReport/${dateFrom}&${dateTo}`)
        .then(function (response) {
            if(response.data){
                // console.log(response.data)
                setLoansList(response.data.loans);
                setTotalAmount(response.data.totalAmount);
                // var list=response.data.Appoinments;
                // if(list.length>0){
                //     setClientList(list);
                // }
                // else{
                //     setClientList([]);
                // }
            }else{
                setLoansList([]);
            }
            setLoader(false);
        })
        .catch(function (error) {
            setLoader(false);
        //   setModalDetails({header:"FetchData error response !",body:error});
        });
    };

    // const LoadDD= async () => {
    //     setLoader(true);
    //     await Axios.get('/client/getdd')
    //     .then(function (response) {
    //         if(response.data){
    //             var LoanTypesDD=[{value:0,label:'All'}];
    //             response.data.LoanTypesDD.forEach(element => {
    //                 LoanTypesDD.push(element)
    //              });
    //             setLoanTypes(LoanTypesDD);

    //             var LoanConditionsDD=[{value:0,label:'All'}];
    //             response.data.LoanConditionsDD.forEach(element => {
    //                 LoanConditionsDD.push(element)
    //              });
    //             setLoanConditions(LoanConditionsDD);

    //             var PrioritiesDD=[{value:0,label:'All'}];
    //             response.data.PrioritiesDD.forEach(element => {
    //                 PrioritiesDD.push(element)
    //              });
    //             setPriorities(PrioritiesDD);
    //         }else{
    //             setLoanTypes([]);
    //             setLoanConditions([]);
    //         }
    //         setLoader(false);
    //     })
    //     .catch(function (error) {
    //         setLoader(false);
    //     //   setModalDetails({header:"FetchData error response !",body:error});
    //     });
    // };
    
    // useEffect(() => {
    //     if(date){
    //         (async () => {
    //             await Promise.all([setDateFrom(date)]);
    //         })();
    //     }else{
    //         // GetAppoinments();
    //         LoadDD();
    //     }
    // }, [date])

    const GetCommissionFormat=(cell, row)=>{
        return (
            <div>
                {row.Commission==0?
                <button className="btn btn-outline-warning btn-sm" size="sm">
                    Non Paid
                </button>
                :
                <button className="btn btn-success btn-sm" size="sm">
                    Paid
                </button>
                }
            </div>
        );
    }
    const GetdateFormat=(cell, row)=>{
        return (
            new Date(row.SettledDate).toISOString().substr(0,10)
        );
    }

    const columns = [
        {
            dataField: 'sl',
            text: 'SL#',
            sort: true,
        },
        {
            dataField: 'Amount',
            text: 'Amount',
            sort: false,
        },
        {
            dataField: 'SettledDate',
            text: 'Settled Time & Date',
            formatter:GetdateFormat
        },
        {
            dataField: 'Commission',
            text: 'Commission',
            formatter:GetCommissionFormat
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
        return (
            <Card>
                <CardBody>
                    {/* <h4 className="header-title mt-0 mb-1">Toggle Columns</h4>
                    <p className="sub-header">Show/Hide any column you want</p> */}

                    <ToolkitProvider 
                        keyField="id" 
                        data={loansList} 
                        columns={columns} 
                        columnToggle
                        search
                        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
                        >
                        {props => (
                            <div>
                               <Row>
                                    <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplePassword4" sm={4}>
                                                Date From
                                            </Label>
                                            <Col sm={8}>
                                                <Input type="date" placeholder="date" value={dateFrom} onChange={(e) =>setDateFrom(e.target.value)} required/>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplePassword4" sm={4}>
                                                Date To
                                            </Label>
                                            <Col sm={8}>
                                            <Input type="date" placeholder="date" value={dateTo} onChange={(e) =>setDateTo(e.target.value)} required/>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    {/* <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplePassword4" sm={4}>
                                                Loan Type
                                            </Label>
                                            <Col sm={8}>
                                            <Select
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                options={LoanTypes}
                                                defaultValue = {
                                                    LoanTypes.filter(option => 
                                                    option.value === LoanTypeId)
                                                }
                                                onChange={e => setLoanTypeId(e.value)}
                                            ></Select>
                                            </Col>
                                        </FormGroup>
                                    </Col> */}
                                    
                                    {/* <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplePassword4" sm={4}>
                                                Priority
                                            </Label>
                                            <Col sm={8}>
                                            <Select
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                options={Priorities}
                                                defaultValue = {
                                                    Priorities.filter(option => 
                                                    option.value === PriorityId)
                                                }
                                                onChange={e => setPriorityId(e.value)}
                                            ></Select>
                                            </Col>
                                        </FormGroup>
                                    </Col> */}
                                    <Col xl={12}>
                                        <ul className="list-inline wizard mb-0">
                                            <li className="next list-inline-item float-right">
                                                <Button color="primary" type="submit" onClick={()=>handleSubmit()}>
                                                    Search
                                                </Button>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                                {totalAmount?<>
                                <Row>
                                <Col xl={12}>
                                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                        <h4>Total Settled Amount :  $ {totalAmount}</h4>
                                    </div>
                                </Col>
                                </Row>
                                <BootstrapTable
                                    {...props.baseProps}
                                    keyField="sl"
                                    bordered={false}
                                    pagination={paginationFactory({ sizePerPage: 5, sizePerPageRenderer: sizePerPageRenderer, sizePerPageList: [{ text: '5', value: 5, }, { text: '10', value: 10 }, { text: '25', value: 25 }, { text: 'All', value: loansList.length }] })}
                                    wrapperClasses="table-responsive"
                                />
                                </>:''}
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
                            { label: 'Report', path: 'report/settledAmount' },
                            { label: 'Settled Amount', path: '/', active: true },
                        ]}
                        title={'Settled Amount Report'}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TableWithColumnToggle />
                </Col>
            </Row>
            <Spinner active={loader}></Spinner>
        </>
    );
};

export default Tables;
