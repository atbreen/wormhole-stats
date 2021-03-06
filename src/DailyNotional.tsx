import { Typography } from '@mui/material'
import axios from 'axios'
import numeral from 'numeral'
import { useEffect, useState } from 'react'
import chartXkcd from 'chart.xkcd'
import { Line } from 'chart.xkcd-react'

interface NotionalTransferredToData {
    Daily: any
    Last24Hours: any
    PeriodDurationDays: number
    WithinPeriod: any
}

function DailyNotional() {
    const [results, setResults] = useState<NotionalTransferredToData | null>(
        null
    )

    useEffect(() => {
        axios
            .get(
                'https://europe-west3-wormhole-315720.cloudfunctions.net/mainnet-notionaltransferredto?forPeriod=true&daily=true&numDays=182'
            )
            .then((response) => {
                console.log(response.data) // we have data!
                setResults(response.data) // storing endpoint data
            })
    }, []) // empty array - no dependencies, only run once on mount
    return (
        <>
            <Typography fontFamily={'xkcd'} variant="h3" gutterBottom color='rgb(248,240,227)' bgcolor='rgb(30,30,30)'>
                ${numeral(results?.WithinPeriod['*']['*']).format('0,0.00')}{' '}
                monies transferred
            </Typography>
            <Line
                config={{
                    title: 'Daily Notional Value Transferred (Last 14 Days)',
                    xLabel: 'Date',
                    yLabel: 'Dollhairs',
                    data: {
                        labels: Object.keys(results?.Daily || {})
                            .slice(-14)
                            .map((v) => {
                                const d = new Date(v)
                                return `${d.getMonth() + 1} / ${
                                    d.getDate() + 1
                                }`
                            }),
                        datasets: [
                            {
                                label: 'All Chains',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['*']['*']),
                            },
                            {
                                label: 'From Solana',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['1']['*']),
                            },
                            {
                                label: 'From Ethereum',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['2']['*']),
                            },
                            {
                                label: 'From Terra',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['3']['*']),
                            },
                            {
                                label: 'From Polygon',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['5']['*']),
                            },
                            {
                                label: 'From BSC',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['4']['*']),
                            },
                            {
                                label: 'From Avalanche',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['6']['*']),
                            },
                            {
                                label: 'From Oasis',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['7']['*']),
                            },
                            {
                                label: 'From Fantom',
                                data: Object.values(results?.Daily || {})
                                    .slice(-14)
                                    .map((v: any) => v['10']['*']),
                            },
                        ],
                    },
                    options: {
                        // optional
                        yTickCount: 3,
                        xTickCount: 100,
                        legendPosition: chartXkcd.config.positionType.upLeft,
                        dataColors: ['rgb(231, 40, 80)','rgb(245, 56, 255)','rgb(104, 105, 115)','rgb(56, 73, 255)','rgb(159, 56, 255)','rgb(255, 235, 56)','rgb(255, 56, 56)','rgb(0, 147, 245)','rgb(219, 229, 251)'],
                        strokeColor: 'rgb(248, 240, 227)',
                        backgroundColor: 'rgb(30,30,30)'
                    },
                }}
            />
        </>
    )
}

export default DailyNotional
