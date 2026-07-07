<script setup>
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, DoughnutController, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend);

const DEFAULT_PALETTE = ["#ff7a30", "#14b8a6", "#f26a3d", "#94a3b8", "#ffb07a", "#6ee7a0"];

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  colors: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: "" }
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.labels.map(
        (_, index) => props.colors[index] ?? DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
      ),
      borderColor: "#121a26",
      borderWidth: 2
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#cbd5e1", font: { size: 11 }, boxWidth: 10, padding: 12 }
    },
    tooltip: {
      backgroundColor: "#1a2433",
      borderColor: "rgba(255, 122, 48, 0.4)",
      borderWidth: 1,
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0"
    }
  }
};
</script>

<template>
  <div class="donut-chart" role="img" :aria-label="ariaLabel">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.donut-chart {
  position: relative;
  flex: 1;
  min-height: 220px;
}
</style>
