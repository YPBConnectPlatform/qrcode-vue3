import { CornerSquareType, DotType, DownloadOptions } from "@/types";
import QRCodeStyling from "./QRCodeStyling";
import { GS1ConfigOptions, RequiredOptions } from "./QROptions";
import downloadURI from "../tools/downloadURI";
import QRSVG from "./QRSVG";

export async function gs1Config(
  options: GS1ConfigOptions
): Promise<{ qrCodeOptions: RequiredOptions; totalModules: number; moduleCount: number }> {
  const {
    value = "",
    associatedGtin,
    gs1XDimension = 0.4,
    gs1Dpi = 600,
    gs1TextHeightMm,
    width: customWidth,
    height: customHeight,
    margin: customMargin
  } = options;

  let moduleCount = 25; // Default fallback
  let totalModules = 0;

  // GS1 data handling: support both traditional GTIN and GS1 Digital Link URLs
  let data = value.replace(/[()]/g, "").toUpperCase();

  const isUrl = /^https?:\/\//i.test(value);
  const isGs1DigitalLink = /^https?:\/\//i.test(value) && /\/01\/\d{12,14}/.test(value);

  if (isGs1DigitalLink) {
    data = value;
    console.log("GS1 Digital Link detected:", data);
  } else if (isUrl) {
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
      data = "";
    }
  }

  // Calculate module count for proper sizing
  try {
    if (data) {
      const tempQR = new QRCodeStyling({
        data,
        qrOptions: {
          typeNumber: 0,
          mode: isUrl ? "Byte" : "Alphanumeric",
          errorCorrectionLevel: "M"
        }
      });
      if (tempQR._qr && typeof tempQR._qr.getModuleCount === "function") {
        moduleCount = tempQR._qr.getModuleCount();
      }
    }
  } catch (e) {
    console.warn("GS1 tempQR error", e);
  }

  // GS1 REQUIREMENT: 4 modules quiet zone on each side
  const quietZoneModules = 4;
  totalModules = moduleCount + 2 * quietZoneModules;

  const MM_TO_INCH = 1 / 25.4;
  const xDimPx = gs1XDimension * MM_TO_INCH * gs1Dpi;

  let sizePx = Math.round(totalModules * xDimPx);
  let marginPx = quietZoneModules * xDimPx;

  // Add extra space for HRI if associatedGtin is provided
  let heightPx = sizePx;
  if (associatedGtin && gs1TextHeightMm) {
    const textHeightPx = Math.round((gs1TextHeightMm / 25.4) * gs1Dpi);
    heightPx += textHeightPx + 8; // Small buffer for text
  }

  // Fallback to safe values if calculation fails
  if (!sizePx || isNaN(sizePx) || sizePx < 40) sizePx = 200;
  if (!marginPx || isNaN(marginPx) || marginPx < 0) marginPx = 20;
  if (!heightPx || isNaN(heightPx) || heightPx < sizePx) heightPx = sizePx;

  // Use custom dimensions if provided, otherwise use calculated GS1 dimensions
  const finalWidth = customWidth || sizePx;
  const finalHeight = customHeight || (associatedGtin ? heightPx : sizePx);
  const finalMargin = customMargin !== undefined ? customMargin : marginPx;

  const qrCodeOptions: RequiredOptions = {
    data,
    width: finalWidth,
    height: finalHeight,
    margin: finalMargin,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: (isUrl ? "Byte" : "Alphanumeric") as Mode,
      errorCorrectionLevel: "M" as ErrorCorrectionLevel
    },
    // GS1: no image, no custom styling for compliance
    image: "",
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0,
      margin: 0
    },
    dotsOptions: {
      type: "square" as DotType,
      color: "#000"
    },
    backgroundOptions: {
      color: "#fff"
    },
    cornersSquareOptions: {
      type: "square" as CornerSquareType,
      color: "#000"
    },
    cornersDotOptions: {
      type: undefined,
      color: "#000"
    },
    associatedGtin,
    gs1TextHeightMm
  };

  return { qrCodeOptions, totalModules, moduleCount };
}

export default class QRCodeStylingGS1 extends QRCodeStyling {
  private _isGS1Mode = false;
  private _gs1Options?: RequiredOptions;

  // Enable GS1 mode and set configuration
  async setGS1Mode(gs1ConfigOptions: GS1ConfigOptions): Promise<void> {
    this._isGS1Mode = true;
    const { qrCodeOptions } = await gs1Config(gs1ConfigOptions);
    this._gs1Options = qrCodeOptions;

    // Apply the GS1 configuration to the QR code
    this.update(this._gs1Options);
  }

  // Check if currently in GS1 mode
  isGS1Mode(): boolean {
    return this._isGS1Mode;
  }

  // Get current GS1 options
  getGS1Options(): RequiredOptions | undefined {
    return this._gs1Options;
  }

  // Get total modules to build printing guideline
  async calculateTotalModules(options: GS1ConfigOptions) {
    const { moduleCount, totalModules } = await gs1Config(options);
    return { moduleCount, totalModules };
  }

  // Updated download method with GS1 support
  async download(downloadOptions?: Partial<DownloadOptions>): Promise<void> {
    if (!this._drawingPromise) return;

    await this._drawingPromise.then(async () => {
      if (!this._qr) throw "QR code is empty";

      const opt = <DownloadOptions>downloadOptions;
      const extension = opt.extension || "png";
      const name: string = opt.name || "qr";

      // If in GS1 mode and no explicit config provided, ensure GS1 configuration is applied
      if (this._isGS1Mode && this._gs1Options) {
        // Re-apply GS1 configuration before download to ensure compliance
        this.update(this._gs1Options);
        await this._drawingPromise; // Wait for re-render
      }

      if (extension.toLowerCase() === "svg") {
        const element: QRSVG = await this._getQRStylingElement();
        const serializer = new XMLSerializer();
        let source: string = serializer.serializeToString((element as unknown as QRSVG).getElement());
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url: string = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        downloadURI(url, `${name}.svg`);
      } else {
        if (!this._canvas) return;
        const data: string = this._canvas.getCanvas().toDataURL(`image/${extension}`);
        downloadURI(data, `${name}.${extension}`);
      }
    });
  }

  // Utility method to download with GS1 configuration
  async downloadWithGS1Config(
    gs1ConfigOptions: GS1ConfigOptions,
    downloadOptions?: Partial<DownloadOptions>
  ): Promise<void> {
    await this.setGS1Mode(gs1ConfigOptions);
    await this.download(downloadOptions);
  }
}
