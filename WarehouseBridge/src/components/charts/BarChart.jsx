import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export const options = {
    plugins: {
        // title: {
        //     display: true,
        //     text: 'Bar Chart',
        // },
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
        },
        // y: {
        //     stacked: true,
        // },
    },
}

function BarChart({label = 'Default Label'}) {

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

    const data = {
        labels,
        datasets: [
            {
                label: label,
                data: [1, 2, 3, 4, 5, 6, 2, 6],
                backgroundColor: 'rgb(255, 99, 132)',
            },
            // {
            //     label: 'Dataset 2',
            //     data: 2,
            //     backgroundColor: 'rgb(75, 192, 192)',
            // },
            // {
            //     label: 'Dataset 3',
            //     data: 3,
            //     backgroundColor: 'rgb(53, 162, 235)',
            // },
        ],
    }

    return <Bar className='h-full' options={options} data={data} />
}

export default BarChart