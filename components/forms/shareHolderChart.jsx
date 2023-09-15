import { useState, useEffect } from "react";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Chart as ChartJS,
  ArcElement,
  RadialLinearScale,
  Legend,
  LineController,
  BarController,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Title,
} from "chart.js";
import { Pie, Line, Chart } from "react-chartjs-2";
import _ from "lodash";
import { defaults } from "chart.js";
defaults.font.family = "iransans";

ChartJS.register(
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  Filler,
  LineElement,
  LineController,
  BarController
);
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const card = (data, option, title) => (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {`${title} ${data.labels ? "" : "(دیتا وارد نشده است)"}`}
      </Typography>
      <div className="flex justify-center">
        <Pie data={data} options={option} />
      </div>
    </CardContent>
    {/* <CardActions>
            <Button size="small"></Button>
        </CardActions> */}
  </React.Fragment>
);
export const stockChartData = {
  labels: [],
  type: "pointLabel",
  datasets: [
    {
      label: " درصد",
      data: [],
      backgroundColor: [
        "#8b6eff",
        "#63aaff",
        "#fbc16d",
        "#f77570",
        "#6effac",
        "#f66bc8",
        "#bebebe",
      ],
      borderColor: [
        "#8b6eff",
        "#63aaff",
        "#fbc16d",
        "#f77570",
        "#6effac",
        "#f66bc8",
        "#bebebe",
      ],
      borderWidth: 0,
    },
  ],
};

export const stockChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
      },
    },
    datalabels: {
      display: true,
      color: "white",
    },
  },
};

export default function InputBox(props) {
  const { names, percents, title } = props;
  const [chartData, setChartData] = useState();

  useEffect(() => {
    var stockBufData = _.cloneDeep(stockChartData);
    stockBufData.labels = props.names;
    stockBufData.datasets[0].data = props.percents;
    setChartData(stockBufData);
  }, []);

  return (
    <Box>
      {chartData ? (
        <Card variant="outlined">
          {card(chartData, stockChartOptions, props.title)}
        </Card>
      ) : null}
    </Box>
  );
}
