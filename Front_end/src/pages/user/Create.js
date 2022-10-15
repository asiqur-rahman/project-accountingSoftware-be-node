import React,{useState,useEffect} from 'react'
import { Row, Col, Card, CardBody, Button, InputGroupAddon, Label, FormGroup, CustomInput } from 'reactstrap';
import Select from 'react-select';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { useHistory  } from "react-router-dom";
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import MaskedInput from 'react-text-mask';
import Password from 'antd/lib/input/Password';

const Update = () => {
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [firstName,setFirstname]=useState('');
    const [address,setAddress]=useState('');
    const [contact,setContact]=useState('');
    const [lastName,setLastname]=useState('');
    const [role,setRole]=useState(3);
    const [branchId,setBranchId]=useState(1);
    const [status,setStatus]=useState(1);
    const history = useHistory();
      
    const options =[
        // { value: 2, label: 'Admin' },
        { value: 3, label: 'Officer' }
    ];

    const handleSubmit=async ()=>{
        await Axios.post('/user',{
            Username:username,
            FirstName:firstName,
            LastName:lastName,
            Email:email,
            Password:password,
            ContactNo:contact,
            Address:address,
            Status:status,
            BranchId:branchId,
            RoleId:role
          }).then(function (response) {
              console.log(response)
            if(response.data.statusCode==201){
                history.push("/user/index/active");
            }
            else{
              
            }
          })
          .catch(function (error) {
              
          });
    };
    return (
        <>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'User', path: '/user/index' },
                            { label: 'Update', path: '/user/update', active: true },
                        ]}
                        title={'Create User'}
                    />
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            {/* <h4 className="header-title mt-0 mb-1">Bootstrap Validation - Normal</h4> */}
                            {/* <p className="sub-header">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p> */}
                            <AvForm onValidSubmit={() => {handleSubmit()}}>
                                <Row>
                                    <Col xl={6}>
                                        <AvField name="firstname" label="First Name" type="text" required placeholder="Ex: Asiqur Rahman" onChange={e => setFirstname(e.target.value)}/>
                                    </Col>
                                    <Col xl={6}>
                                        <AvField name="lastname" label="Last Name" type="text" required placeholder="Ex: Khan" onChange={e => setLastname(e.target.value)}/>
                                    </Col>
                                    
                                    <Col xl={6}>
                                    <AvField name="Email" label="Email" type="email" required placeholder="Ex: example@gmail.com" value={email} onChange={e => setEmail(e.target.value)}/>
                                    </Col>
                                    <Col xl={6}>
                                        <Label for="exampleSelect">Role</Label>
                                        <Select
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={options}
                                            value={options.filter(({value}) => value === role)}
                                            onChange={e => setRole(e.value)}
                                            ></Select>
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
                                                placeholder="Ex: 04________"
                                                required
                                                className="form-control"
                                                onChange={e => setContact(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xl={6}>
                                        <AvField name="Address" label="Address" type="text" required onChange={e => setAddress(e.target.value)}/>
                                    </Col>
                                    <Col xl={6}>
                                        <AvGroup>
                                            <Label for="username">Username</Label>
                                            <div className="input-group">
                                                <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                                                <AvInput placeholder="Ex: asiq" name="username" required value={username} onChange={e => setUsername(e.target.value)}/>
                                                <AvFeedback>Please choose a username.</AvFeedback>
                                            </div>
                                        </AvGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <AvGroup>
                                            <Label for="username">Password</Label>
                                            <div className="input-group">
                                                <InputGroupAddon addonType="prepend">#</InputGroupAddon>
                                                <AvInput placeholder="Ex: Password" name="username" required value={password} onChange={e => setPassword(e.target.value)}/>
                                                <AvFeedback>Please choose a username.</AvFeedback>
                                            </div>
                                        </AvGroup>
                                    </Col>
                                    {/* <Col xl={6}>
                                        <AvField name="Password" label="Password" type="text" required onChange={e => setPassword(e.target.value)}/>
                                    </Col> */}
                                </Row>
                                <FormGroup>
                                    <AvInput
                                        tag={CustomInput}
                                        type="checkbox"
                                        name="customCheckbox"
                                        label="I am sure about the user password."
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
        </>
    );
};

export default Update;
