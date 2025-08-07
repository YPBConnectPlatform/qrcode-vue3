<template>
  <div :class="myclass">
    <div :id="canvasId" :class="imgclass"></div>

    <!-- GS1 Information Display -->
    <div v-if="showGs1Info && hasGS1Info" class="gs1-info" :class="gs1InfoClass">
      <h4>GS1 Compliant QR Code</h4>
      <p>Module Size: {{ gs1Info.moduleSize }}mm</p>
      <p>Physical Size: {{ gs1Info.widthInMM.toFixed(2) }}mm × {{ gs1Info.heightInMM.toFixed(2) }}mm</p>
      <p>Module Count: {{ gs1Info.moduleCount }}</p>
      <p>Total Modules: {{ gs1Info.totalModules }} (including quiet zone)</p>
      <p>Print DPI: {{ gs1Info.printDPI }}</p>
    </div>

    <button v-if="download" :class="downloadButton" @click="onDownloadClick" :disabled="isDownloadBtnDisabled">
      <span v-if="downloadWithIcon">📥 </span>
      {{ buttonName }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QRCodeStyling from "./core/QRCodeStyling";
import { GS1Dimensions } from "./core/QROptions";

export default defineComponent({
  name: "QRCodeComponent",
  props: {
    width: { type: Number, default: 300 },
    height: { type: Number, default: 300 },
    margin: { type: Number, default: 0 },
    data: { type: String, default: "" },
    value: { type: String, default: "" },
    image: String,
    qrOptions: Object,
    imageOptions: Object,
    dotsOptions: Object,
    backgroundOptions: Object,
    cornersSquareOptions: Object,
    cornersDotOptions: Object,
    download: { type: Boolean, default: false },
    myclass: String,
    imgclass: String,
    downloadButton: String,
    downloadOptions: Object,
    buttonName: { type: String, default: "Download QR Code" },
    downloadWithIcon: { type: Boolean, default: true },
    isDownloadBtnDisabled: { type: Boolean, default: false },
    gs1Options: Object,
    showGs1Info: { type: Boolean, default: false },
    gs1InfoClass: { type: String, default: "gs1-info-default" }
  },
  data() {
    return {
      qrCode: null as QRCodeStyling | null,
      gs1Info: {} as GS1Dimensions & { moduleSize: number; printDPI: number },
      hasGS1Info: false,
      canvasId: "qr-code-canvas-" + Math.random().toString(36).substring(2, 10)
    };
  },
  mounted() {
    this.initQRCode();
  },
  methods: {
    async initQRCode() {
      const container = document.getElementById(this.canvasId);
      if (!container) return;

      const qrData = this.value || this.data;
      if (!qrData) return;

      const mergedGS1Options = {
        enabled: false,
        moduleSize: 0.396,
        printDPI: 300,
        quietZone: 4,
        enforceUppercase: true,
        enforceMinimumSize: true,
        ...this.gs1Options
      };

      const options = {
        width: this.width,
        height: this.height,
        margin: this.margin,
        data: qrData,
        image: this.image,
        qrOptions: this.qrOptions || {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "M"
        },
        imageOptions: this.imageOptions,
        dotsOptions: this.dotsOptions,
        backgroundOptions: this.backgroundOptions,
        cornersSquareOptions: this.cornersSquareOptions,
        cornersDotOptions: this.cornersDotOptions,
        gs1Options: mergedGS1Options
      };

      try {
        this.qrCode = new QRCodeStyling(options);
        this.qrCode.append(container);

        if (mergedGS1Options.enabled) {
          setTimeout(() => {
            const dims = this.qrCode?.getGS1Dimensions?.();
            if (dims) {
              this.gs1Info = {
                ...dims,
                moduleSize: mergedGS1Options.moduleSize,
                printDPI: mergedGS1Options.printDPI
              };
              this.hasGS1Info = true;
            }
          }, 50);
        }
      } catch (e) {
        console.error("QR Code init error:", e);
      }
    },
    onDownloadClick() {
      if (this.qrCode && this.download) {
        this.qrCode.download(this.downloadOptions || { name: "qr-code", extension: "png" });
      }
    }
  }
});
</script>

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
