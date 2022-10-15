import React,  { useState,useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Statistics from './Statistics';
import TargetChart from './TargetChart';
import PriorityChart from './PriorityChart';
import AppoinmentToday from './AppoinmentToday';
import Axios from '../../helpers/axiosInstance';
import Spinner from '../../utils/Spinner';


const Dashboard = () =>{
    const [loader,setLoader]=useState(false);
    const [Data,setData]=useState([]);
    const [Clients,setClients]=useState([]);
    const [series,setSeries]=useState([]);

    const DashboardData= async () => {
        setLoader(true);
        await Axios.get('/dashboard')
        .then(function (response) {
            if(response.data && response.data.results){
                setData(response.data.results);
                setSeries([response.data.results[0]?response.data.results[0].Priority_G:0, response.data.results[0]?response.data.results[0].Priority_R:0, response.data.results[0]?response.data.results[0].Priority_Y:0])
            }else{
                setData([]);
            }
            setLoader(false);
        })
        .catch(function (error) {
            setLoader(false);
        //   setModalDetails({header:"FetchData error response !",body:error});
        });
    };

    const Last5Clients= async () => {
        setLoader(true);
        await Axios.get('/client/last5clients')
        .then(function (response) {
            if(response.data){
                setClients(response.data.clients);
            }else{
                setClients([]);
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
            await Promise.all([DashboardData(),Last5Clients()]);
        })();
      }, []);

    return (
        <>
        {Data?.length>0 && series?.length>0?
            <div>
                <Row className="page-title align-items-center">
                    {/* <Col sm={4} xl={6}>
                        <h4 className="mb-1 mt-0">Dashboard</h4>
                    </Col> */}
                    <Col xl={12}>
                        <Statistics dataset={Data}/>
                    </Col>
                    <Col xl={7}>
                        <TargetChart dataset={Data}/>
                    </Col>
                    <Col xl={5}>
                        <PriorityChart dataset={Data} series={series}/>
                    </Col>
                </Row>
                
                {Clients?.length>0?<AppoinmentToday dataset={Clients}/>:''}
            </div>
            :''}
            <Spinner active={loader}></Spinner>
        </>
    )
}


export default Dashboard;