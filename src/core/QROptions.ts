import qrTypes from "../constants/qrTypes";
import errorCorrectionLevels from "../constants/errorCorrectionLevels";
import type {
  DotType,
  GradientType,
  CornerSquareType,
  CornerDotType,
  TypeNumber,
  ErrorCorrectionLevel,
  Mode,
  DrawType
} from "../types";

export type Gradient = {
  type: GradientType;
  rotation?: number;
  colorStops: {
    offset: number;
    color: string;
  }[];
};
export interface IQrOptionsType {
  typeNumber?: TypeNumber;
  mode?: Mode;
  errorCorrectionLevel?: ErrorCorrectionLevel;
}
export interface GS1Options {
  enabled: boolean;
  moduleSize: number; // in mm (0.396 - 0.990)
  printDPI: number;
  quietZone: number; // modules (default 4)
  enforceUppercase: boolean;
  enforceMinimumSize: boolean;
}

export interface GS1Dimensions {
  widthInPixels: number;
  heightInPixels: number;
  widthInMM: number;
  heightInMM: number;
  moduleCount: number;
  totalModules: number;
  modulePixelSize: number;
  quietZonePixels: number;
}

export type Options = {
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
  backgroundOptions?: {
    color?: string;
    gradient?: Gradient;
  };
  gs1Options?: Partial<GS1Options>;
};

export interface RequiredOptions extends Options {
  type?: DrawType;
  width: number;
  height: number;
  margin: number;
  data: string;
  qrOptions: {
    typeNumber: TypeNumber;
    mode?: Mode;
    errorCorrectionLevel: ErrorCorrectionLevel;
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    crossOrigin?: string;
    margin: number;
  };
  dotsOptions: {
    type: DotType;
    color: string;
    gradient?: Gradient;
  };
  backgroundOptions: {
    color: string;
    gradient?: Gradient;
  };
}

const defaultGS1Options: GS1Options = {
  enabled: false,
  moduleSize: 0.396, // minimum GS1 size in mm
  printDPI: 300,
  quietZone: 4,
  enforceUppercase: true,
  enforceMinimumSize: true
};

const defaultOptions: RequiredOptions = {
  type: "canvas",
  width: 300,
  height: 300,
  data: "",
  margin: 0,
  qrOptions: {
    typeNumber: qrTypes[0],
    mode: undefined,
    errorCorrectionLevel: errorCorrectionLevels.Q
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    crossOrigin: undefined,
    margin: 0
  },
  dotsOptions: {
    type: "square",
    color: "#000"
  },
  backgroundOptions: {
    color: "#fff"
  },
  gs1Options: defaultGS1Options
};

export default defaultOptions;
