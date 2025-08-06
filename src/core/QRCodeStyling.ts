import getMode from "../tools/getMode";
import mergeDeep from "../tools/merge";
import downloadURI from "../tools/downloadURI";
import QRCanvas from "./QRCanvas";
import QRSVG from "./QRSVG";
import drawTypes from "../constants/drawTypes";
import defaultOptions, { GS1Dimensions, GS1Options, type Options, type RequiredOptions } from "./QROptions";
import sanitizeOptions from "../tools/sanitizeOptions";
import type { Extension, QRCode } from "../types";
import qrcode from "qrcode-generator";

type DownloadOptions = {
  name?: string;
  extension?: Extension;
};

export default class QRCodeStyling {
  _options: RequiredOptions;
  _container?: HTMLElement;
  _canvas?: QRCanvas;
  _svg?: QRSVG;
  _qr?: QRCode;
  _drawingPromise?: Promise<void>;
  _svgDrawingPromise?: Promise<void>;
  _gs1Dimensions?: GS1Dimensions | null;

  constructor(options?: Partial<Options>) {
    this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options) as RequiredOptions) : defaultOptions;
    this.update();
  }

  static _clearContainer(container?: HTMLElement): void {
    if (container) {
      container.innerHTML = "";
    }
  }

  private _calculateGS1Dimensions(): GS1Dimensions | null {
    if (!this._options.gs1Options?.enabled || !this._qr) {
      return null;
    }

    const gs1Config = this._options.gs1Options as GS1Options;
    const moduleCount = this._qr.getModuleCount();

    // Add quiet zone (4 modules on each side = 8 total)
    const totalModules = moduleCount + gs1Config.quietZone * 2;

    // Convert mm to pixels
    const pixelsPerMM = gs1Config.printDPI / 25.4;
    const widthInMM = totalModules * gs1Config.moduleSize;
    const heightInMM = widthInMM; // QR codes are square
    const widthInPixels = Math.round(widthInMM * pixelsPerMM);
    const heightInPixels = widthInPixels;

    // Calculate module size in pixels
    const modulePixelSize = widthInPixels / totalModules;
    const quietZonePixels = modulePixelSize * gs1Config.quietZone;

    const dimensions: GS1Dimensions = {
      widthInPixels,
      heightInPixels,
      widthInMM,
      heightInMM,
      moduleCount,
      totalModules,
      modulePixelSize,
      quietZonePixels
    };

    // Validate minimum size if enforced
    if (gs1Config.enforceMinimumSize) {
      const minSizeInMM = (moduleCount + 8) * 0.396; // minimum module size
      if (widthInMM < minSizeInMM) {
        throw new Error(
          `GS1 QR Code too small. Minimum size: ${minSizeInMM.toFixed(2)}mm, current: ${widthInMM.toFixed(2)}mm`
        );
      }
    }

    return dimensions;
  }

  private _processGS1Data(data: string): string {
    if (!this._options.gs1Options?.enabled) {
      return data;
    }

    const gs1Config = this._options.gs1Options as GS1Options;

    if (gs1Config.enforceUppercase) {
      return data.toUpperCase();
    }

    return data;
  }
  getGS1Dimensions(): GS1Dimensions | null {
    return this._gs1Dimensions || null;
  }

  async _getQRStylingElement(): Promise<QRSVG> {
    if (!this._qr) throw "QR code is empty";

    let promise, svg: QRSVG;

    if (this._svg && this._svgDrawingPromise) {
      svg = this._svg;
      promise = this._svgDrawingPromise;
    } else {
      svg = new QRSVG(this._options);
      promise = svg.drawQR(this._qr);
    }
    await promise;
    return svg;
  }

  update(options?: Partial<Options>): void {
    QRCodeStyling._clearContainer(this._container);
    this._options = options ? sanitizeOptions(mergeDeep(this._options, options) as RequiredOptions) : this._options;

    if (!this._options.data) {
      return;
    }

    // Process data for GS1 compliance
    const processedData = this._processGS1Data(this._options.data);

    this._qr = <QRCode>qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
    this._qr.addData(processedData, this._options.qrOptions.mode || getMode(processedData));
    this._qr.make();

    // Calculate GS1 dimensions if enabled
    this._gs1Dimensions = this._calculateGS1Dimensions();

    // Override canvas/SVG dimensions for GS1 compliance
    if (this._gs1Dimensions) {
      this._options.width = this._gs1Dimensions.widthInPixels;
      this._options.height = this._gs1Dimensions.heightInPixels;
    }

    if (this._options.type === drawTypes.svg) {
      this._svg = new QRSVG(this._options);
      this._svgDrawingPromise = this._svg.drawQR(this._qr);
      this._drawingPromise = undefined;
      this._canvas = undefined;
    } else {
      this._canvas = new QRCanvas(this._options);
      this._drawingPromise = this._canvas.drawQR(this._qr);
      this._svgDrawingPromise = undefined;
      this._svg = undefined;
    }
    this.append(this._container);
  }

  append(container?: HTMLElement): void {
    if (!container) {
      return;
    }

    if (typeof container.appendChild !== "function") {
      // eslint-disable-next-line no-throw-literal
      throw "Container should be a single DOM node";
    }

    if (this._options.type === drawTypes.svg) {
      if (this._svg) {
        container.appendChild(this._svg.getElement());
      }
    } else {
      if (this._canvas) {
        container.appendChild(this._canvas.getCanvas());
      }
    }
    this._container = container;
  }

  async getImageUrl(extension: string): Promise<string> {
    if (!this._drawingPromise) return "";

    const getImageUrl = await this._drawingPromise;
    if (getImageUrl === undefined) {
      if (!this._canvas) return "";
      const data: string = this._canvas.getCanvas().toDataURL(`image/${extension}`);
      return data;
    }
    return "";
  }

  async getRawData(extension: Extension = "png"): Promise<Blob | null> {
    if (!this._qr) throw "QR code is empty";
    const element: QRSVG = await this._getQRStylingElement();

    if (extension.toLowerCase() === "svg") {
      const serializer = new XMLSerializer();
      const source: string = serializer.serializeToString((element as unknown as QRSVG).getElement());
      return new Blob(['<?xml version="1.0" standalone="no"?>\r\n' + source], { type: "image/svg+xml" });
    } else {
      return new Promise((resolve) =>
        (element as unknown as QRCanvas).getCanvas().toBlob(resolve, `image/${extension}`, 1)
      );
    }
  }

  async download(downloadOptions?: Partial<DownloadOptions>): Promise<void> {
    if (!this._drawingPromise) return;

    await this._drawingPromise.then(async () => {
      if (!this._qr) throw "QR code is empty";

      const opt = <DownloadOptions>downloadOptions;
      const extension = opt.extension || "png";
      const name: string = opt.name || "qr";

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
}
