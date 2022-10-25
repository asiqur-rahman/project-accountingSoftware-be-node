
//   spline_area

var options = {
    chart: {
        height: 315,
        type: 'area',
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 3,
    },
    series: [{
        name: 'Income',
        data: [34, 40, 28, 52, 42, 109, 100]
    }],
    colors: ['#5b73e8', '#f1b44c'],
    xaxis: {
        type: 'date',
        categories: ["22-09-19", "22-09-19", "22-09-19", "22-09-19", "22-09-19", "22-09-19", "22-09-19"],                
    },
    grid: {
        borderColor: '#f1f1f1',
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy'
        },
    }
}

var chart = new ApexCharts(
    document.querySelector("#spline_area"),
    options
);

chart.render();

// Donut chart

var options = {
  chart: {
      height: 350,
      type: 'donut',
  }, 
  series: [0],
  labels: ["Expense"],
//   colors: ["#34c38f", "#5b73e8","#f1b44c", "#50a5f1", "#f46a6a"],
  legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      floating: false,
      fontSize: '14px',
      offsetX: 0
  },
  responsive: [{
      breakpoint: 600,
      options: {
          chart: {
              height: 240
          },
          legend: {
              show: false
          },
      }
  }]

}

var chart = new ApexCharts(
  document.querySelector("#donut_chart"),
  options
);
function changeApexData(dataFor, dataShowingFor){
    // $("#apextChartDataFor").html(dataShowingFor+' <i class="mdi mdi-chevron-down ms-1"></i>');
    $.getJSON('/portal/dashboardEAR', function(response) {
        chart.updateOptions({
            labels: response.key,//['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003'],
            series: response.value//[23, 11, 22, 27, 13, 22, 37],
         });
      });
}

function changeDashboardEar(){
    // $("#apextChartDataFor").html(dataShowingFor+' <i class="mdi mdi-chevron-down ms-1"></i>');
    $.getJSON('/portal/dashboardEAR', function(response) {
        chart.updateOptions({
            labels: response.key,//['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003'],
            series: response.value//[23, 11, 22, 27, 13, 22, 37],
         });
      });
}

chart.render();