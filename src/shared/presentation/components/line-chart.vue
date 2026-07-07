<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Filler,
  Tooltip
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler, Tooltip);

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  seriesLabel: { type: String, default: "" }
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.seriesLabel,
      data: props.data,
      borderColor: "#ff7a30",
      backgroundColor: "rgba(255, 122, 48, 0.18)",
      pointBackgroundColor: "#ff7a30",
      pointBorderColor: "#0f1419",
      pointRadius: 4,
      tension: 0.35,
      fill: true
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1a2433",
      borderColor: "rgba(255, 122, 48, 0.4)",
      borderWidth: 1,
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0"
    }
  },
  scales: {
    x: {
      ticks: { color: "#94a3b8", font: { size: 11 } },
      grid: { color: "rgba(148, 163, 184, 0.08)" }
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#94a3b8", font: { size: 11 }, precision: 0 },
      grid: { color: "rgba(148, 163, 184, 0.08)" }
    }
  }
};
</script>

<template>
  <div class="line-chart" role="img" :aria-label="seriesLabel">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.line-chart {
  position: relative;
  flex: 1;
  min-height: 220px;
}
</style>
