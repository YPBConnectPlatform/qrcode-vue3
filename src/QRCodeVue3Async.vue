<script lang="ts" setup>
import { ref, computed } from "vue";
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
  gs1XDimension: 0.396,
  associatedGtin: "",
  showGs1PrintGuide: false
});

// Add reactive variables for GS1 calculations
const moduleCount = ref(29);
const totalModules = ref(37);

let qrCodeOptions;
if (props.gs1Mode) {
  // GS1 fixed settings
  const X_DIM_MM = props.gs1XDimension || 0.396;
  const DPI = props.gs1Dpi || 300;
  const MM_TO_INCH = 1 / 25.4;

  // GS1 data handling: support both traditional GTIN and GS1 Digital Link URLs
  let data = (props.value || "").replace(/[()]/g, "").toUpperCase();

  // Check if it's a URL (contains http/https)
  const isUrl = /^https?:\/\//i.test(props.value);

  // Check for GS1 Digital Link format (URLs containing /01/GTIN pattern)
  const isGs1DigitalLink = /^https?:\/\//i.test(props.value) && /\/01\/\d{12,14}/.test(props.value);

  if (isGs1DigitalLink) {
    // Valid GS1 Digital Link
    data = props.value;
    console.log("GS1 Digital Link detected:", data);
  } else if (isUrl) {
    // URL but not GS1 Digital Link format
    console.warn(
      "GS1 QR: URL must contain /01/GTIN pattern for GS1 Digital Link. Example: https://s.cqr.to/01/01234567890123/21/HXjvPu"
    );
    data = "";
  } else {
    // Validate traditional GS1 GTIN format for non-URL data
    const gtinMatch = data.match(/^01(\d{12,14})/);
    if (!gtinMatch) {
      console.warn(
        "GS1 QR: Data must be a valid GS1 Digital Link URL or start with (01) and contain a valid 12-14 digit GTIN. Examples: https://s.cqr.to/01/01234567890123/21/HXjvPu or (01)12345678901231"
      );
      data = ""; // Prevent QR code generation
    }
  }

  try {
    if (data) {
      const tempQR = new QRCodeStyling({
        data,
        qrOptions: {
          typeNumber: 0, // Auto-detect version instead of forcing version 3
          mode: isUrl ? "Byte" : "Alphanumeric", // Use Byte for URLs, Alphanumeric for GTIN
          errorCorrectionLevel: "M"
        }
      });
      if (tempQR._qr && typeof tempQR._qr.getModuleCount === "function") {
        moduleCount.value = tempQR._qr.getModuleCount();
      }
    }
  } catch (e) {
    console.warn("GS1 tempQR error", e);
  }
  const quietZoneModules = 4; // 4 modules each side
  totalModules.value = moduleCount.value + 2 * quietZoneModules;
  const xDimPx = X_DIM_MM * MM_TO_INCH * DPI;
  let sizePx = Math.round(totalModules.value * xDimPx);
  let marginPx = quietZoneModules * xDimPx;
  // Fallback to safe values if calculation fails
  if (!sizePx || isNaN(sizePx) || sizePx < 40) sizePx = 200;
  if (!marginPx || isNaN(marginPx) || marginPx < 0) marginPx = 20;
  qrCodeOptions = {
    data,
    width: sizePx,
    height: sizePx,
    margin: marginPx,
    qrOptions: {
      typeNumber: 0, // Auto-detect version instead of forcing version 3
      mode: isUrl ? "Byte" : "Alphanumeric", // Use Byte for URLs, Alphanumeric for GTIN
      errorCorrectionLevel: "M"
    },
    // GS1: no image, no custom styling
    image: "",
    imageOptions: { hideBackgroundDots: true, imageSize: 0, margin: 0 },
    dotsOptions: { type: "square", color: "#000" },
    backgroundOptions: { color: "#fff" },
    cornersSquareOptions: { type: "square", color: "#000" },
    cornersDotOptions: { type: undefined, color: "#000" }
  };
} else {
  qrCodeOptions = {
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
  };
}
const qrCode = new QRCodeStyling(qrCodeOptions);

let imageUrl = await qrCode.getImageUrl(props.fileExt);

function onDownloadClick() {
  qrCode.download(props.downloadOptions);
}

defineExpose({ onDownloadClick });
</script>

<template>
  <div>
    <div v-if="imageUrl" :class="myclass">
      <div :style="{ position: 'relative', display: 'inline-block' }">
        <img
          id="qrImgEl"
          :src="imageUrl"
          :class="imgclass"
          :width="previewImage.width"
          :height="previewImage.height"
          crossorigin="anonymous"
          alt="QR Code"
        />
        <!-- Associated GTIN display inside QR code boundary -->
        <div
          v-if="gs1Mode && associatedGtin"
          class="gs1-associated-gtin"
          :style="{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '10px',
            fontWeight: 'normal',
            textAlign: 'center',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: '2px 6px',
            borderRadius: '2px',
            lineHeight: '1.2',
            letterSpacing: '0.5px',
            border: '1px solid #cccccc'
          }"
        >
          {{ associatedGtin }}
        </div>
      </div>

      <!-- GS1 Digital Link Print Guide -->
      <div
        v-if="gs1Mode && showGs1PrintGuide"
        class="gs1-print-guide"
        :style="{
          backgroundColor: '#fffacd',
          border: '1px solid #e6e6b8',
          borderRadius: '4px',
          padding: '12px',
          marginTop: '12px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          lineHeight: '1.4',
          color: '#333333'
        }"
      >
        <div :style="{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }">GS1 Digital Link Print Guide</div>
        <div :style="{ marginBottom: '4px' }">
          <strong>QR size:</strong> {{ moduleCount }}x{{ moduleCount }} cells (with 4 margin each side =
          {{ totalModules }}x{{ totalModules }} total cells)
        </div>
        <div :style="{ marginBottom: '4px' }">
          <strong>Minimum print size:</strong> {{ (totalModules * 0.396).toFixed(2) }} mm
        </div>
        <div :style="{ marginBottom: '4px' }">
          <strong>Target print size:</strong> {{ (totalModules * 0.495).toFixed(2) }} mm
        </div>
        <div :style="{ marginBottom: '4px' }">
          <strong>Maximum print size:</strong> {{ (totalModules * 0.99).toFixed(2) }} mm
        </div>
      </div>
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
  </div>
</template>
