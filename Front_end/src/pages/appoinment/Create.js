import React,{useState,useEffect} from 'react'
import { Row, Col, Card, CardBody, Button, InputGroupAddon, Label, FormGroup, CustomInput,
     Form, Input, Progress,Media } from 'reactstrap';
import Select from 'react-select';
import { useParams  } from "react-router-dom";
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { useHistory } from "react-router-dom";
import Spinner from '../../utils/Spinner';
import Modal from "react-bootstrap/Modal";

const Update = () => {
    const history = useHistory();
    const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);
    const [modalDetails, setModalDetails] = useState([]);
    const [AppDate,setAppDate]=useState('');
    const [client,setClient]=useState([]);
    const [loans,setLoans]=useState([]);
    const [selectedClientId,setSelectedClientId]=useState(0);
    const [appoinments,setAppoinments]=useState([]);
    const [showClientPart,setShowClientPart]=useState(false);
    const [LoanTypes,setLoanTypes]=useState([]);
    const [Times,setTimes]=useState([]);
    const [Amount,setAmount]=useState(0);
    const [PriorityId,setPriorityId]=useState(0);
    const [LoanConditions,setLoanConditions]=useState([]);
    const [clients,setClients]=useState([]);
    const [Description,setDescription]=useState('');
    const [TimeId,setTimeId]=useState('');
    const [LoanTypeId,setLoanTypeId]=useState(0);
    const [LoanConditionId,setLoanConditionId]=useState(0);
    const [files,setFiles]=useState([]);
    const [Priorities,setPriorities]=useState([]);
    const [allOk,setAllOk]=useState(true);


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
        GetClients();
    }, [])

    const GetClients=async ()=>{
        await Axios.get('/client/getClientsDD')
            .then(function (response) {
                if(response.data){
                    setSelectedClientId(0);
                    setClients(response.data.Clients);
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }

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

    const GetClientDetails=async (id)=>{
        setLoader(true);
        if(id>0){
            await Axios.get('/client/details/'+id)
              .then(function (response) {
                  if(response.data){
                    setLoans(response.data.loans);
                    setClient(response.data.client);
                    setAppoinments(response.data.appoinments);
                    setShowClientPart(true);
                    LoadDD();
                  }
                  else{
                    setShowClientPart(false);
                  }
                  setLoader(false);
              })
              .catch(function (error) {
                    setLoader(false);
                    console.log(error)
            });
        }
    };

    const handleSubmit=async ()=>{
        setLoader(true);
        await Axios.post('/appoinment/forExistClient',{
            Date:AppDate,
            Description:Description,
            Status:1,
            TimeId:TimeId,
            Amount:Amount,
            PriorityId:PriorityId,
            ClientId:client.Id,
            LoanTypeId:LoanTypeId,
            LoanConditionId:LoanConditionId
          }).then(async function (response) {
            if(response.data.statusCode==201){
                if(!files.length>0){
                    history.push("/appoinment/index");
                }
            }
            else{
                setLoader(false);
            }
          })
          .catch(function (error) {
            setLoader(false);
        });

        if(files.length>0){
            const data = new FormData();
            files.forEach(element => {
                data.append(`file`, element);
            });
            await Axios.post("/file/upload/"+client.Id+"&"+LoanTypeId, data, { 
            })
            .then(res => { 
                setLoader(false);
                history.push("/appoinment/index");
            })
            .catch(function (error) {
                setLoader(false);
            });
        }
    };

    const showModal=(data)=>{
        setAllOk(false);
        setModalDetails(data);
        setShow(true);
    }

    const checkValidations=async ()=>{
        // if(LoanTypeId>0 && LoanConditionId>0 && Amount>0 && PriorityId>0 && AppDate !='' && TimeId>0){
        //     handleSubmit();
        // }
        setAllOk(true);
        if(LoanTypeId==0){
            showModal({body:"Please Select Loan Type"});
        }
        else if(LoanConditionId==0){
            showModal({body:"Please Select Loan Condition"});
        }
        else if(Amount==0){
            showModal({body:"Loan Amount can't be Zero"});
        }
        else if(PriorityId==0){
            showModal({body:"Please Select Priority"});
        }
        else if(AppDate==''){
            showModal({body:"Please Select Follow up Date"});
        }
        else if(TimeId==0){
            showModal({body:"Please Select Folow up Time"});
        }
        else if(Description==0){
            showModal({body:"Appoinment description box can't be empty"});
        }
        else if(allOk){
            handleSubmit();
        }
    };

    return (
        <>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Appoinment', path: '/user/index' },
                            { label: 'Update', path: '/user/update', active: true },
                        ]}
                        title={'Appoinment Update'}
                    />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <Col xl={12}>
                                <FormGroup row>
                                    <Label for="examplerePassword" md={3}>
                                        Select Client :
                                    </Label>
                                    <Col md={9}>
                                        <Select
                                            isMulti={false}
                                            options={clients}
                                            className="react-select"
                                            placeholder="Search by client name or email or phone "
                                            classNamePrefix="react-select"
                                            value = {
                                                clients.filter(({value}) => value === selectedClientId)
                                            }
                                            onChange={(e)=>{setSelectedClientId(e.value);GetClientDetails(e.value);}}
                                            >
                                        </Select>
                                    </Col>
                                </FormGroup>
                            </Col>
                            {showClientPart?<>
                            <Col xl={12}>
                                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                        <h4>General Info</h4>
                                    </div>
                            </Col>
                            <Form>
                                <Row>
                                <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={3}>
                                                First Name :
                                            </Label>
                                            <Col md={9}>
                                                <Input
                                                    type="text"
                                                    value={client.FirstName}
                                                    disabled
                                                    readOnly
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={3}>
                                                Last Name :
                                            </Label>
                                            <Col md={9}>
                                                <Input
                                                    type="text"
                                                    value={client.LastName}
                                                    disabled
                                                    readOnly
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={3}>
                                                Email :
                                            </Label>
                                            <Col md={9}>
                                                <Input
                                                    type="text"
                                                    value={client.Email}
                                                    disabled
                                                    readOnly
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={3}>
                                                Phone :
                                            </Label>
                                            <Col md={9}>
                                                <Input
                                                    type="text"
                                                    value={client.Phone}
                                                    disabled
                                                    readOnly
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={12}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={12} style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                Address Details
                                            </Label>
                                            <Col md={12}>
                                                <Input
                                                    type="text"
                                                    value={client.Address}
                                                    disabled
                                                    readOnly
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                            <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>Loan Details</h4>
                                </div>
                            </Col>
                            <Form>
                            {loans.length>0? loans.map((f, idx) => {
                                    return (
                                        <Row>
                                            <Col xl={5}>
                                                <FormGroup row>
                                                    <Label for="examplerePassword" md={3}>
                                                        Type :
                                                    </Label>
                                                    <Col md={9}>
                                                        <Input
                                                            type="text"
                                                            value={f["LoanType.Name"]}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xl={5}>
                                                <FormGroup row>
                                                    <Label for="examplerePassword" md={3}>
                                                        Condition : 
                                                    </Label>
                                                    <Col md={9}>
                                                        <Input
                                                            type="text"
                                                            value={f["LoanCondition.Name"]}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xl={5}>
                                                <FormGroup row>
                                                    <Label for="examplerePassword" md={3}>
                                                        Amount :
                                                    </Label>
                                                    <Col md={9}>
                                                        <Input
                                                            type="text"
                                                            value={"$ "+f.Amount}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xl={5}>
                                                <FormGroup row>
                                                    <Label for="examplerePassword" md={3}>
                                                        Priority :
                                                    </Label>
                                                    <Col md={9}>
                                                        <Input
                                                            type="text"
                                                            value={f["Priority.Name"]}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xl={2}>
                                                <FormGroup row>
                                                <ul className="list-inline wizard mb-0">
                                                    <li className="next list-inline-item float-right">
                                                        <Button className="form-group" color="info" onClick={()=>{setLoanTypeId(f.LoanTypeId); setLoanConditionId(f.LoanConditionId); setAmount(f.Amount); setPriorityId(f.PriorityId);}} >
                                                          Select for Appoinment
                                                        </Button>
                                                    </li>
                                                </ul>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    )
                                }):
                                <div className="form-group" style={{width:"100%", display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h5>No Loans data Found !</h5>
                                </div>}
                            </Form>
                            <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>New Appoinment Details</h4>
                                </div>
                            </Col>
                            <Form>
                                <Row>
                                <Col xl={6}>
                                    <FormGroup row>
                                        <Label for="examplerePassword" md={3}>
                                            Loan Type :
                                        </Label>
                                        <Col md={9}>
                                            <Select
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                options={LoanTypes}
                                                value = {
                                                    LoanTypes.filter(({value}) => value === LoanTypeId)
                                                }
                                                onChange={e => {setLoanTypeId(e.value); }}
                                            ></Select>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6}>
                                    <FormGroup row>
                                        <Label for="examplerePassword" md={3}>
                                            Loan Condition :
                                        </Label>
                                        <Col md={9}>
                                            <Select
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                options={LoanConditions}
                                                value = {
                                                    LoanConditions.filter(({value}) => value === LoanConditionId)
                                                }
                                                onChange={e => {setLoanConditionId(e.value);}}
                                            ></Select>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6}>
                                    <FormGroup row>
                                        <Label for="examplerePassword" md={3}>
                                            Amount :
                                        </Label>
                                        <Col md={9}>
                                            <Input
                                                type="number"
                                                value={Amount}
                                                onChange={e => {setAmount(e.target.value);}}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6}>
                                    <FormGroup row>
                                        <Label for="examplerePassword" md={3}>
                                            Priority :
                                        </Label>
                                        <Col md={9}>
                                        <Select
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={Priorities}
                                            value={Priorities.filter(({value}) => value === PriorityId)}
                                            onChange={e => { setPriorityId(e.value);}}
                                        ></Select>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6}>
                                    <FormGroup row>
                                        <Label for="examplerePassword" md={3}>
                                        Follow up Date :
                                        </Label>
                                        <Col md={9}>
                                            <Input type="date" min={`${new Date().toISOString().substr(0,10)}`} id="date-input" placeholder="date" onChange={(e) =>{handleDateChange(e.target.value); setTimeId(0)}} required/>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={6}>
                                    <FormGroup row>
                                        <Label for="examplerePassword" md={3}>
                                        Follow up Time:
                                        </Label>
                                        <Col md={9}>
                                            <Select
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={Times}
                                            value={Times.filter(({value}) => value === TimeId)}
                                            onChange={e => setTimeId(e.value)}
                                            ></Select>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col xl={12}>
                                    <label style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Description</label>
                                    {/* <RichTextEditor className="form-control" onEditorContentChange={() => { }} initialContent={''} hideToolbar={true} /> */}
                                    <Input type="textarea" rows="8" className="form-control" required onChange={(e) => {setDescription(e.target.value);}} value={Description} />
                                </Col>
                                </Row>
                            </Form>
                            <br/>
                            <ul className="list-inline wizard mb-0">
                                <li className="next list-inline-item float-right">
                                    <Button color="success" onClick={()=>checkValidations()}>
                                        Create Appoinment
                                    </Button>
                                </li>
                            </ul>
                            </>:''}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
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
        </>
    );
};

export default Update;
