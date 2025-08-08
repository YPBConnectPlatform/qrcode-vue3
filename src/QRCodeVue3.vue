<script lang="ts" setup>
import QRCodeVue3Async from "./QRCodeVue3Async.vue";
import { DrawType } from "./types";

export interface Props {
  type: DrawType;
  value: string;
  width: number;
  height: number;
  margin: number;
  imgclass: string;
  myclass: string;
  downloadButton: string;
  buttonName: string;
  qrOptions: any;
  imageOptions: any;
  dotsOptions: any;
  backgroundOptions: any;
  cornersSquareOptions: any;
  cornersDotOptions: any;
  fileExt: string;
  image: string;
  download: boolean;
  downloadWithIcon: boolean;
  downloadOptions: any;
  isDownloadBtnDisabled: boolean;
  previewImage: any;
  dataIdText?: string;
  gs1Mode: boolean;
  gs1Dpi: number;
  gs1XDimension: number;
  associatedGtin?: string;
  showGs1PrintGuide?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "canvas",
  value: "",
  width: 300,
  height: 300,
  margin: 0,
  imgclass: "",
  myclass: "",
  downloadButton: "",
  buttonName: "Download",
  qrOptions: {
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "Q"
  },
  imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
  dotsOptions: {
    type: "dots",
    color: "#6a1a4c",
    gradient: {
      type: "linear",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#6a1a4c" },
        { offset: 1, color: "#6a1a4c" }
      ]
    }
  },
  backgroundOptions: { color: "#ffffff" },
  cornersSquareOptions: { type: "dot", color: "#000000" },
  cornersDotOptions: { type: undefined, color: "#000000" },
  fileExt: "png",
  image: "",
  download: false,
  downloadWithIcon: false,
  downloadOptions: { name: "vqr", extension: "png" },
  isDownloadBtnDisabled: false,
  previewImage: {
    width: 300,
    height: 300
  },
  gs1Mode: false,
  gs1Dpi: 300,
  gs1XDimension: 0.396
});
</script>

<template>
  <Suspense>
    <QRCodeVue3Async
      v-bind="$attrs"
      :background-options="props.backgroundOptions"
      :button-name="props.buttonName"
      :corners-dot-options="props.cornersDotOptions"
      :corners-square-options="props.cornersSquareOptions"
      :dots-options="props.dotsOptions"
      :download="props.download"
      :download-with-icon="props.downloadWithIcon"
      :download-button="props.downloadButton"
      :download-options="props.downloadOptions"
      :file-ext="props.fileExt"
      :height="props.height"
      :image="props.image"
      :image-options="props.imageOptions"
      :imgclass="props.imgclass"
      :margin="props.margin"
      :value="props.value"
      :myclass="props.myclass"
      :gs1-mode="props.gs1Mode"
      :gs1-dpi="props.gs1Dpi"
      :gs1-x-dimension="props.gs1XDimension"
      :qr-options="props.qrOptions"
      :width="props.width"
      :is-download-btn-disabled="props.isDownloadBtnDisabled"
      :preview-image="previewImage"
      :data-id-text="dataIdText"
      :associated-gtin="associatedGtin"
      :show-gs1-print-guide="showGs1PrintGuide"
    />
  </Suspense>
</template>
