<script setup lang="ts">
import GS1QRCodeVue3Async from "./GS1QRCodeVue3Async.vue";
import { GS1Options } from "./core/QROptions";
import { Extension } from "./types";

export interface Props {
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
      :qrOptions="props.qrOptions"
      :imageOptions="props.imageOptions"
      :dotsOptions="props.dotsOptions"
      :backgroundOptions="props.backgroundOptions"
      :cornersSquareOptions="props.cornersSquareOptions"
      :cornersDotOptions="props.cornersDotOptions"
      :download="props.download"
      :myclass="props.myclass"
      :imgclass="props.imgclass"
      :downloadButton="props.downloadButton"
      :downloadWithIcon="props.downloadWithIcon"
      :downloadOptions="props.downloadOptions"
      :isDownloadBtnDisabled="props.isDownloadBtnDisabled"
      :buttonName="props.buttonName"
      :dataIdText="props.dataIdText"
      :gs1Options="props.gs1Options"
      :showGs1Info="props.showGs1Info"
      :gs1InfoClass="props.gs1InfoClass"
    />
  </Suspense>
</template>
