<script setup lang="ts">
import GS1QRCodeVue3Async from "./GS1QRCodeVue3Async.vue";
import { Gradient, GS1Options, IQrOptionsType } from "./core/QROptions";
import { CornerDotType, CornerSquareType, DotType, Extension } from "./types";

export interface GS1Props {
  width?: number;
  height?: number;
  margin?: number;
  data?: string;
  image?: string;
  qrOptions?: IQrOptionsType;
  imageOptions?: {
    hideBackgroundDots?: boolean;
    imageSize?: number;
    crossOrigin?: string;
    margin?: number;
  };
  dotsOptions?: {
    type?: DotType;
    color?: string;
    gradient?: Gradient;
  };
  backgroundOptions?: {
    color?: string;
    gradient?: any;
  };
  cornersSquareOptions?: {
    type?: CornerSquareType;
    color?: string;
    gradient?: Gradient;
  };
  cornersDotOptions?: {
    type?: CornerDotType;
    color?: string;
    gradient?: Gradient;
  };
  download?: boolean;
  myclass?: string;
  imgclass?: string;
  downloadButton: string;
  downloadWithIcon: boolean;
  downloadOptions?: {
    name?: string;
    extension?: Extension;
  };
  isDownloadBtnDisabled: boolean;
  buttonName: string;
  dataIdText?: string;
  gs1Options?: Partial<GS1Options>;
  showGs1Info?: boolean;
  gs1InfoClass?: string;
}

const props = withDefaults(defineProps<GS1Props>(), {
  width: 300,
  height: 300,
  margin: 0,
  data: "",
  image: "",
  download: false,
  myclass: "",
  imgclass: "",
  downloadButton: "",
  buttonName: "Download",
  downloadOptions: () => ({ name: "qr-code", extension: "png" }),
  showGs1Info: false,
  gs1InfoClass: "gs1-info-default",
  gs1Options: () => ({
    enabled: false,
    moduleSize: 0.396,
    printDPI: 300,
    quietZone: 4,
    enforceUppercase: true,
    enforceMinimumSize: true
  })
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
