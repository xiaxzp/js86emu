// https://www.seasip.info/VintagePC/mda.html
// http://www.oldskool.org/guides/oldonnew/resources/cgatech.txt
import { FONT_PATH } from "../Constants";
import { loadPNGAwait } from "../utils/Utils";

export default class VideoMDA {
  constructor (mem8, renderer) {
    this.mem8            = mem8;
    this.renderer        = renderer;
    this.verticalSync    = 50;       // Hertz
    this.memStart        = 0x8000;
    this.memSize         = 4 * 1024; // 4k
    this.font            = [];
    this.renderer        = null;

    this.fontWidth       = 9;
    this.fontHeight      = 14;
    this.screenWidth     = 720;
    this.screenHeight    = 350;
    this.textModeColumns = 80;
    this.textModeRows    = 25;
    this.use_attribute_bit = false;

    this.fontFiles = [
      {
        "file"     : "mda_cp_437",
        "width"    : 288,
        "height"   : 112,
        "FG_LIGHT" : 0xAA,
        "BG_DARK"  : 0x00,
      }
    ];
    this.selectedFont = this.fontFiles[0];
  }

  async init (renderer) {
    this.renderer = renderer;

    // Load font
    let path = `${FONT_PATH}${this.selectedFont["file"]}.png`;
    let fontImage = await loadPNGAwait(path);
    this.buildFontTable(fontImage);
  }

  buildFontTable (fontImage) {
    let fontCounter = 0;
    let imageWidth  = this.selectedFont["width"];
    let imageHeight = this.selectedFont["height"];
    let fontsAcross = (imageWidth / this.fontWidth);
    let fontsDown   = (imageHeight / this.fontHeight);
    this.font = Array(fontsAcross * fontsDown);

    for ( let y = 0; y < fontsDown; y++) {
      for ( let x = 0; x < fontsAcross; x++) {
        let glyph = [];

        // Now loop through the pixels of the font
        for ( let fy = 0; fy < this.fontHeight; fy++) {
          // Build an array for this row of the font
          let glyphRow = new Uint8Array(this.fontWidth);

          for ( let fx = 0; fx < this.fontWidth; fx++) {
            // Calculate the memory offset
            let glyphOffset = ( ((y * this.fontHeight) + fy) * imageWidth + ((x * this.fontWidth) + fx) ) * 4;

            // The font files should be black & white so we just need
            // to check of one channel has a non-zero value
            if (fontImage[glyphOffset] !== 0) {
              glyphRow[fx] = 0;
            }
            else {
              glyphRow[fx] = 255;
            }
          }
          glyph[fy] = glyphRow;
        }

        this.font[fontCounter] = glyph;
        fontCounter++;
      }
    }
  }

  scan () {
    let imageWidth  = this.selectedFont["width"];
    let imageHeight = this.selectedFont["height"];

    let attribute_offset;
    if (this.use_attribute_bit) attribute_offset = 2;
    else attribute_offset = 1;

    for ( let r = 0; r < this.textModeRows; r++) {
      for ( let c = 0; c < this.textModeColumns; c++) {
        let memoryOffset = this.memStart + ( (r * this.textModeColumns) + c ) * attribute_offset;

        let glyph = this.font[this.mem8[memoryOffset]];
        let attr  = this.mem8[memoryOffset + 1];

        //console.log("off = ", memoryOffset, " val=(", gfxMem[memoryOffset], ",", gfxMem[memoryOffset + 1], ")");

        // Now loop through the pixels of the font
        for ( let fy = 0; fy < this.fontHeight; fy++) {
          let glyphRow = glyph[fy];

          for ( let fx = 0; fx < this.fontWidth; fx++) {
            // Calculate the memory offset
            let screenOffset = ( ((r * this.fontHeight) + fy) * imageWidth + ((c * this.fontWidth) + fx) ) * 4;

            let value = (0xFF === glyphRow[fx]) ? this.selectedFont["FG_LIGHT"] : this.selectedFont["BG_DARK"];
            imageData.data[screenOffset]     = value; // Red
            imageData.data[screenOffset + 1] = value; // Blue
            imageData.data[screenOffset + 2] = value; // Green
            imageData.data[screenOffset + 3] = 255;   // Alpha
          }
        }
      }
    }
    this.renderer.render(screen);
  }
}
