import React,  { useState,useEffect } from 'react';
import { Row, Col, Card,InputGroupAddon, CardBody, Form, FormGroup, Label, Input, Button, CustomInput, Progress } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import Select from 'react-select';
import { Wizard, Steps, Step } from 'react-albus';
import MaskedInput from 'react-text-mask';
import RichTextEditor from '../../components/RichTextEditor';
import FileUploader from '../../components/FileUploader';
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { useHistory,useParams  } from "react-router-dom";
import Spinner from '../../utils/Spinner';
import Modal from "react-bootstrap/Modal";

const Content = () => {
    const { id } = useParams();
    const history = useHistory();
    const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);
    const [modalDetails, setModalDetails] = useState([]);
    const [FirstName,setFirstName]=useState('');
    const [LastName,setLastName]=useState('');
    const [Email,setEmail]=useState('');
    const [Phone,setPhone]=useState('');
    const [Amount,setAmount]=useState('');
    const [PrePriorityId,setPrePriorityId]=useState(0);
    const [PriorityId,setPriorityId]=useState(0);
    const [LoanId,setLoanId]=useState(0);
    const [LoanTypeId,setLoanTypeId]=useState(0);
    const [PreLoanConditionId,setPreLoanConditionId]=useState(0);
    const [LoanConditionId,setLoanConditionId]=useState(0);
    const [LoanConditionName,setLoanConditionName]=useState('');
    const [PriorityName,setPriorityName]=useState('');
    const [LoanTypeName,setLoanTypeName]=useState('');
    const [Address,setAddress]=useState('');
    const [About,setAbout]=useState('');
    // const [AppDate,setAppDate]=useState(new Date().toISOString().substr(0,10));
    const [AppDate,setAppDate]=useState('');
    const [IsRegistered,setIsRegistered]=useState(0);
    const [TimeId,setTimeId]=useState('');
    const [Files,setFiles]=useState([]);

    const [LoanTypes,setLoanTypes]=useState([]);
    const [Priorities,setPriorities]=useState([]);
    const [LoanConditions,setLoanConditions]=useState([]);
    const [Times,setTimes]=useState([]);
    
    const handleSubmit=async ()=>{
        setLoader(true);
        await Axios.patch('/client/id/'+id,{
            FirstName:FirstName,
            LastName:LastName,
            Email:Email,
            Phone:Phone,
            Address:Address,
            About:About,
            Amount:Amount,
            LoanTypeId:LoanTypeId,
            PreLoanConditionId:PreLoanConditionId,
            LoanConditionId:LoanConditionId,
            PrePriorityId:PrePriorityId,
            PriorityId:PriorityId
          }).then(function (response) {
            if(response.data.statusCode==200){
                history.push("/dashboard");
            }
            else{
              alert("Client Update Failed !");
            }
            setLoader(false);
          })
          .catch(function (error) {
            alert("Error : "+error);
            setLoader(false);
          });
    };

    const GetClientdata=async ()=>{
        if(id!=undefined && id!=':id'){
            setLoader(true);
            await Axios.get('/client/id/'+id)
              .then(function (response) {
                  if(response.data.client && response.data.loan){
                    setFirstName(response.data.client.FirstName);
                    setLastName(response.data.client.LastName);
                    setEmail(response.data.client.Email);
                    setPhone(response.data.client.Phone);
                    setAddress(response.data.client.Address);
                    setAbout(response.data.client.About);
                    // setLoanId(response.data.loan.Id);
                    setLoanTypeId(response.data.loan.LoanTypeId);
                    setPreLoanConditionId(response.data.loan.LoanConditionId);
                    setLoanConditionName(response.data.loan.LoanConditionName);
                    setLoanTypeName(response.data.loan.LoanTypeName);
                    setAmount(response.data.loan.Amount);
                    setPrePriorityId(response.data.loan.PriorityId);
                    setPriorityName(response.data.loan.PriorityName);
                  }
                  else{
                    history.push("/dashboard");
                  }
                  setLoader(false);
              })
              .catch(function (error) {
                  history.push("/dashboard");
              });
          }
          else{
              history.push("/dashboard");
          }
    }

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
        (async () => {
            await Promise.all([GetClientdata(),LoadDD()]);
        })();
      }, []);

    return (
        <Card>
            <CardBody>
                {/* <h4 className="header-title mt-0 mb-1">Wizard with Validation</h4>
                <p className="sub-header">Example of wizard with Validation</p> */}
                <AvForm
                    onValidSubmit={(event, values) => {
                        handleSubmit()
                    }}>
                    <Row>
                        <Col xl={12}>
                            <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                <h4 className="mb-1">General Info</h4>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <AvField name="firstname" label="First Name" type="text" required placeholder="" value={FirstName} onChange={e => setFirstName(e.target.value)}/>
                        </Col>
                        <Col xl={6}>
                            <AvField name="lastname" label="Last Name" type="text" required placeholder="" value={LastName} onChange={e => setLastName(e.target.value)}/>
                        </Col>
                        <Col xl={6}>
                            <AvField name="Email" label="Email" type="email" required placeholder="" value={Email} onChange={e => setEmail(e.target.value)}/>
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
                                    placeholder="__________"
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
                            <Input type="textarea" rows="8" className="form-control" required onChange={(e) => { setAbout(e.target.value) }} value={About} />
                            <br/>
                        </Col>
                        
                        <Col xl={12}>
                            <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                <h4 className="mt-5 mb-1">Loan Info</h4>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <Label>Loan Type</Label>
                            <Input disabled readOnly name="loanTypeName" label="Loan Type" type="text" required placeholder="" value={LoanTypeName} />
                        </Col>
                        <Col xl={4}>
                            <Label>Loan Condition (<b>Current</b>)</Label>
                            <Input disabled readOnly name="loanTypeName" label="Loan Condition" type="text" required placeholder="" value={LoanConditionName} />
                        </Col>
                        <Col xl={4}>
                            <div className="form-group">
                                <Label>Loan Condition (<b>Update</b>)</Label>
                                <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={LoanConditions.filter(option=>option.value != PreLoanConditionId)}
                                    // defaultValue = {
                                    //     LoanConditions.filter(option => 
                                    //     option.value == 2)
                                    // }
                                    onChange={e => setLoanConditionId(e.value)}
                                ></Select>
                            </div>
                        </Col>
                        
                        <Col xl={4}>
                            <Label>Amount </Label>
                            <Input name="loanTypeName" label="Loan Condition" type="text" required placeholder="" value={Amount} />
                        </Col>
                        <Col xl={4}>
                            <Label>Priority (<b>Current</b>)</Label>
                            <Input disabled readOnly label="Priority" type="text" required placeholder="" value={PriorityName} />
                        </Col>
                        <Col xl={4}>
                            <div className="form-group">
                                <Label>Priority (<b>Update</b>)</Label>
                                <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={Priorities.filter(priority=>priority.value != PrePriorityId)}
                                    // value={Priorities.filter(({value}) => value === PriorityId)}
                                    onChange={e => setPriorityId(e.value)}
                                ></Select>
                            </div>
                        </Col>
                    </Row>
                    <ul className="list-inline wizard mb-0">
                        <li className="next list-inline-item float-right">
                            <Button color="success" type="submit">
                                Update
                            </Button>
                        </li>
                    </ul>
                </AvForm>           
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
                        title={'Update Loan Condition & Client Informations'}
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
