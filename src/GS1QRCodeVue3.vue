<script setup lang="ts">
import GS1QRCodeVue3Async from "./GS1QRCodeVue3Async.vue";
import { GS1Options } from "./core/QROptions";
import { Extension } from "./types";

defineProps<{
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
}>();

defineOptions({
  inheritAttrs: false
});
</script>

<template>
  <Suspense>
    <GS1QRCodeVue3Async
      :width="width"
      :height="height"
      :margin="margin"
      :data="data"
      :image="image"
      :qrOptions="qrOptions"
      :imageOptions="imageOptions"
      :dotsOptions="dotsOptions"
      :backgroundOptions="backgroundOptions"
      :cornersSquareOptions="cornersSquareOptions"
      :cornersDotOptions="cornersDotOptions"
      :download="download"
      :myclass="myclass"
      :imgclass="imgclass"
      :downloadButton="downloadButton"
      :downloadWithIcon="downloadWithIcon"
      :downloadOptions="downloadOptions"
      :isDownloadBtnDisabled="isDownloadBtnDisabled"
      :buttonName="buttonName"
      :dataIdText="dataIdText"
      :gs1Options="gs1Options"
      :showGs1Info="showGs1Info"
      :gs1InfoClass="gs1InfoClass"
      v-bind="$attrs"
    />
  </Suspense>
</template>
