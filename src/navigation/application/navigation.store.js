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
  const normalized = String(status ?? "").toLowerCase();
  if (normalized === "finished") return total;
  if (normalized === "in_progress" || normalized === "inprogress") return Math.min(1, total);
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
  const binnacleEntries = ref([]);
  const weather = ref(null);
  const errors = ref([]);
  const expeditionLoaded = ref(false);
  const experiencesLoaded = ref(false);
  const loading = ref(false);

  const progressPercentage = computed(() => {
    if (!progress.value) return 0;
    if (progress.value.percentage != null) return Math.round(progress.value.percentage);
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
      error?.data?.detail ??
      error?.data?.title ??
      error?.data?.message ??
      error?.statusText ??
      error?.message ??
      String(error);
    errors.value.push({ message });
  }

  async function loadCheckpointsForTour(tourId) {
    if (tourId == null) return [];
    try {
      const response = await navigationApi.getTourById(tourId);
      const tour = response.data ?? {};
      const resources = Array.isArray(tour.checkpoints) ? tour.checkpoints : [];
      return resources
        .slice()
        .sort((a, b) => Number(a.order) - Number(b.order))
        .map((resource) => CheckpointAssembler.toEntityFromResource(resource));
    } catch {
      // Platform may not embed checkpoints on TourResource yet.
      return [];
    }
  }

  function updateProgressFromExpedition(expedition, progressResource = null) {
    if (progressResource) {
      progress.value = new Progress(
        progressResource.completedCheckpoints ?? 0,
        progressResource.totalCheckpoints ?? 0,
        progressResource.percentage ?? 0
      );
      return;
    }
    const total = expedition.checkpoints?.length ?? 0;
    const completed = estimateCompletedCheckpoints(expedition.status, total);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    progress.value = new Progress(completed, total, percentage);
  }

  async function syncProgress(expedition) {
    const total = expedition.checkpoints?.length ?? 0;
    const completed = estimateCompletedCheckpoints(expedition.status, total);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    try {
      const response = await navigationApi.createProgress({
        expeditionId: expedition.id,
        completedCheckpoints: completed,
        totalCheckpoints: total,
        percentage
      });
      updateProgressFromExpedition(expedition, response.data);
    } catch {
      updateProgressFromExpedition(expedition);
    }
  }

  async function fetchExpedition(id) {
    clearErrors();
    loading.value = true;
    try {
      const response = await navigationApi.getExpedition(id);
      let expedition = ExpeditionAssembler.toEntityFromResource(response.data);
      const checkpoints = await loadCheckpointsForTour(expedition.tourId);
      expedition = attachCheckpoints(expedition, checkpoints);
      currentExpedition.value = expedition;
      await syncProgress(expedition);
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
    const id = preferredId ?? currentExpedition.value?.id;
    if (id == null) {
      const response = await navigationApi.getExpeditions();
      const list = ExpeditionAssembler.toEntitiesFromResponse(response);
      if (!list.length) return null;
      return fetchExpedition(list[0].id);
    }
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

  async function fetchBinnacle(expeditionId) {
    clearErrors();
    const id = expeditionId ?? currentExpedition.value?.id;
    if (id == null) {
      binnacleEntries.value = [];
      return [];
    }
    try {
      const response = await navigationApi.getBinnacleByExpedition(id);
      binnacleEntries.value = Array.isArray(response.data)
        ? response.data
        : [response.data].filter(Boolean);
      return binnacleEntries.value;
    } catch (error) {
      pushError(error);
      throw error;
    }
  }

  function recordBinnacle(entry) {
    clearErrors();
    const payload = {
      expeditionId: entry.expeditionId ?? currentExpedition.value?.id,
      touristId: entry.touristId,
      note: entry.note,
      mediaUrl: entry.mediaUrl,
      createdAt: entry.createdAt
    };
    return navigationApi
      .recordBinnacleReading(payload)
      .then((response) => {
        binnacleEntries.value.unshift(response.data);
        return response.data;
      })
      .catch((error) => {
        pushError(error);
        throw error;
      });
  }

  function startExpedition(tourId, {guideId = 0, expeditionName = null} = {}) {
    clearErrors();
    return navigationApi
      .startExpedition({tourId, guideId, expeditionName, status: "in_progress"})
      .then(async (response) => {
        let expedition = ExpeditionAssembler.toEntityFromResource(response.data);
        const checkpoints = await loadCheckpointsForTour(expedition.tourId);
        expedition = attachCheckpoints(expedition, checkpoints);
        currentExpedition.value = expedition;
        await syncProgress(expedition);
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
    const current = currentExpedition.value;
    return navigationApi
      .finishExpedition(id, {
        tourId: current?.tourId,
        guideId: current?.guideId,
        expeditionName: current?.expeditionName
      })
      .then(async (response) => {
        let expedition = ExpeditionAssembler.toEntityFromResource(
          response.data ?? {...current, status: "finished"}
        );
        const checkpoints =
          currentExpedition.value?.checkpoints ??
          (await loadCheckpointsForTour(expedition.tourId));
        expedition = attachCheckpoints(expedition, checkpoints);
        currentExpedition.value = expedition;
        await syncProgress(expedition);
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
    const expedition = currentExpedition.value;
    if (!expedition) return Promise.resolve();
    const total = expedition.checkpoints?.length ?? 0;
    const currentCompleted = progress.value?.completedCheckpoints ?? 0;
    const completed = Math.min(total, currentCompleted + 1);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return navigationApi
      .createProgress({
        expeditionId: expedition.id,
        completedCheckpoints: completed,
        totalCheckpoints: total,
        percentage
      })
      .then((response) => {
        updateProgressFromExpedition(expedition, response.data);
        console.log("Checkpoint registered:", checkpointId);
      })
      .catch((error) => {
        pushError(error);
        throw error;
      });
  }

  function downloadOfflineRoute(tourId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Offline route ready:", tourId);
        resolve(tourId);
      }, 1400);
    });
  }

  return {
    currentExpedition,
    progress,
    experiences,
    binnacleEntries,
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
    fetchBinnacle,
    recordBinnacle,
    startExpedition,
    finishExpedition,
    recordExperience,
    fetchWeather,
    registerCheckpoint,
    downloadOfflineRoute
  };
});

export default useNavigationStore;
