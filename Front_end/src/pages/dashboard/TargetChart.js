import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

const TargetChart = ({dataset}) => {
    const options = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: ['Home Loan', 'Car Loan', 'Business Loan', 'Personal Loan', 'Refinance'],
            axisBorder: {
                show: true,
            },
        },
        legend: {
            show: true,
        },
        colors: ['#fe0beb', '#fb8500', '#4ce3bf', '#4F001A', '#ff000f', '#08a91c'],
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2,
            },
            borderColor: '#f3f4f7',
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return 'Total ' + val + ' Clients';
                },
            },
        },
    };

    const data = [
        {
            name: 'Processing',
            data: [dataset[0]?dataset[0].Home_P:0, dataset[0]?dataset[0].Car_P:0,dataset[0]?dataset[0].Busi_P:0, dataset[0]?dataset[0].Pers_P:0,dataset[0]?dataset[0].Refi_P:0],
        },
        {
            name: 'Not Processing',
            data: [dataset[0]?dataset[0].Home_NP:0, dataset[0]?dataset[0].Car_NP:0,dataset[0]?dataset[0].Busi_NP:0, dataset[0]?dataset[0].Pers_NP:0,dataset[0]?dataset[0].Refi_NP:0],
        },
        {
            name: 'Conditional',
            data: [dataset[0]?dataset[0].Home_C:0, dataset[0]?dataset[0].Car_C:0,dataset[0]?dataset[0].Busi_C:0, dataset[0]?dataset[0].Pers_C:0,dataset[0]?dataset[0].Refi_C:0],
        },
        {
            name: 'Approved',
            data: [dataset[0]?dataset[0].Home_A:0, dataset[0]?dataset[0].Car_A:0,dataset[0]?dataset[0].Busi_A:0, dataset[0]?dataset[0].Pers_A:0,dataset[0]?dataset[0].Refi_A:0],
        },
        {
            name: 'Declined',
            data: [dataset[0]?dataset[0].Home_D:0, dataset[0]?dataset[0].Car_D:0,dataset[0]?dataset[0].Busi_D:0, dataset[0]?dataset[0].Pers_D:0,dataset[0]?dataset[0].Refi_D:0],
        },
        {
            name: 'Settled',
            data: [dataset[0]?dataset[0].Home_S:0, dataset[0]?dataset[0].Car_S:0,dataset[0]?dataset[0].Busi_S:0, dataset[0]?dataset[0].Pers_S:0,dataset[0]?dataset[0].Refi_S:0],
        }
    ];

    return (
        <Card>
            <CardBody className="pb-0">
                <h5 className="card-title header-title">Loan type wise loan condition overview</h5>

                <Chart options={options} series={data} type="bar" className="apex-charts mt-3" height={305} />
            </CardBody>
        </Card>
    );
};

export default TargetChart;
