<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useCommunityFeed } from "../composables/use-community-feed.js";

const { t } = useI18n();
const { posts, loading, topTrekkers, globalStats } = useCommunityFeed();

const draft = ref("");
</script>

<template>
  <div class="platform-page">
    <header class="platform-page-header platform-page-header--community">
      <span class="platform-eyebrow">{{ t("platform.community.eyebrow") }}</span>
      <h1 class="platform-page-title">{{ t("platform.community.title") }}</h1>
    </header>

    <div class="community-layout">
      <div class="community-main">
        <article class="community-compose">
          <div class="community-avatar">MG</div>
          <div class="community-compose-body">
            <textarea
                v-model="draft"
                class="community-textarea"
                :placeholder="t('platform.community.compose-placeholder')"
                rows="3"
            />
            <div class="community-compose-actions">
              <button type="button" class="community-chip">📷 {{ t("platform.community.photo") }}</button>
              <button type="button" class="community-chip">🗺 {{ t("platform.community.route") }}</button>
              <pv-button
                  :label="t('platform.community.post')"
                  class="platform-primary-button"
                  :disabled="!draft.trim()"
              />
            </div>
          </div>
        </article>

        <h2 class="community-section-label">{{ t("platform.community.recent") }}</h2>

        <p v-if="loading" class="platform-muted">{{ t("platform.loading") }}</p>

        <article
            v-for="post in posts"
            :key="post.id"
            class="community-post"
        >
          <div class="community-post-header">
            <div class="community-post-author">
              <span class="community-avatar community-avatar--sm">{{ post.initials }}</span>
              <div>
                <strong>{{ post.author }}</strong>
                <small>{{ post.timeLabel }}</small>
              </div>
            </div>
            <span class="community-badge" :class="post.badgeClass">{{ post.badge }}</span>
          </div>
          <p class="community-post-content">{{ post.content }}</p>
          <div class="community-post-footer">
            <span>❤️ {{ post.likes }}</span>
            <span>💬 {{ post.comments }}</span>
            <span>↗ {{ post.shares }}</span>
          </div>
        </article>
      </div>

      <aside class="community-sidebar">
        <section class="community-widget">
          <h3>{{ t("platform.community.top-trekkers") }}</h3>
          <ul class="community-rank-list">
            <li v-for="trekker in topTrekkers" :key="trekker.rank">
              <span class="community-rank">{{ trekker.rank }}</span>
              <span class="community-avatar community-avatar--sm">{{ trekker.initials }}</span>
              <div class="community-rank-info">
                <strong>{{ trekker.name }}</strong>
                <small>{{ t(trekker.statsKey) }}</small>
              </div>
              <span class="community-rank-badge">{{ t(trekker.badgeKey) }}</span>
            </li>
          </ul>
        </section>

        <section class="community-widget">
          <h3>{{ t("platform.community.global-title") }}</h3>
          <div
              v-for="item in globalStats"
              :key="item.labelKey"
              class="community-stat-row"
          >
            <div class="community-stat-label">
              <span>{{ t(item.labelKey) }}</span>
              <strong>{{ item.value }}</strong>
            </div>
            <div class="community-stat-bar">
              <div class="community-stat-fill" :style="{ width: item.percent + '%' }" />
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>
