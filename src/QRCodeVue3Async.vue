<script lang="ts" setup>
//import { computed, reactive, ref, watch } from "vue";
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
  }
});

const qrCode = new QRCodeStyling({
  data: props.value,
  width: props.width,
  height: props.height,
  margin: props.margin,
  qrOptions: props.qrOptions,
  imageOptions: props.imageOptions,
  dotsOptions: props.dotsOptions,
  backgroundOptions: props.backgroundOptions,
  image: props.image,
  cornersSquareOptions: props.cornersSquareOptions,
  cornersDotOptions: props.cornersDotOptions
});

let imageUrl: string = await qrCode.getImageUrl(props.fileExt);

function onDownloadClick() {
  qrCode.download(props.downloadOptions);
}

defineExpose({ onDownloadClick });
</script>

<template>
  <div>
    <div v-if="imageUrl" :class="myclass">
      <img
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
        <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span
        ><span class="v-btn__prepend"
          ><i
            class="mdi-download mdi v-icon notranslate v-theme--light v-icon--size-default"
            aria-hidden="true"
          ></i></span
        ><span class="v-btn__content" data-no-activator=""
          ><!--v-if--><span>{{ buttonName }}</span></span
        ><span class="v-btn__append"></span
        ><!---->
      </button>
    </div>
    <slot name="custom" />
  </div>
</template>
