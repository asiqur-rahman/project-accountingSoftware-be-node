import React,{useState,useEffect} from 'react'
import { Row, Col, Card, CardBody, Button, InputGroupAddon, Label, FormGroup, CustomInput } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { useParams  } from "react-router-dom";
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { useHistory } from "react-router-dom";
import Spinner from '../../utils/Spinner';
import Modal from "react-bootstrap/Modal";
import MaskedInput from 'react-text-mask';

const Update = () => {
    const { id } = useParams();
    const history = useHistory();
    const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);
    const [modalHeader, setModalHeader] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalBtns, setModalBtns] = useState([]);

    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [cPassword,setcPassword]=useState('');
    const [firstName,setFirstname]=useState('');
    const [address,setAddress]=useState('');
    const [contact,setContact]=useState('');
    const [lastName,setLastname]=useState('');
    const [role,setRole]=useState(2);
    const [branchId,setBranchId]=useState(1);
    const [status,setStatus]=useState(1);
    const [userDetailId,setUserDetailId]=useState(0);


    useEffect( () => {
        if(id!=undefined && id!=':id'){
          Axios.get('/user/id/'+id)
            .then(function (response) {
                if(response.data){
                    const data=response.data.user;
                    setFirstname(data.UserDetailFirstName);
                    setLastname(data.UserDetailLastName);
                    setUsername(data.Username);
                    setAddress(data.UserDetailAddress);
                    setEmail(data.UserDetailEmail);
                    setContact(data.UserDetailContactNo);
                    setBranchId(data.BranchId);
                    setStatus(data.Status);
                    setRole(data.RoleId);
                    setUserDetailId(data.UserDetailId);
                }
            })
            .catch(function (error) {
                console.log(error)
            });
        }
        else{
            history.push("/user/index");
        }
    }, [id]);
      
    const handleUpdate=async ()=>{
        if(password || cPassword ){
            if(password!=cPassword){
                alert("Confirm Password must be same as password.");
            }else{
                setLoader(true);
                await Axios.patch('/user/withPass/id/'+id,{
                    Username:username,
                    FirstName:firstName,
                    LastName:lastName,
                    Address:address,
                    Password:password,
                    Email:email,
                    ContactNo:contact,
                    Status:status,
                    BranchId:branchId,
                    UserDetailId:userDetailId,
                    RoleId:role
                  }).then(function (response) {
                      console.log(response)
                    if(response.data.statusCode==200){
                        setLoader(true);
                        history.push("/user/index/active");
                    }
                    else{
                        setLoader(true);
                        setModalHeader("User Update");
                        setModalBody(response.data.message);
                        setShow(true);
                    }
                  })
                  .catch(function (error) {
                      
                  });
            }
        }
        else{
            await Axios.patch('/user/withoutPass/id/'+id,{
                Username:username,
                FirstName:firstName,
                LastName:lastName,
                Address:address,
                Email:email,
                ContactNo:contact,
                Status:status,
                BranchId:branchId,
                UserDetailId:userDetailId,
                RoleId:role
              }).then(function (response) {
                  console.log(response)
                if(response.data.statusCode==200){
                    history.push("/user/index/active");
                }
                else{
                    setLoader(true);
                    setModalHeader("User Update");
                    setModalBody(response.data.message);
                    setShow(true);
                }
              })
              .catch(function (error) {
                  
              });
        }
    };
    const options =[
        { value: 1, label: 'Admin' },
        { value: 2, label: 'Officer' }
    ];
    return (
        <>
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

            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            {/* <h4 className="header-title mt-0 mb-1">Bootstrap Validation - Normal</h4> */}
                            {/* <p className="sub-header">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p> */}
                            <AvForm onValidSubmit={() => {handleUpdate()}}>
                                <Row>
                                    <Col xl={6}>
                                        <AvField name="firstname" label="First Name" type="text" required placeholder="Asiqur Rahman" value={firstName} onChange={e => setFirstname(e.target.value)}/>
                                    </Col>
                                    <Col xl={6}>
                                        <AvField name="lastname" label="Last Name" type="text" required placeholder="Khan" value={lastName} onChange={e => setLastname(e.target.value)}/>
                                    </Col>
                                    
                                    <Col xl={6}>
                                        <AvField name="Email" label="Email" type="email" required placeholder="example@gmail.com" value={email} onChange={e => setEmail(e.target.value)}/>
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
                                                value={contact}
                                                className="form-control"
                                                onChange={e => setContact(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xl={6}>
                                        <AvField name="Address" label="Address" type="text" required placeholder="" value={address} onChange={e => setAddress(e.target.value)}/>
                                    </Col>
                                    <Col xl={6}>
                                    <AvGroup>
                                        <Label for="username">Username</Label>
                                        <div className="input-group">
                                            <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                                            <AvInput placeholder="Username" name="username" required value={username} onChange={e => setUsername(e.target.value)}/>
                                            <AvFeedback>Please choose a username.</AvFeedback>
                                        </div>
                                    </AvGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <AvField name="NewPassword" label="New Password" type="text" onChange={e => setPassword(e.target.value)}/>
                                    </Col>
                                    <Col xl={6}>
                                        <AvField name="ConfirmPassword" label="Confirm New Password" type="text" onChange={e => setcPassword(e.target.value)}/>
                                    </Col>
                                    {/* <Col xl={6}>
                                        <Label for="exampleSelect">Role</Label>
                                        <Select
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={options}
                                            defaultValue = {
                                                options.filter(option => 
                                                   option.value === role)
                                             }
                                            onChange={e => setRole(e.value)}
                                            ></Select>
                                    </Col> */}
                                
                                </Row>
                                <FormGroup>
                                    <AvInput
                                        tag={CustomInput}
                                        type="checkbox"
                                        name="customCheckbox"
                                        label="If you don't change password keep it blank"
                                        required
                                    />
                                </FormGroup>
                                <Button color="primary" type="submit">
                                    Submit
                                </Button>
                            </AvForm>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal show={show} onHide={()=>{setShow(true)}}>
                {modalHeader?
                <Modal.Header closeButton>
                <Modal.Title>{modalHeader}</Modal.Title>
                </Modal.Header>:''}
                <Modal.Body>
                    {modalBody}
                </Modal.Body>
                <Modal.Footer>
                    {modalBtns.length>0 ? modalBtns.map((f, idx) => {
                        return (
                            <Button variant="secondary" onClick={()=>{setShow(true)}}>
                                Close
                            </Button>
                        )
                    }):''}
                <Button variant="secondary" onClick={()=>{setShow(true)}}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Spinner active={loader}></Spinner>
        </>
    );
};

export default Update;
