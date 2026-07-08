<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale, getLocaleMessage } = useI18n();

// Read the raw locale JSON directly instead of t()/tm()/rt(): this content is a
// plain nested structure (sections/paragraphs/list), not interpolated strings,
// so there is nothing for vue-i18n's message compiler to do here.
const terms = computed(() => getLocaleMessage(locale.value)?.legal?.terms ?? {});
</script>

<template>
  <div class="platform-page legal-page">
    <header class="platform-page-header">
      <span class="platform-eyebrow platform-eyebrow--teal">{{ terms.eyebrow }}</span>
      <h1 class="platform-page-title">{{ terms.title }}</h1>
      <p class="legal-last-updated">{{ terms["last-updated"] }}</p>
    </header>

    <p class="legal-intro">{{ terms.intro }}</p>

    <section
        v-for="(section, index) in terms.sections"
        :key="index"
        class="legal-section"
    >
      <h2>{{ section.heading }}</h2>
      <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex">
        {{ paragraph }}
      </p>
      <ul v-if="section.list">
        <li v-for="(item, iIndex) in section.list" :key="iIndex">{{ item }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.legal-page {
  padding-bottom: 48px;
}

.legal-last-updated {
  margin: 10px 0 0;
  color: #8c99aa;
  font-size: 0.72rem;
}

.legal-intro {
  color: #c3cbd7;
  font-size: 0.85rem;
  line-height: 1.7;
  max-width: 760px;
  margin: 0 0 32px;
}

.legal-section {
  max-width: 760px;
  margin-bottom: 28px;
}

.legal-section h2 {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.02rem;
  font-weight: 700;
  margin: 0 0 10px;
}

.legal-section p {
  color: #c3cbd7;
  font-size: 0.85rem;
  line-height: 1.7;
  margin: 0 0 10px;
}

.legal-section ul {
  margin: 0 0 10px;
  padding-left: 20px;
  color: #c3cbd7;
  font-size: 0.85rem;
  line-height: 1.7;
}

.legal-section li {
  margin-bottom: 6px;
}
</style>
