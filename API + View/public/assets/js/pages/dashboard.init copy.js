/*
Template Name: BrainTechSolution
Author: BrainTechSolution
Website: https://braintechsolution.com/
Contact: support@BrainTechSolution.com
File: Dashboard
*/


//
// Total Revenue Chart
//
var options1 = {
    series: [{
        data: [25, 66, 41, 89, 63, 25, 44]
    }],
    fill: {
        colors: ['#5b73e8']
    },
    chart: {
        type: 'bar',
        width: 70,
        height: 40,
        sparkline: {
            enabled: true
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    labels: [1, 2, 3, 4, 5, 6, 7],
    xaxis: {
        crosshairs: {
            width: 1
        },
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};

var chart1 = new ApexCharts(document.querySelector("#total-revenue-chart"), options1);
chart1.render();

//
// Orders Chart
//
var options = {
    fill: {
        colors: ['#34c38f']
    },
    series: [70],
    chart: {
        type: 'radialBar',
        width: 45,
        height: 45,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: false
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#orders-chart"), options);
chart.render();


// 
// Customers Chart
//

var options = {
    fill: {
        colors: ['#5b73e8']
    },
    series: [55],
    chart: {
        type: 'radialBar',
        width: 45,
        height: 45,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: false
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#customers-chart"), options);
chart.render();


// 
// Growth Chart
//
var options2 = {
    series: [{
        data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
    }],
    fill: {
        colors: ['#f1b44c']
    },
    chart: {
        type: 'bar',
        width: 70,
        height: 40,
        sparkline: {
            enabled: true
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    xaxis: {
        crosshairs: {
            width: 1
        },
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};

var chart2 = new ApexCharts(document.querySelector("#growth-chart"), options2);
chart2.render();


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
    colors: ['#C70039', '#229D18', '#2535FF'],
    series: [{
        name: 'Cash',
        type: 'area',
        data: $("#ToTal_Cash_7").val().split(",") //[23, 11, 22, 27, 13, 22, 37]
    }, {
        name: 'Cheque',
        type: 'area',
        data: $("#ToTal_Cheque_7").val().split(",") //[23, 11, 22, 27, 13, 22, 37]
    }, {
        name: 'Card',
        type: 'area',
        data: $("#ToTal_Card_7").val().split(",") //[23, 11, 22, 27, 13, 22, 37]
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
        chart.updateOptions({
            labels: response.dates.split(","),//['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003'],
            series: [{
                name: 'Cash',
                type: 'area',
                data: response.cashes.split(",")//[23, 11, 22, 27, 13, 22, 37]
            },{
                name: 'Cheque',
                type: 'area',
                data: response.cheques.split(",")//[23, 11, 22, 27, 13, 22, 37]
            },{
                name: 'Card',
                type: 'area',
                data: response.cards.split(",")//[23, 11, 22, 27, 13, 22, 37]
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