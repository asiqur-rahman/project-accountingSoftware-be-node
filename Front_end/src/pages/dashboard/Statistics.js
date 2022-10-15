// @flow
import React from 'react';
import { Row, Col } from 'reactstrap';

import StatisticsChartWidget from '../../components/StatisticsChartWidget';

const Statistics = ({dataset}) => {
    // console.log(dataset[0]?dataset[0].Total_Clients:0)
    return (
        <>
            <Row>
                <Col md={6} xl={4}>
                    <StatisticsChartWidget
                        description="Total Client"
                        title={dataset[0]?dataset[0].Total_Clients:0}
                        data={[0, dataset[0]?dataset[0].Total_Clients:0]}
                        colors={['#fe0beb']}
                        trend={{
                            // textClass: 'text-success',
                            // icon: 'uil uil-arrow-up',
                            // value: '10.21%'
                        }}></StatisticsChartWidget>
                </Col>

                <Col md={6} xl={4}>
                    <StatisticsChartWidget
                        description="Today Appoinment"
                        title={dataset[0]?dataset[0].Today_Appoinments:0}
                        colors={['#f77e53']}
                        data={[0, dataset[0]?dataset[0].Today_Appoinments:0]}
                        trend={{
                            // textClass: 'text-danger',
                            // icon: 'uil uil-arrow-down',
                            // value: '5.05%'
                        }}></StatisticsChartWidget>
                </Col>

                <Col md={6} xl={4}>
                    <StatisticsChartWidget
                        description="Total Mail Send"
                        title={dataset[0]?dataset[0].TotalEmail:0}
                        colors={['#43d39e']}
                        data={[0, dataset[0]?dataset[0].TotalEmail:0]}
                        trend={{
                            // textClass: 'text-success',
                            // icon: 'uil uil-arrow-up',
                            // value: '25.16%'
                        }}></StatisticsChartWidget>
                </Col>

                <Col md={6} xl={6}>
                    <StatisticsChartWidget
                        description="Last Month Settled Amount"
                        title={`$ ${dataset[0]?dataset[0].LastMonSettledAmount:0}`}
                        colors={['#43d39e']}
                        data={[0, dataset[0]?dataset[0].LastMonSettledAmount:0]}
                        trend={{
                            // textClass: 'text-success',
                            // icon: 'uil uil-arrow-up',
                            // value: '25.16%'
                        }}>
                        </StatisticsChartWidget>
                </Col>

                <Col md={6} xl={6}>
                    <StatisticsChartWidget
                        description="Current Month Settled Amount"
                        title={`$ ${dataset[0]?dataset[0].CurrMonSettledAmount:0}`}
                        colors={['#43d39e']}
                        data={[0, dataset[0]?dataset[0].CurrMonSettledAmount:0]}
                        trend={{
                            // textClass: 'text-success',
                            // icon: 'uil uil-arrow-up',
                            // value: '25.16%'
                        }}></StatisticsChartWidget>
                </Col>
                {/* <Col md={6} xl={3}>
                    <StatisticsChartWidget
                        description="Client Absent"
                        title="2"
                        colors={['#ffbe0b']}
                        data={[25,5]}
                        trend={{
                            // textClass: 'text-danger',
                            // icon: 'uil uil-arrow-down',
                            // value: '5.05%'
                        }}></StatisticsChartWidget>
                </Col> */}
            </Row>
        </>
    );
};

export default Statistics;
