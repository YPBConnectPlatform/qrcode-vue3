<script lang="ts" setup>
import QRCodeStyling from "./core/QRCodeStyling";
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
  isGs1QR?: boolean;
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
  isGs1QR: false
});

const DPI = 300;
const targetMm = 0.495;
const pxPerModule = Math.round((targetMm * DPI) / 25.4); // ≈6 px
const version = 3;
const moduleCount = 4 * version + 17;
const quietZoneModules = 4;
const quietZonePx = pxPerModule * quietZoneModules;
const canvasSize = moduleCount * pxPerModule + 2 * quietZonePx;

const qrCode = new QRCodeStyling({
  width: props.isGs1QR ? canvasSize : props.width,
  height: props.isGs1QR ? canvasSize : props.height,
  data: props.value,
  margin: props.isGs1QR ? quietZonePx : props.margin,
  qrOptions: props.isGs1QR
    ? {
        typeNumber: version,
        errorCorrectionLevel: "M"
      }
    : props.qrOptions,
  imageOptions: props.imageOptions,
  dotsOptions: props.dotsOptions,
  backgroundOptions: props.backgroundOptions,
  image: props.image,
  cornersSquareOptions: props.cornersSquareOptions,
  cornersDotOptions: props.cornersDotOptions
});

let imageUrl = await qrCode.getImageUrl(props.fileExt);

function onDownloadClick() {
  qrCode.download(props.downloadOptions);
}

defineExpose({ onDownloadClick });
</script>

<template>
  <div>
    <div v-if="imageUrl" :class="myclass">
      <img
        id="qrImgEl"
        :src="imageUrl"
        :class="imgclass"
        :width="previewImage.width"
        :height="previewImage.height"
        crossorigin="anonymous"
        alt="QR Code"
      />
    </div>
    <div v-if="imageUrl && download" class="text-center">
      <button @click.prevent="onDownloadClick" :class="downloadButton" :data-id="dataIdText">
        {{ buttonName }}
      </button>
    </div>
    <div v-if="imageUrl && downloadWithIcon" class="text-center">
      <button
        type="button"
        class="v-btn v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-flat rounded text-capitalize"
        @click.prevent="onDownloadClick"
        :class="downloadButton"
        :disabled="isDownloadBtnDisabled"
        :data-id="dataIdText"
      >
        <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span>
        <span class="v-btn__prepend">
          <i class="mdi-download mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>
        </span>
        <span class="v-btn__content" data-no-activator>
          <span>{{ buttonName }}</span>
        </span>
        <span class="v-btn__append"></span>
      </button>
    </div>
  </div>
</template>
