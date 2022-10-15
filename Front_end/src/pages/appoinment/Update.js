import React,{useState,useEffect} from 'react'
import { Row, Col, Card, CardBody, Button,  Label, FormGroup, Form, Input, Media } from 'reactstrap';
import FileUploader from '../../components/FileUploader';
import Select from 'react-select';
import { useParams  } from "react-router-dom";
import PageTitle from '../../components/PageTitle';
import Axios from '../../helpers/axiosInstance';
import { useHistory } from "react-router-dom";

const Update = () => {
    const { id } = useParams();
    const [loader,setLoader]=useState(false);
    const history = useHistory();
    const [attachments,setAttachments]=useState([]);
    const [client,setClient]=useState([]);
    const [loan,setLoan]=useState([]);
    const [appoinments,setAppoinments]=useState([]);
    const [AppDate,setAppDate]=useState('');
    const [Times,setTimes]=useState([]);
    const [Description,setDescription]=useState('');
    const [TimeId,setTimeId]=useState('');
    const [files,setFiles]=useState([]);


    useEffect( () => {
        (async () => {
            if(id!=undefined && id!=':id'){
                await Axios.get('/client/clientWithAppoinmentById/'+id)
                .then(function (response) {
                    if(response.data && !response.data.statusCode){
                        setLoan(response.data.loan);
                        setClient(response.data.client);
                        setAppoinments(response.data.appoinments);
                    }else{
                        history.push('/dashboard');
                    }
                })
                .catch(function (error) {
                    console.log(error)
                });

                await Axios.get('/file/getLoanFiles/'+id)
                .then(function (response) {
                    if(response.data){
                        if(response.data.statusCode==200){
                            setAttachments(response.data.results);
                        }else{
                            setAttachments([]);
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error)
                });
            }
            else{
                history.push("/client/index");
            }
        })();
    }, [id]);
      
    
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

    const handleSubmit=async ()=>{
        setLoader(true);
        await Axios.post('/appoinment',{
            Date:AppDate,
            Description:Description,
            Status:1,
            TimeId:TimeId,
            LoanId:loan.Id
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
            await Axios.post("/file/upload/"+client.Id+"&"+loan.LoanTypeId, data, { 
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
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>Client General Info</h4>
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
                                    </Col><Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={3}>
                                                Loan Type :
                                            </Label>
                                            <Col md={9}>
                                                <Input
                                                    type="text"
                                                    value={loan.LoanTypeName}
                                                    disabled
                                                    readOnly
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <FormGroup row>
                                            <Label for="examplerePassword" md={3}>
                                                Loan Condition : 
                                            </Label>
                                            <Col md={9}>
                                                <Input
                                                    type="text"
                                                    value={loan.LoanConditionName}
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
                                </Row>
                            </Form>
                            <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>Today Appoinment Details</h4>
                                </div>
                            </Col>
                            <Form>
                                <Row>
                                    <Col xl={12}>
                                        <label style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Description</label>
                                        {/* <RichTextEditor className="form-control" onEditorContentChange={() => { }} initialContent={''} hideToolbar={true} /> */}
                                        <Input readOnly type="textarea" rows="8" className="form-control" required value={appoinments.Description} />
                                    </Col>
                                </Row>
                            </Form>
                            <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>Next Appoinment Details</h4>
                                </div>
                            </Col>
                            <Form>
                                <Row>
                                    <Col xl={6}>
                                        <div className="form-group">
                                            <label>Follow up Date</label> <br />
                                            <Input type="date" id="date-input" placeholder="date" onChange={(e) =>{handleDateChange(e.target.value);}} required/>
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
                                    <Col xl={12}>
                                        <label style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Description</label>
                                        {/* <RichTextEditor className="form-control" onEditorContentChange={() => { }} initialContent={''} hideToolbar={true} /> */}
                                        <Input type="textarea" rows="8" className="form-control" required onChange={(e) => { setDescription(e.target.value) }} value={Description} />
                                    </Col>
                                </Row>
                            </Form>
                            <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>File Upload</h4>
                                </div>
                            </Col>
                            <Form>
                                <Col xl={12}>
                                    <FileUploader
                                        accept="image/png, image/gif"
                                        minSize={0}
                                        maxSize={5242880}
                                        onFileUpload={files => {
                                            setFiles(files);
                                        }}
                                    />
                                </Col>
                            </Form>
                            <Col xl={12}>
                                <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                    <h4>Previous Uploaded Files</h4>
                                </div>
                            </Col>
                            <Form>
                                <Row>
                                    {attachments.length>0?attachments.map((f, idx) => {
                                        console.log(f.link)
                                        return (
                                            <Col xl={4} md={6} key={idx}>
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
                                                        {/* <div className="float-right mt-1">
                                                            <a href={'https://'+f.link} download target="_blank" className="p-2"><i className="uil-download-alt font-size-18"></i></a>
                                                        </div> */}
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
                                    }):
                                    <div className="form-group" style={{width:"100%", display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                        <h5>No Documents found !</h5>
                                    </div>}
                                </Row>
                            </Form>
                            
                            <ul className="list-inline wizard mb-0">
                                <li className="next list-inline-item float-right">
                                    <Button color="success" onClick={()=>handleSubmit()}>
                                        Update
                                    </Button>
                                </li>
                            </ul>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Update;
