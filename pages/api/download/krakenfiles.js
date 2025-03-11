import axios from "axios";
import * as cheerio from "cheerio";
class KrakenFiles {
  constructor(url) {
    if (!/krakenfiles.com/.test(url)) throw new Error("Input URL harus dari Krakenfiles!");
    this.url = url;
  }
  async fetchPage() {
    try {
      const {
        data
      } = await axios.get(this.url, {
        headers: {
          "User-Agent": "Posify/1.0.0",
          Referer: "krakenfiles.com",
          Accept: "krakenfile.com"
        }
      });
      return cheerio.load(data);
    } catch (error) {
      throw new Error("Gagal mengambil halaman Krakenfiles!");
    }
  }
  async extractMetadata($) {
    const metadata = {};
    metadata.filename = $(".coin-info .coin-name h5").text().trim();
    $(".nk-iv-wg4 .nk-iv-wg4-overview li").each((_, elem) => {
      const name = $(elem).find(".sub-text").text().trim().replace(/\s+/g, "_").toLowerCase();
      const value = $(elem).find(".lead-text").text();
      metadata[name] = value;
    });
    $(".nk-iv-wg4-list li").each((_, elem) => {
      const name = $(elem).find("div").eq(0).text().trim().replace(/\s+/g, "_").toLowerCase();
      const value = $(elem).find("div").eq(1).text().trim().replace(/\s+/g, ",");
      metadata[name] = value;
    });
    if ($("video").html()) {
      metadata.thumbnail = "https:" + $("video").attr("poster");
    } else if ($(".lightgallery").html()) {
      metadata.thumbnail = "https:" + $(".lightgallery a").attr("href");
    } else {
      metadata.thumbnail = "N/A";
    }
    return metadata;
  }
  async getDownloadLink($) {
    if ($("video").html()) {
      return "https:" + $("video source").attr("src");
    }
    return "https:" + $(".lightgallery a").attr("href");
  }
  async fetchBuffer(downloadUrl, $) {
    try {
      const {
        data
      } = await axios.get(downloadUrl, {
        headers: {
          "User-Agent": "Posify/1.0.0",
          Referer: "krakenfiles.com",
          Accept: "krakenfile.com",
          token: $("#dl-token").val()
        },
        responseType: "arraybuffer"
      });
      if (!Buffer.isBuffer(data)) throw new Error("Hasil bukan buffer!");
      return data;
    } catch (error) {
      throw new Error("Gagal mengunduh buffer!");
    }
  }
  async download() {
    try {
      const $ = await this.fetchPage();
      const metadata = await this.extractMetadata($);
      const downloadUrl = await this.getDownloadLink($);
      const buffer = await this.fetchBuffer(downloadUrl, $);
      return {
        metadata: metadata,
        buffer: buffer
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export default async function handler(req, res) {
  const {
    url
  } = req.method === "GET" ? req.query : req.body;
  if (!url) {
    return res.status(400).json({
      error: "URL is required"
    });
  }
  try {
    const kraken = new KrakenFiles(url);
    const result = await kraken.download();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to scrape the URL",
      details: error.message
    });
  }
}