import { GS1Dimensions, GS1Options } from "@/core/QROptions";
import type { GS1PrintSpecs, GS1ValidationResult } from "../types";

export class GS1Helper {
  static validateGS1Options(options: GS1Options): GS1ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate module size
    if (options.moduleSize < 0.396 || options.moduleSize > 0.99) {
      errors.push(`Module size ${options.moduleSize}mm is outside GS1 specification (0.396-0.990mm)`);
    }

    // Validate quiet zone
    if (options.quietZone < 4) {
      warnings.push(`Quiet zone of ${options.quietZone} modules is below GS1 recommendation of 4 modules`);
    }

    // Validate print DPI
    if (options.printDPI < 200) {
      warnings.push(`Print DPI of ${options.printDPI} may result in poor print quality. Recommend 300+ DPI`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      dimensions: null
    };
  }

  static calculatePrintSpecs(dimensions: GS1Dimensions, options: GS1Options): GS1PrintSpecs {
    return {
      moduleSize: options.moduleSize,
      printDPI: options.printDPI,
      physicalWidth: dimensions.widthInMM,
      physicalHeight: dimensions.heightInMM,
      recommendedPrintSize: `${dimensions.widthInMM.toFixed(2)}mm × ${dimensions.heightInMM.toFixed(2)}mm`
    };
  }

  static getRecommendedErrorCorrectionLevel(dataLength: number): "L" | "M" | "Q" | "H" {
    // GS1 recommendations based on usage
    if (dataLength < 50) return "M"; // Medium for most retail applications
    if (dataLength < 100) return "Q"; // Quartile for longer data
    return "H"; // High for very long data or harsh environments
  }

  static formatGS1Data(data: string, enforceUppercase = true): string {
    let formatted = data.trim();

    if (enforceUppercase) {
      formatted = formatted.toUpperCase();
    }

    return formatted;
  }
}
