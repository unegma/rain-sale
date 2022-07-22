import {Bar} from "react-chartjs-2";
import React from "react";

export function TransactionsChartBuy(
  {reserveSymbol, staticReservePriceOfRedeemable}: {reserveSymbol: string, staticReservePriceOfRedeemable: string}
) {

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transactions',
          color: 'black'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cost (Matic)',
          color: 'black'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Upcoming Transaction Cost Ratios (Estimated MATIC Ratios based on costs at: 2022-05-30T15:32:44Z)',
      },
    },
  };
  const data = {
    labels: [`Tx1: Approve ${staticReservePriceOfRedeemable}${reserveSymbol} spend`, 'Tx2: Buy'],
    datasets: [
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      {
        label: '',
        data: [0.00927434, 0.00985916], // todo base it on dynamic matic costs
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }
    ],
  };

  return (
    <Bar options={options} data={data} />
  )
}
