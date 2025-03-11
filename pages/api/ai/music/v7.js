import axios from "axios";
class LyricsIntoSongAPI {
  constructor() {
    this.apiBaseUrl = "https://lyricsintosong.ai/api";
    this.headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Origin: "https://lyricsintosong.ai",
      Referer: "https://lyricsintosong.ai/"
    };
    this.defaultGenerateData = {
      style: "country",
      prompt: "Intro:\nRollin' through the dusty lanes...",
      title: "Backroads and Memories",
      customMode: true,
      instrumental: false,
      isPrivate: false,
      action: "generate"
    };
  }
  async randomLyrics() {
    try {
      const url = `${this.apiBaseUrl}/random-lyrics`;
      const response = await axios.post(url, {}, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching random lyrics:", error.response?.data || error.message);
      return null;
    }
  }
  async generate(data = {}) {
    try {
      const requestData = {
        ...this.defaultGenerateData,
        ...data
      };
      const url = `${this.apiBaseUrl}/generate`;
      const response = await axios.post(url, requestData, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error("Error generating song:", error.response?.data || error.message);
      return null;
    }
  }
  async musicDetail({
    musicId = "de852ae0-f930-4f9b-9df2-dae30faf33b9"
  }) {
    try {
      const url = `${this.apiBaseUrl}/music-detail/${musicId}`;
      const response = await axios.get(url, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching music detail:", error.response?.data || error.message);
      return null;
    }
  }
}
export default async function handler(req, res) {
  const {
    action,
    ...params
  } = req.query;
  const lyricsAPI = new LyricsIntoSongAPI();
  try {
    switch (action) {
      case "create": {
        const song = await lyricsAPI.generate(params);
        if (!song) throw new Error("Gagal membuat lagu");
        return res.status(200).json(song);
      }
      case "detail": {
        const detail = await lyricsAPI.musicDetail(params);
        if (!detail) throw new Error("Gagal mengambil detail lagu");
        return res.status(200).json(detail);
      }
      case "lyrics": {
        const lyrics = await lyricsAPI.randomLyrics();
        if (!lyrics) throw new Error("Gagal mengambil lirik");
        return res.status(200).json(lyrics);
      }
      default:
        return res.status(400).json({
          error: "Action tidak valid. Gunakan ?action=create, ?action=detail, atau ?action=lyrics"
        });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}