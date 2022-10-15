import React,  { useState,useEffect } from 'react';
import { Row, Col, Card,InputGroupAddon, CardBody, Form, FormGroup, Label, Input, Button, CustomInput, Progress } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import Select from 'react-select';
import { Wizard, Steps, Step } from 'react-albus';
import MaskedInput from 'react-text-mask';
import FileUploader from '../../components/FileUploader';
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { useHistory  } from "react-router-dom";
import Spinner from '../../utils/Spinner';
import Modal from "react-bootstrap/Modal";

const Content = () => {
    const history = useHistory();
    const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);
    const [modalDetails, setModalDetails] = useState([]);
    const [FirstName,setFirstName]=useState('');
    const [LastName,setLastName]=useState('');
    const [Email,setEmail]=useState('');
    const [Phone,setPhone]=useState('');
    const [Amount,setAmount]=useState(0);
    const [PriorityId,setPriorityId]=useState(0);
    const [LoanTypeId,setLoanTypeId]=useState(0);
    const [LoanConditionId,setLoanConditionId]=useState(0);
    const [Address,setAddress]=useState('');
    const [About,setAbout]=useState('');
    const [AppDate,setAppDate]=useState('');
    const [Description,setDescription]=useState('');
    const [TimeId,setTimeId]=useState('');
    const [files,setFiles]=useState([]);

    const [LoanTypes,setLoanTypes]=useState([]);
    const [LoanConditions,setLoanConditions]=useState([]);
    const [Priorities,setPriorities]=useState([]);
    const [Times,setTimes]=useState([]);
    
    const handleSubmit=async ()=>{
        setLoader(true);
        await Axios.post('/client',{
            FirstName:FirstName,
            LastName:LastName,
            Email:Email,
            Phone:Phone,
            LoanTypeId:LoanTypeId,
            Address:Address,
            About:About,
            Description:Description,
            Date:AppDate,
            Amount:Amount,
            PriorityId:PriorityId,
            LoanConditionId:LoanConditionId,
            Status:1,
            TimeId:TimeId
          }).then(async function (response) {
            if(response.data.statusCode==201){
                const data = new FormData();
                files.forEach(element => {
                    data.append(`file`, element);
                });
                    await Axios.post("/file/upload/"+response.data.clientId+"&"+LoanTypeId, data, { 
                    })
                    .then(res => { 
                        setLoader(false);
                        history.push("/client/byLoanType/homeloan");
                    });
            }
            else{
                setModalDetails({title:"Client Create Error", body:response.data.message});
                setShow(true);
                setLoader(false);
            }
          })
          .catch(function (error) {
            setLoader(false);
        });
    };

    const handleDateChange=async(date)=>{
        setLoader(true);
        await Axios.get('/appoinment/getTimes/'+date)
        .then(function (response) {
            if(response.data){
                setAppDate(date);
                setTimes(response.data.Times);
            }else{
                setTimes('');
            }
            setLoader(false);
        })
        .catch(function (error) {
            setLoader(false);
        //   setModalDetails({header:"FetchData error response !",body:error});
        });
    };

    const LoadDD= async () => {
        setLoader(true);
        await Axios.get('/client/getdd')
        .then(function (response) {
            if(response.data){
                setLoanTypes(response.data.LoanTypesDD);
                setLoanConditions(response.data.LoanConditionsDD);
                setPriorities(response.data.PrioritiesDD);
            }else{
                setLoanTypes([]);
                setLoanConditions([]);
            }
            setLoader(false);
        })
        .catch(function (error) {
            setLoader(false);
        //   setModalDetails({header:"FetchData error response !",body:error});
        });
    };

    useEffect(() => {
        LoadDD();
      }, []);

    return (
        <Card>
            <CardBody>
                {/* <h4 className="header-title mt-0 mb-1">Wizard with Validation</h4>
                <p className="sub-header">Example of wizard with Validation</p> */}

                <Wizard
                    render={({ step, steps }) => (
                        <>
                            <Progress
                                animated
                                striped
                                color="success"
                                value={((steps.indexOf(step) + 1) / steps.length) * 100}
                                className="mb-3 progress-sm"
                            />

                            <Steps>
                                <Step
                                    id="gInfo"
                                    render={({ next }) => (
                                        <AvForm
                                            onValidSubmit={(event, values) => {
                                                next();
                                            }}>
                                            <Row>
                                                <Col xl={12}>
                                                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                        <h4 className="mt-0 mb-1">General Info</h4>
                                                    </div>
                                                </Col>
                                                <Col xl={6}>
                                                    <AvField name="firstname" label="First Name" type="text" required placeholder="Asiqur Rahman" value={FirstName} onChange={e => setFirstName(e.target.value)}/>
                                                </Col>
                                                <Col xl={6}>
                                                    <AvField name="lastname" label="Last Name" type="text" required placeholder="Khan" value={LastName} onChange={e => setLastName(e.target.value)}/>
                                                </Col>
                                                <Col xl={6}>
                                                    <AvField name="Email" label="Email" type="email" required placeholder="example@gmail.com" value={Email} onChange={e => setEmail(e.target.value)}/>
                                                </Col>
                                                <Col xl={6}>
                                                    <div className="form-group">
                                                        <label>Phone Number</label> <br />
                                                        <MaskedInput
                                                            mask={[
                                                                /[0]/,
                                                                /[4]/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                            ]}
                                                            placeholder="04________"
                                                            className="form-control"
                                                            value={Phone} onChange={e => setPhone(e.target.value)}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col xl={12}>
                                                    <AvField name="Address" label="Address" type="text" required placeholder="" value={Address} onChange={e => setAddress(e.target.value)}/>
                                                </Col>
                                                <Col xl={12}>
                                                    <label>About Client</label>
                                                    {/* <RichTextEditor className="form-control" required onEditorContentChange={(e) => { setAbout(e) }} initialContent={About} hideToolbar={true} /> */}
                                                    <Input type="textarea" rows="8" className="form-control" required onChange={(e) => { setAbout(e.target.value) }} defaultValue={About} />
                                                    <br/>
                                                </Col>
                                            </Row>
                                            <ul className="list-inline wizard mb-0">
                                                <li className="next list-inline-item float-right">
                                                    <Button color="success" type="submit">
                                                        Next
                                                    </Button>
                                                </li>
                                            </ul>
                                        </AvForm>
                                    )}
                                />
                                <Step
                                    id="loan"
                                    render={({ next, previous }) => (
                                        <AvForm
                                            onValidSubmit={(event, values) => {
                                                next()
                                            }}>
                                            <Row>
                                                <Col xl={12}>
                                                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                        <h4 className="mt-0 mb-1">Loan Info</h4>
                                                    </div>
                                                </Col>
                                                <Col xl={6}>
                                                    <div className="form-group">
                                                        <Label>Loan Type</Label>
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
                                                    </div>
                                                </Col>
                                                <Col xl={6}>
                                                    <div className="form-group">
                                                        <Label>Loan Condition</Label>
                                                        <Select
                                                            className="react-select"
                                                            classNamePrefix="react-select"
                                                            options={LoanConditions}
                                                            defaultValue = {
                                                                LoanConditions.filter(option => 
                                                                option.value === LoanConditionId)
                                                            }
                                                            onChange={e => setLoanConditionId(e.value)}
                                                        ></Select>
                                                    </div>
                                                </Col>
                                                <Col xl={6}>
                                                    <AvGroup>
                                                        <Label for="username">Amount</Label>
                                                        <div className="input-group">
                                                            <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                                            <AvInput placeholder="100000" name="Amount" required value={Amount} onChange={e => setAmount(e.target.value)}/>
                                                            <AvFeedback>Please write loan amount.</AvFeedback>
                                                        </div>
                                                    </AvGroup>
                                                </Col>
                                                <Col xl={6}>
                                                    <div className="form-group">
                                                        <Label>Priority</Label>
                                                        <Select
                                                            className="react-select"
                                                            classNamePrefix="react-select"
                                                            options={Priorities}
                                                            value={Priorities.filter(({value}) => value === PriorityId)}
                                                            onChange={e => setPriorityId(e.value)}
                                                        ></Select>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <ul className="list-inline wizard mb-0">
                                                <li className="previous list-inline-item">
                                                    <Button onClick={previous} color="info">
                                                        Previous
                                                    </Button>
                                                </li>
                                                <li className="next list-inline-item float-right">
                                                    <Button color="success" type="submit">
                                                        Next
                                                    </Button>
                                                </li>
                                            </ul>
                                        </AvForm>
                                    )}
                                />
                                <Step
                                    id="aInfo"
                                    render={({ next, previous }) => (
                                        <AvForm
                                            onValidSubmit={(event, values) => {
                                                next()
                                            }}>
                                            <Row>
                                                <Col xl={12}>
                                                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                        <h4 className="mt-0 mb-1">Appoinment Info</h4>
                                                    </div>
                                                </Col>
                                                <Col xl={6}>
                                                    <div className="form-group">
                                                        <label>Follow up Date</label> <br />
                                                        <Input type="date" min={`${new Date().toISOString().substr(0,10)}`} id="date-input" placeholder="date" onChange={(e) =>{handleDateChange(e.target.value);}} required/>
                                                    </div>
                                                </Col>
                                                <Col xl={6}>
                                                    <Label for="exampleSelect">Follow up Time From</Label>
                                                    <Select
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        options={Times}
                                                        value={Times.filter(({value}) => value === TimeId)}
                                                        onChange={e => setTimeId(e.value)}
                                                        ></Select>
                                                </Col>
                                                {/* <Col xl={6}>
                                                <div className="form-group">
                                                    <label>Follow up Time To</label> <br />
                                                    <Flatpickr value={new Date()} options={{enableTime: true, noCalendar: true, dateFormat: "H:i",time_24hr: true}}
                                                        onChange={date => { console.log(date) }}
                                                        className="form-control" />
                                                </div>
                                                </Col> */}
                                                <Col xl={12}>
                                                    <label>Required <b>DOCUMENTS</b> List</label>
                                                    <Input type="textarea" rows="8" className="form-control" required onChange={(e) => { setDescription(e.target.value) }} value={Description} />
                                                    {/* <RichTextEditor className="form-control" onEditorContentChange={(e) => { setDescription(e) }} initialContent={Description} hideToolbar={true} /> */}
                                                    <br/>
                                                </Col>
                                            </Row>
                                            <ul className="list-inline wizard mb-0">
                                                <li className="previous list-inline-item">
                                                    <Button onClick={previous} color="info">
                                                        Previous
                                                    </Button>
                                                </li>
                                                <li className="next list-inline-item float-right">
                                                    <Button color="success" type="submit">
                                                        Next
                                                    </Button>
                                                </li>
                                            </ul>
                                        </AvForm>
                                    )}
                                />
                                <Step
                                    id="dInfo"
                                    render={({ previous }) => (
                                        <AvForm
                                            onValidSubmit={(event, values) => {
                                                handleSubmit();
                                            }}>
                                            <Row>
                                                <Col xl={12}>
                                                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                        <h4 className="mt-0 mb-1">Required Documents</h4>
                                                    </div>
                                                </Col>
                                                <Col sm={12}>
                                                <CardBody>
                                                        <h4 className="header-title mt-0 mb-1">Upload Required Files</h4>
                                                        <FileUploader
                                                            onFileUpload={files => {
                                                                setFiles(files);
                                                            }}
                                                        />
                                                    </CardBody>
                                                </Col>

                                                <Col sm={12}>
                                                    <ul className="list-inline wizard mb-0">
                                                        <li className="previous list-inline-item">
                                                            <Button onClick={previous} color="info">
                                                                Previous
                                                            </Button>
                                                        </li>

                                                        <li className="next list-inline-item float-right">
                                                            <Button color="success">Create</Button>
                                                        </li>
                                                    </ul>
                                                </Col>
                                            </Row>  
                                        </AvForm>
                                    )}
                                />
                            </Steps>
                        </>
                    )}
                />
            </CardBody>
            <Modal show={show} onHide={()=>setShow(false)}>
                {/* <Modal.Header>
                <Modal.Title>{loanTypeName}</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                <Col xl={12}>
                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <h4>{modalDetails.title}</h4>
                    </div>
                </Col>
                <div xl={12} style={{width:"100%",display: 'flex',  justifyContent:'center', alignItems:'center'}} >
                    <h5>{modalDetails.body}</h5>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>setShow(false)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Spinner active={loader}></Spinner>
        </Card>
    );
};

const Create = () => {
    return (
        <>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Client', path: '/customer/index' },
                            { label: 'Register', path: '/customer/create', active: true },
                        ]}
                        title={'New Client Register'}
                    />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Content />
                </Col>
            </Row>
        </>
    );
};

export default Create;
