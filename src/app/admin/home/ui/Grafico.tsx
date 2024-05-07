'use client'
import { CanvasRenderer } from 'echarts/renderers'
import { init, getInstanceByDom, use } from 'echarts/core'
import { ScatterChart, LineChart, BarChart } from 'echarts/charts'

import {
  LegendComponent,
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  TitleComponent,
  DataZoomComponent,
} from 'echarts/components'
import type { ECharts, ComposeOption } from 'echarts/core'
import type {
  BarSeriesOption,
  LineSeriesOption,
  ScatterSeriesOption,
} from 'echarts/charts'
import type {
  TitleComponentOption,
  GridComponentOption,
} from 'echarts/components'
import { useRef, useEffect } from 'react'

use([
  LegendComponent,
  ScatterChart,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
])

export type EChartsOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | ScatterSeriesOption
>
const colors = ['#8A9481', '#A686C4']

function generateNormalDistribution(
  mean: number,
  standardDeviation: number,
  size: number
) {
  const normalArray = []
  for (let i = 0; i < size; i += 2) {
    let u1 = 0,
      u2 = 0
    while (u1 === 0) u1 = Math.random()
    while (u2 === 0) u2 = Math.random()

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2 * Math.PI * u2)

    const x0 = z0 * standardDeviation + mean
    const x1 = z1 * standardDeviation + mean

    normalArray.push(x0.toFixed(1))
    normalArray.push(x1.toFixed(1))
  }
  return normalArray
}

export const Grafico = (): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null)

  const option: EChartsOption = {
    color: colors,
    xAxis: [
      {
        show: false,
        type: 'category',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[1],
          },
        },
        data: [
          '2016-1',
          '2016-2',
          '2016-3',
          '2016-4',
          '2016-5',
          '2016-6',
          '2016-7',
          '2016-8',
          '2016-9',
          '2016-10',
          '2016-11',
          '2016-12',
        ],
      },
      {
        show: false,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[0],
          },
        },
        data: [
          '2015-1',
          '2015-2',
          '2015-3',
          '2015-4',
          '2015-5',
          '2015-6',
          '2015-7',
          '2015-8',
          '2015-9',
          '2015-10',
          '2015-11',
          '2015-12',
        ],
      },
    ],
    yAxis: [
      {
        show: false,
        type: 'value',
      },
    ],
    series: [
      {
        type: 'line',
        xAxisIndex: 1,
        smooth: true,
        emphasis: {
          focus: 'series',
        },
        data: generateNormalDistribution(50, 20.0, 12),
      },
      {
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series',
        },
        data: generateNormalDistribution(50, 20.0, 12),
      },
    ],
  }

  useEffect(() => {
    let chart: ECharts | undefined
    if (chartRef.current !== null) {
      chart = init(chartRef.current)
      const charts = getInstanceByDom(chartRef.current)
      charts?.setOption(option)
    }
    function resizeChart() {
      chart?.resize()
    }
    window.addEventListener('resize', resizeChart)
    return () => {
      chart?.dispose()
      window.removeEventListener('resize', resizeChart)
    }
  }, [option])

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
}

export default Grafico
