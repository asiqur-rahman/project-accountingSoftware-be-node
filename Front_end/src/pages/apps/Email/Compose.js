import React,  { useState,useEffect } from 'react';
import { Row, Col, Card, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import PageTitle from '../../../components/PageTitle';
import RichTextEditor from '../../../components/RichTextEditor';
import Select from 'react-select';
import { Link, useHistory, useParams } from "react-router-dom";
import Axios from '../../../helpers/axiosInstance';
import Spinner from '../../../utils/Spinner';
import Modal from "react-bootstrap/Modal";

// Compose
const Compose = () => {
    const { date } = useParams();
    const history = useHistory();
    const [loader,setLoader]=useState(false);
    const [selectedEmails,setSelectedEmails]=useState([]);
    const [emailList,setEmailList]=useState([]);
    const [subject,setSubject]=useState('');
    const [mailBody,setMailBody]=useState('');
    // const [email,setEmail]=useState('info@talukdermortgage.com.au');
    const [show, setShow] = useState(false);
    const [modalDetails,setModalDetails]=useState([]);


    const handleSubmit =async ()=>{
        setLoader(true);
        if(selectedEmails){
            var freshEmails=[];
            selectedEmails.forEach(element => {
                freshEmails.push({address:element.value});
            });
        }
        await Axios.post("/sendMail",{
            // From: email,
            To: freshEmails,
            MailSubject:subject,
            MailBody:mailBody
        })
        .then(function (response) {
            setLoader(false);
            console.log(response.data.statusCode)
            if(response.data){
                if(response.data.statusCode==200){
                    setModalDetails({title:"Email Confirmation",body:"Email Send Successfully"});
                    setShow(true);
                    setSelectedEmails([]);
                    setSubject('');
                    setMailBody('');
                }
                }else{
                    setModalDetails({title:"Email Confirmation",body:"Email Not Send "+response.data.message});
                    setShow(true);
                }
        })
        .catch(function (error) {
            setLoader(false);
            setModalDetails({title:"Email Confirmation",body:"Email Not Send "+error});
            setShow(true);
        });
    };

    const GetClientsEmailDD = async () => {
        setLoader(true);
        await Axios.post("/client/clientEmailsDD")
        .then(function (response) {
            if(response.data){
                var list=response.data.ClientEmails;
                if(list.length>0){
                    setEmailList(list);
                }
                else{
                    setEmailList([]);
                }
            }else{
                setEmailList([]);
            }
            setLoader(false);
        })
        .catch(function (error) {
            setLoader(false);
        //   setModalDetails({header:"FetchData error response !",body:error});
        });
    };

    useEffect(() => {
        GetClientsEmailDD();
    }, [])

        return (
            <>
                <Row className="page-title">
                    <Col md={12}>
                        <PageTitle
                            breadCrumbItems={[
                                { label: 'Apps', path: '/apps/email/compose' },
                                { label: 'Email', path: '/apps/email/compose' },
                                { label: 'Compose', path: '/apps/email/compose', active: true },
                            ]}
                            title={'Compose Email'}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col className="col-12">
                        <div className="email-container">
                            <div className=" p-4">
                                <AvForm>
                                    {/* <Col xl={12}>
                                        <div className="form-group">
                                            <AvField type="email" name="email" label="Sending Mail" placeholder="Ex: info@talukdermortgage.com.au" required value={email} onChange={e => setEmail(e.target.value)} ></AvField>
                                        </div>
                                    </Col> */}
                                    <Col xl={12}>
                                        <div className="form-group">
                                            <p className="mb-1 mt-3 font-weight-bold">To / Bcc</p>
                                            <Select
                                                isMulti={true}
                                                options={emailList}
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                value={selectedEmails}
                                                onChange={(e)=>setSelectedEmails(e)}
                                                >
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <div className="form-group">
                                            <AvField type="text" name="subject" label="Subject" placeholder="Subject" required value={subject} onChange={e => setSubject(e.target.value)} ></AvField>
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <div className="form-group">
                                        <p className="mb-1 mt-3 font-weight-bold">Mail Body</p>
                                            <Row>
                                                <Col>
                                                    <RichTextEditor className="form-control" onEditorContentChange={(e) => { setMailBody(e) }} initialContent={''} hideToolbar={false} />
                                                </Col>
                                            </Row>
                                            <Row className="mt-3 text-right">
                                                <Col>
                                                    <Button color="primary" onClick={()=>handleSubmit()}>Send<i className='uil uil-message ml-2'></i></Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </AvForm>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Modal show={show} onHide={()=>{setShow(false)}}>
                <Modal.Body>
                {modalDetails?.title?
                    <Col xl={12}>
                        <div className="form-group" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            <h4>{modalDetails.title}</h4>
                        </div>
                    </Col>:""}
                {modalDetails?.body?
                    <div xl={12} style={{width:"100%",display: 'flex',  justifyContent:'center', alignItems:'center'}} >
                            <h5>{modalDetails.body}</h5>
                    </div>:""}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setShow(false)}}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Spinner active={loader}></Spinner>
            </>
        );
}

export default Compose;
