<script setup lang="ts">
import GS1QRCodeVue3Async, { GS1Props } from "./GS1QRCodeVue3Async.vue";

const props = withDefaults(defineProps<GS1Props>(), {
  downloadWithIcon: false,
  isDownloadBtnDisabled: false
});

defineOptions({
  inheritAttrs: false
});
</script>

<template>
  <Suspense>
    <GS1QRCodeVue3Async
      v-bind="$attrs"
      :width="props.width"
      :height="props.height"
      :margin="props.margin"
      :data="props.data"
      :image="props.image"
      :qr-options="props.qrOptions"
      :image-options="props.imageOptions"
      :dots-options="props.dotsOptions"
      :background-options="props.backgroundOptions"
      :corners-square-options="props.cornersSquareOptions"
      :corners-dot-options="props.cornersDotOptions"
      :download="props.download"
      :myclass="props.myclass"
      :imgclass="props.imgclass"
      :download-button="props.downloadButton"
      :download-with-icon="props.downloadWithIcon"
      :download-options="props.downloadOptions"
      :is-download-btn-disabled="props.isDownloadBtnDisabled"
      :button-name="props.buttonName"
      :data-id-text="props.dataIdText"
      :gs1-options="props.gs1Options"
      :show-gs1-info="props.showGs1Info"
      :gs1-info-class="props.gs1InfoClass"
    />
  </Suspense>
</template>
