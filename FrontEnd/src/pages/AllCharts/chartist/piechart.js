import React from "react"
import ChartistGraph from "react-chartist"

const piechart = () => {
  const pieChartData = {
    series: [5, 3, 4],
    labels: ["42%", "25%", "33%"]
  }
  const pieChartOptions = {
    showLabel: true
  }

  return (
    <>
      <ChartistGraph
        data={pieChartData}
        options={pieChartOptions}
        style={{ height: "300px" }}
        type={"Pie"}
      />
    </>
  )
}
export default piechart
