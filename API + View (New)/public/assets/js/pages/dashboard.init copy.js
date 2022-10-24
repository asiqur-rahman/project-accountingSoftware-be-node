/*
Template Name: BrainTechSolution
Author: BrainTechSolution
Website: https://braintechsolution.com/
Contact: support@BrainTechSolution.com
File: Dashboard
*/

//
// Sales Analytics Chart

var options = {
    chart: {
        height: 339,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false
        }
    },
    stroke: {
        width: [1, 1, 1],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '30%'
        }
    },
    colors: ['#5b73e8'],
    series: [{
        name: 'Sale',
        type: 'area',
        data: $("#ToTal_Sales_7").val()?$("#ToTal_Sales_7").val().split(","):[0] //[23, 11, 22, 27, 13, 22, 37]
    }],
    fill: {
        opacity: [0.33, 0.33, 0.33],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    labels: $("#ToTal_Dates_7").val().split(","),//showDate(), //['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003'],
    markers: {
        size: 0
    },

    // xaxis: {
    //     type: 'datetime'
    // },
    yaxis: {
        title: {
            text: ' Dollar',
        },
    },
    dataLabels: {
        enabled: true
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y) {
                if (typeof y !== "undefined") {
                    return "$ " + y.toFixed(0);
                }
                return y;

            }
        }
    },
    grid: {
        borderColor: '#f1f1f1'
    },
    noData: {
        text: 'Loading...'
    }
}

var chart = new ApexCharts(
    document.querySelector("#sales-analytics-chart"),
    options
);

function changeApexData(dataFor, dataShowingFor){
    $("#apextChartDataFor").html(dataShowingFor+' <i class="mdi mdi-chevron-down ms-1"></i>');
    $.getJSON('/portal-get-dashboard-apexData/'+dataFor, function(response) {
        const data= response.sales?response.sales.split(","):[0];
        chart.updateOptions({
            labels: response.dates.split(","),//['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003'],
            series: [{
                name: 'Sale',
                type: 'area',
                data: data//[23, 11, 22, 27, 13, 22, 37]
            }],
         });
      });
}

function showDate() {

    var labels = [];
    for (let index = 1; index < 8; index++) {
        const newdate = new Date(new Date().setDate(new Date().getDate() - index));
        const yyyy = newdate.getFullYear();
        let mm = newdate.getMonth() + 1; // Months start at 0!
        let dd = newdate.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        labels.push(dd + '/' + mm + '/' + yyyy);
    }
    return labels;
}

chart.render();