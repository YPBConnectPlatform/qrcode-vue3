<script setup lang="ts">
import { defineAsyncComponent, computed, useAttrs } from "vue";
import { GS1Options } from "./core/QROptions";
import { Extension } from "./types";

interface Props {
  width?: number;
  height?: number;
  margin?: number;
  data?: string;
  image?: string;
  qrOptions?: {
    typeNumber?: number;
    mode?: string;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  };
  imageOptions?: {
    hideBackgroundDots?: boolean;
    imageSize?: number;
    crossOrigin?: string;
    margin?: number;
  };
  dotsOptions?: {
    type?: string;
    color?: string;
    gradient?: any;
  };
  backgroundOptions?: {
    color?: string;
    gradient?: any;
  };
  cornersSquareOptions?: {
    type?: string;
    color?: string;
    gradient?: any;
  };
  cornersDotOptions?: {
    type?: string;
    color?: string;
    gradient?: any;
  };
  download?: boolean;
  myclass?: string;
  imgclass?: string;
  downloadButton?: string;
  downloadWithIcon?: boolean;
  downloadOptions?: {
    name?: string;
    extension?: Extension;
  };
  isDownloadBtnDisabled?: boolean;
  buttonName?: string;
  dataIdText?: string;
  gs1Options?: Partial<GS1Options>;
  showGs1Info?: boolean;
  gs1InfoClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  downloadWithIcon: false,
  isDownloadBtnDisabled: false
});

const GS1QRCodeVue3Async = defineAsyncComponent(() => import("./GS1QRCodeVue3Async.vue"));

const attrs = useAttrs();

const mergedProps = computed(() => ({
  ...attrs,
  ...props
}));
</script>

<template>
  <component :is="GS1QRCodeVue3Async" v-bind="mergedProps" />
</template>
