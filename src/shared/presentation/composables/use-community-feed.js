import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { NavigationApi } from "../../../navigation/infrastructure/navigation-api.js";
import { ExperienceAssembler } from "../../../navigation/infrastructure/experience.assembler.js";
import {
  STATIC_POSTS,
  TOP_TREKKERS,
  GLOBAL_STATS,
  experienceToPost
} from "../data/platform-static.js";

const navigationApi = new NavigationApi();

/**
 * Community feed: static UI with optional experiences from MockAPI.
 */
export function useCommunityFeed() {
  const { t } = useI18n();
  const posts = ref([]);
  const loading = ref(false);
  const usedApi = ref(false);

  function mapStaticPosts() {
    return STATIC_POSTS.map((post) => ({
      ...post,
      content: t(post.contentKey),
      timeLabel: post.timeCount
        ? t(post.timeKey, { count: post.timeCount })
        : t(post.timeKey),
      badge: t(post.badgeKey),
      likes: 24,
      comments: 6,
      shares: 2,
      fromApi: false
    }));
  }

  onMounted(async () => {
    loading.value = true;
    try {
      const response = await navigationApi.getExperiences();
      const experiences = ExperienceAssembler.toEntitiesFromResponse(response);
      if (experiences.length) {
        posts.value = experiences
          .slice(0, 8)
          .map((exp, index) => {
            const mapped = experienceToPost(exp, index);
            return {
              ...mapped,
              badge: t(mapped.badgeKey)
            };
          });
        usedApi.value = true;
      } else {
        posts.value = mapStaticPosts();
      }
    } catch {
      posts.value = mapStaticPosts();
    } finally {
      loading.value = false;
    }
  });

  return {
    posts,
    loading,
    usedApi,
    topTrekkers: TOP_TREKKERS,
    globalStats: GLOBAL_STATS
  };
}
