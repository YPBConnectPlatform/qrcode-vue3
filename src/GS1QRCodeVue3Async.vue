<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, ComputedRef } from "vue";
import QRCodeStyling from "./core/QRCodeStyling";
import type { Options, GS1Options, GS1Dimensions } from "./core/QROptions";
import type { Extension } from "./types";

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
  downloadButton: string;
  downloadWithIcon?: boolean;
  downloadOptions?: {
    name?: string;
    extension?: Extension;
  };
  isDownloadBtnDisabled?: boolean;
  buttonName: string;
  dataIdText?: string;
  // GS1-specific
  gs1Options?: Partial<GS1Options>;
  showGs1Info?: boolean;
  gs1InfoClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
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

const canvas = ref<HTMLCanvasElement>();
const qrCodeStyling = ref<QRCodeStyling>();
const gs1Dimensions = ref<GS1Dimensions | null>(null);

const qrOptions = computed(() => ({
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
})) as ComputedRef<Partial<Options>>;

const updateQRCode = async () => {
  if (qrCodeStyling.value) {
    qrCodeStyling.value.update(qrOptions.value);

    if (props.gs1Options?.enabled) {
      await nextTick();
      gs1Dimensions.value = qrCodeStyling.value.getGS1Dimensions();
    }
  }
};

const onDownloadClick = () => {
  if (qrCodeStyling.value && props.download) {
    qrCodeStyling.value.download(props.downloadOptions);
  }
};

onMounted(async () => {
  if (canvas.value) {
    qrCodeStyling.value = new QRCodeStyling(qrOptions.value);
    qrCodeStyling.value.append(canvas.value.parentElement || undefined);

    if (props.gs1Options?.enabled) {
      await nextTick();
      gs1Dimensions.value = qrCodeStyling.value.getGS1Dimensions();
    }
  }
});

watch(() => qrOptions.value, updateQRCode, { deep: true });

defineExpose({
  download: onDownloadClick,
  getGS1Dimensions: () => gs1Dimensions.value,
  updateQRCode
});
</script>

<template>
  <div :class="myclass">
    <canvas ref="canvas" :class="imgclass"></canvas>

    <div v-if="showGs1Info && gs1Dimensions" class="gs1-info" :class="gs1InfoClass">
      <h4>GS1 Compliant QR Code</h4>
      <p>Module Size: {{ gs1Options.moduleSize }}mm</p>
      <p>Physical Size: {{ gs1Dimensions.widthInMM.toFixed(2) }}mm × {{ gs1Dimensions.heightInMM.toFixed(2) }}mm</p>
      <p>Module Count: {{ gs1Dimensions.moduleCount }}</p>
      <p>Total Modules: {{ gs1Dimensions.totalModules }} (including quiet zone)</p>
      <p>Print DPI: {{ gs1Options.printDPI }}</p>
    </div>

    <button v-if="download" :class="downloadButton" @click="onDownloadClick">Download QR Code</button>
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
