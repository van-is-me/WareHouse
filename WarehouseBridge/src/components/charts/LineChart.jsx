import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export const options = {
    responsive: true,
    plugins: {
        // legend: {
        //     position: 'top' as const,
        // }
        //   title: {
        //     display: true,
        //     text: 'Chart.js Line Chart',
        //   },
    },
}
function LineChart({ label = 'Default label' }) {

    const data = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        datasets: [
            {
                label: label,
                data: [1, 6, 42, 8, 3, 42, 15, 23, 35, 54, 45,23],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            //   {
            //     label: 'Dataset 2',
            //     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            //     borderColor: 'rgb(53, 162, 235)',
            //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
            //   },
        ],
    };
    return <Line options={options} data={data} />
}

export default LineChart