<script setup lang="ts">
import { nextTick, defineExpose } from "vue";
import QRCodeStyling from "./core/QRCodeStyling";
import type { GS1Options, GS1Dimensions, Options, IQrOptionsType, Gradient } from "./core/QROptions";
import type { CornerDotType, CornerSquareType, DotType, Extension } from "./types";

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

let qrCodeStyling: QRCodeStyling | undefined;
let gs1Dimensions: GS1Dimensions | null = null;

const qrOptions: Partial<Options> = {
  width: props.width,
  height: props.height,
  margin: props.margin,
  data: props.data,
  image: props.image,
  qrOptions: props.qrOptions,
  imageOptions: props.imageOptions,
  dotsOptions: props.dotsOptions,
  backgroundOptions: props.backgroundOptions,
  cornersSquareOptions: props.cornersSquareOptions,
  cornersDotOptions: props.cornersDotOptions,
  gs1Options: props.gs1Options
};

const updateQRCode = async () => {
  if (qrCodeStyling) {
    qrCodeStyling.update(qrOptions);

    if (props.gs1Options?.enabled) {
      await nextTick();
      gs1Dimensions = qrCodeStyling.getGS1Dimensions();
    }
  }
};

const onDownloadClick = () => {
  if (qrCodeStyling && props.download) {
    qrCodeStyling.download(props.downloadOptions);
  }
};

const canvas = document.getElementById("gs1-canvas") as HTMLCanvasElement | null;

if (canvas) {
  qrCodeStyling = new QRCodeStyling(qrOptions);
  qrCodeStyling.append(canvas.parentElement || undefined);

  if (props.gs1Options?.enabled) {
    await nextTick();
    gs1Dimensions = qrCodeStyling.getGS1Dimensions();
  }
}

defineExpose({
  download: onDownloadClick,
  getGS1Dimensions: () => gs1Dimensions,
  updateQRCode
});
</script>

<template>
  <div :class="myclass">
    <canvas id="gs1-canvas" :class="imgclass"></canvas>

    <div v-if="showGs1Info && gs1Dimensions" class="gs1-info" :class="gs1InfoClass">
      <h4>GS1 Compliant QR Code</h4>
      <p>Module Size: {{ gs1Options.moduleSize }}mm</p>
      <p>Physical Size: {{ gs1Dimensions.widthInMM.toFixed(2) }}mm × {{ gs1Dimensions.heightInMM.toFixed(2) }}mm</p>
      <p>Module Count: {{ gs1Dimensions.moduleCount }}</p>
      <p>Total Modules: {{ gs1Dimensions.totalModules }} (including quiet zone)</p>
      <p>Print DPI: {{ gs1Options.printDPI }}</p>
    </div>

    <button v-if="download" :class="downloadButton" @click="onDownloadClick">
      {{ buttonName }}
    </button>
  </div>
</template>

<style scoped>
.gs1-info-default {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
}

.gs1-info-default h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 14px;
}

.gs1-info-default p {
  margin: 4px 0;
  line-height: 1.4;
}
</style>
