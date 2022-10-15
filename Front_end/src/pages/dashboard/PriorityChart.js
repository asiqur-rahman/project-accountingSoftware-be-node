import React,  { useState,useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

const PriorityChart = ({dataset,series}) => {
    const options = {
        chart: {
            // height: 302,
            type: 'donut',
            toolbar: {
                show: false,
            },
            parentHeightOffset: 0,
        },
        colors: ["#26AA1B", "#DB1F1F", "#E0E307"],
        grid: {
            borderColor: '#f1f3fa',
            padding: {
                left: 0,
                right: 0,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                },
                expandOnClick: false
            }
        },
        legend: {
            show: true,
            position: 'right',
            horizontalAlign: 'left',
            itemMargin: {
                horizontal: 6,
                vertical: 3
            }
        },
        labels: ['Green', 'Red', 'Yellow'],
        responsive: [{
            breakpoint: 480,
            options: {
                
                legend: {
                    position: 'bottom'
                }
            }
        }],
        tooltip: {
            y: {
                formatter: function(value) { return value + " client/s"}
            },
        }
    };

    const data = [dataset[0]?dataset[0].Priority_G:0, dataset[0]?dataset[0].Priority_R:0, dataset[0]?dataset[0].Priority_Y:0];
    
    return (
        <Card>
            <CardBody className="">
                <h5 className="card-title mt-0 mb-0 header-title">Priority Based Loan</h5>

                <Chart
                    options={options}
                    series={series}//{data}
                    type="donut"
                    className="apex-charts mb-0 mt-4"
                    height={380}
                />
            </CardBody>
                {/* <ReactApexChart options={options} series={state.series} type="donut"/> */}
        </Card>
        
    );
};

export default PriorityChart;
