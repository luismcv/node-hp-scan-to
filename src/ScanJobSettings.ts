const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const util = require("util");

export default class ScanJobSettings {
  private readonly inputSource: "Adf" | "Platen";
  public readonly contentType: "Document" | "Photo";
  private readonly isDuplex: boolean;
  private readonly resolution: number;

  constructor(
    inputSource: "Adf" | "Platen",
    contentType: "Document" | "Photo",
    isDuplex: boolean,
    resolution: number
  ) {
    this.inputSource = inputSource;
    this.contentType = contentType;
    this.isDuplex = isDuplex;
    this.resolution = resolution;
  }

  async toXML(): Promise<string> {
    let rawJob =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<ScanSettings xmlns="http://www.hp.com/schemas/imaging/con/cnx/scan/2008/08/19" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.hp.com/schemas/imaging/con/cnx/scan/2008/08/19 Scan Schema - 0.26.xsd">\n' +
      "\t<XResolution>200</XResolution>\n" +
      "\t<YResolution>200</YResolution>\n" +
      "\t<XStart>33</XStart>\n" +
      "\t<YStart>0</YStart>\n" +
      "\t<Width>2481</Width>\n" +
      "\t<Height>3507</Height>\n" +
      "\t<Format>Jpeg</Format>\n" +
      "\t<CompressionQFactor>0</CompressionQFactor>\n" +
      "\t<ColorSpace>Color</ColorSpace>\n" +
      "\t<BitDepth>8</BitDepth>\n" +
      "\t<InputSource>Adf</InputSource>\n" +
      "\t<GrayRendering>NTSC</GrayRendering>\n" +
      "\t<ToneMap>\n" +
      "\t\t<Gamma>1000</Gamma>\n" +
      "\t\t<Brightness>1000</Brightness>\n" +
      "\t\t<Contrast>1000</Contrast>\n" +
      "\t\t<Highlite>179</Highlite>\n" +
      "\t\t<Shadow>25</Shadow>\n" +
      "\t\t<Threshold>0</Threshold>\n" +
      "\t</ToneMap>\n" +
      "\t<SharpeningLevel>128</SharpeningLevel>\n" +
      "\t<NoiseRemoval>0</NoiseRemoval>\n" +
      "\t<ContentType>Document</ContentType>\n" +
      "</ScanSettings>";

    const parsed = await util.promisify(parser.parseString)(rawJob);

    parsed.ScanSettings.InputSource[0] = this.inputSource;
    if (this.inputSource === "Adf" && this.isDuplex) {
      parsed.ScanSettings["AdfOptions"] = [{ AdfOption: ["Duplex"] }];
    }
    parsed.ScanSettings.ContentType[0] = this.contentType;
    parsed.ScanSettings.XResolution[0] = this.resolution;
    parsed.ScanSettings.YResolution[0] = this.resolution;

    let builder = new xml2js.Builder({
      xmldec: { version: "1.0", encoding: "UTF-8", standalone: false },
      renderOpts: { pretty: true, indent: "\t", newline: "\n" },
    });

    return builder.buildObject(parsed);
  }
}
