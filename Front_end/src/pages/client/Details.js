import React,{useState,useEffect} from 'react'
import { Row, Col, Card, CardBody, Button, Label, FormGroup,
     Form, Input,Media } from 'reactstrap';
import { useParams  } from "react-router-dom";
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { useHistory } from "react-router-dom";
import Spinner from '../../utils/Spinner';
import Modal from "react-bootstrap/Modal";

// var attachments= [
//     { id: 1, name: 'Hyper-admin-design.zip', size: '2.3MB', ext: '.zip' },
//     { id: 2, name: 'Dashboard-design.jpg', size: '0.3MB', ext: '.jpg' },
//     { id: 3, name: 'Admin-bug-report.mp4', size: '4.1MB', ext: '.mp4' },
// ];
const Update = () => {
    const { id } = useParams();
    const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false)};
    const handleShow = () => {setShow(true)};
    const history = useHistory();
    const [client,setClient]=useState([]);
    const [loans,setLoans]=useState([]);
    const [appoinments,setAppoinments]=useState([]);
    const [attachments,setAttachments]=useState([]);
    const [loanTypeName,setLoanTypeName]=useState('');

    const seeLoanFiles=async (clientId,loanTypeId,loanTypeName)=>{
        setLoanTypeName(loanTypeName+" Documents");
        await Axios.get('/file/getLoanFiles/'+clientId+"&"+loanTypeId)
                .then(function (response) {
                    if(response.data && response.data.results){
                        setAttachments(response.data.results);
                        handleShow();
                        // setAttachments();
                    }else{
                        handleShow();
                    }
                })
                .catch(function (error) {
                    console.log(error)
              });
    };

    const GetClientdata=async ()=>{
        if(id!=undefined && id!=':id'){
            setLoader(true);
            await Axios.get('/client/details/'+id)
              .then(function (response) {
                setLoader(false);
                if(response.data){
                setLoans(response.data.loans);
                setClient(response.data.client);
                setAppoinments(response.data.appoinments);
                }else{
                history.push("/client/ByLoanType/HomeLoan");
                }
              })
              .catch(function (error) {
                setLoader(false);
                console.log(error)
              });
          }
          else{
              history.push("/client/ByLoanType/HomeLoan");
          }
    }

    useEffect( () => {
        GetClientdata();
    }, [id]);

    return (
        <>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'User', path: '/user/index' },
                            { label: 'Details', path: '/user/details/'+id, active: true },
                        ]}
                        title={'Client Informations'}
                    />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
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
                                    <Col xl={12}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={12} style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                About Client
                                            </Label>
                                            <Col md={12}>
                                                <Input type="textarea" readOnly className="form-control" rows="6" required value={client.About} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                            <br/>
                            <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>Loan Details</h4>
                                </div>
                            </Col>
                            <Form>
                                {loans.map((f, idx) => {
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
                                                            value={f.Amount}
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
                                                        <Button className="form-group" color="info" onClick={()=>seeLoanFiles(f.ClientId,f.LoanTypeId,f["LoanType.Name"])} >
                                                         <i className="uil-download-alt font-size-12" style={{color:"#ffffff",cursor:"pointer"}}></i> See All Files
                                                        </Button>
                                                    </li>
                                                </ul>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Form>
                            <br/>
                            {/* <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>Appoinments Details</h4>
                                </div>
                            </Col>
                            <Form>
                                {appoinments.map((f, idx) => {
                                    return (
                                        <Row>
                                            <Col xl={4}>
                                                <FormGroup row>
                                                    <Label for="examplerePassword" md={3}>
                                                        Loan :
                                                    </Label>
                                                    <Col md={9}>
                                                        <Input
                                                            type="text"
                                                            value={f['Loan.LoanType.Name']}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xl={4}>
                                                <FormGroup row>
                                                    <Label for="examplerePassword" md={3}>
                                                        Date :
                                                    </Label>
                                                    <Col md={9}>
                                                        <Input
                                                            type="text"
                                                            value={new Date(f.Date).toISOString().substring(0,10)}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xl={4}>
                                                <FormGroup row>
                                                    <Label for="examplerePassword" md={3}>
                                                        Time :
                                                    </Label>
                                                    <Col md={9}>
                                                        <Input
                                                            type="text"
                                                            value={f['FollowUpTime.Time.Time']}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Form> */}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                {/* <Modal.Header>
                <Modal.Title>{loanTypeName}</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                <Col xl={12}>
                    <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <h4>{loanTypeName}</h4>
                    </div>
                </Col>
                <Form>
                    <Row>
                        {attachments.length>0 ? attachments.map((f, idx) => {
                            return (
                                <Col xl={12} md={6} key={idx}>
                                    <Card className="p-2 border rounded mb-2">
                                        <Media>
                                            <div className="avatar-sm font-weight-bold mr-3">
                                                <span className="avatar-title rounded bg-soft-primary text-primary">
                                                    <i className="uil-file-plus-alt font-size-18"></i>
                                                </span>
                                            </div>
                                            <Media body>
                                                <a onClick={()=>window.open('https://'+f.link)} download className="d-inline-block mt-2 text-muted font-weight-bold">{f.name.length>20?f.name.substring(0,10)+"...."+f.name.substring(f.name.length-5,f.name.length):f.name}</a>
                                            </Media>
                                            <div className="float-right mt-2">
                                                <a onClick={()=>window.open('https://'+f.link)} className="p-2"><i className="uil-download-alt font-size-18" style={{color:"#6c757d",cursor:"pointer"}}></i></a>
                                            </div>
                                            <div className="float-right mt-2">
                                                <a onClick={()=>window.open('https://'+f.link)} className="p-2"><i className="uil-archive font-size-18" style={{color:"#E32828",cursor:"pointer"}}></i></a>
                                            </div>
                                        </Media>
                                    </Card>
                                </Col>
                            )
                        }):<>
                        <div xl={12} style={{width:"100%",display: 'flex',  justifyContent:'center', alignItems:'center'}} >
                            <h5>No File Found !</h5>
                        </div>
                        </>}
                    </Row>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Spinner active={loader}></Spinner>
        </>
    );
};

export default Update;
