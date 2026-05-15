import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { NavigationApi } from "../infrastructure/navigation-api.js";
import { ExperienceAssembler } from "../infrastructure/experience.assembler.js";
import { ExpeditionAssembler } from "../infrastructure/expedition.assembler.js";
import { WeatherAssembler } from "../infrastructure/weather.assembler.js";
import { CheckpointAssembler } from "../../tour-management/infrastructure/checkpoint.assembler.js";
import { Progress } from "../domain/model/progress.entity.js";
import { Expedition } from "../domain/model/expedition.entity.js";

const navigationApi = new NavigationApi();

function estimateCompletedCheckpoints(status, total) {
  if (!total) return 0;
  if (status === "finished") return total;
  if (status === "in_progress") return Math.min(1, total);
  return 0;
}

function attachCheckpoints(expedition, checkpoints) {
  return new Expedition(
    expedition.id,
    expedition.tourId,
    expedition.guideId,
    expedition.status,
    expedition.startedAt,
    expedition.finishedAt,
    checkpoints
  );
}

export const useNavigationStore = defineStore("navigation", () => {
  const currentExpedition = ref(null);
  const progress = ref(null);
  const experiences = ref([]);
  const weather = ref(null);
  const errors = ref([]);
  const expeditionLoaded = ref(false);
  const experiencesLoaded = ref(false);
  const loading = ref(false);

  const progressPercentage = computed(() => {
    if (!progress.value) return 0;
    const { totalCheckpoints, completedCheckpoints } = progress.value;
    return totalCheckpoints > 0
      ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
      : 0;
  });

  function clearErrors() {
    errors.value = [];
  }

  function pushError(error) {
    const message =
      error?.data?.message ??
      error?.statusText ??
      error?.message ??
      String(error);
    errors.value.push({ message });
  }

  async function loadCheckpointsForTourSimple(tourId) {
    const response = await navigationApi.getCheckpoints();
    const resources = Array.isArray(response.data) ? response.data : [];
    return resources
      .filter((resource) => Number(resource.tourId) === Number(tourId))
      .sort((a, b) => Number(a.order) - Number(b.order))
      .map((resource) => CheckpointAssembler.toEntityFromResource(resource));
  }

  function updateProgressFromExpedition(expedition) {
    const total = expedition.checkpoints?.length ?? 0;
    const completed = estimateCompletedCheckpoints(expedition.status, total);
    const percentage =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    progress.value = new Progress(completed, total, percentage);
  }

  async function fetchExpedition(id) {
    clearErrors();
    loading.value = true;
    try {
      const response = await navigationApi.getExpedition(id);
      let expedition = ExpeditionAssembler.toEntityFromResource(response.data);
      const checkpoints = await loadCheckpointsForTourSimple(expedition.tourId);
      expedition = attachCheckpoints(expedition, checkpoints);
      currentExpedition.value = expedition;
      updateProgressFromExpedition(expedition);
      expeditionLoaded.value = true;
      return expedition;
    } catch (error) {
      pushError(error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function ensureExpeditionLoaded(preferredId) {
    if (currentExpedition.value && expeditionLoaded.value) {
      return currentExpedition.value;
    }
    const id = preferredId ?? currentExpedition.value?.id ?? 3;
    return fetchExpedition(id);
  }

  async function fetchExperiences(expeditionId) {
    clearErrors();
    try {
      const response = await navigationApi.getExperiences();
      const all = ExperienceAssembler.toEntitiesFromResponse(response);
      const targetId = Number(expeditionId ?? currentExpedition.value?.id);
      experiences.value = all.filter(
        (item) => Number(item.expeditionId) === targetId
      );
      experiencesLoaded.value = true;
      return experiences.value;
    } catch (error) {
      pushError(error);
      throw error;
    }
  }

  function startExpedition(tourId) {
    clearErrors();
    return navigationApi
      .startExpedition(tourId)
      .then(async (response) => {
        let expedition = ExpeditionAssembler.toEntityFromResource(response.data);
        const checkpoints = await loadCheckpointsForTourSimple(
          expedition.tourId
        );
        expedition = attachCheckpoints(expedition, checkpoints);
        currentExpedition.value = expedition;
        updateProgressFromExpedition(expedition);
        expeditionLoaded.value = true;
        return currentExpedition.value;
      })
      .catch((error) => {
        pushError(error);
        throw error;
      });
  }

  function finishExpedition(id) {
    clearErrors();
    return navigationApi
      .finishExpedition(id)
      .then(async (response) => {
        let expedition = ExpeditionAssembler.toEntityFromResource(response.data);
        const checkpoints =
          currentExpedition.value?.checkpoints ??
          (await loadCheckpointsForTourSimple(expedition.tourId));
        expedition = attachCheckpoints(expedition, checkpoints);
        currentExpedition.value = expedition;
        updateProgressFromExpedition(expedition);
        return currentExpedition.value;
      })
      .catch((error) => {
        pushError(error);
        throw error;
      });
  }

  function recordExperience(experience) {
    clearErrors();
    const expeditionId = currentExpedition.value?.id;
    return navigationApi
      .createExperience({
        ...experience,
        expeditionId: expeditionId ?? experience.expeditionId
      })
      .then((response) => {
        const newExperience = ExperienceAssembler.toEntityFromResource(
          response.data
        );
        experiences.value.unshift(newExperience);
        return newExperience;
      })
      .catch((error) => {
        pushError(error);
        throw error;
      });
  }

  function fetchWeather(latitude, longitude) {
    clearErrors();
    return navigationApi
      .getWeather(latitude, longitude)
      .then((response) => {
        const records = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const match =
          records.find((w) => {
            if (w == null) return false;
            const hasCoords = w.latitude != null && w.longitude != null;
            const coordsProvided =
              typeof latitude === "number" && typeof longitude === "number";
            if (hasCoords && coordsProvided) {
              const tol = 0.01;
              return (
                Math.abs(Number(w.latitude) - latitude) <= tol &&
                Math.abs(Number(w.longitude) - longitude) <= tol
              );
            }
            return false;
          }) ?? records[0] ?? null;

        weather.value = WeatherAssembler.toEntityFromResource(match);
        return weather.value;
      })
      .catch((error) => {
        pushError(error);
        throw error;
      });
  }

  function registerCheckpoint(checkpointId) {
    console.log("Checkpoint registered:", checkpointId);
  }

  function downloadOfflineRoute(tourId) {
    console.log("Download offline route:", tourId);
  }

  return {
    currentExpedition,
    progress,
    experiences,
    weather,
    errors,
    expeditionLoaded,
    experiencesLoaded,
    loading,
    progressPercentage,
    clearErrors,
    fetchExpedition,
    ensureExpeditionLoaded,
    fetchExperiences,
    startExpedition,
    finishExpedition,
    recordExperience,
    fetchWeather,
    registerCheckpoint,
    downloadOfflineRoute
  };
});

export default useNavigationStore;
