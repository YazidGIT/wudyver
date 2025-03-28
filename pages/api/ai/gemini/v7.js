import axios from "axios";
class GeminiAPI {
  constructor() {
    this.baseUrl = "https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1";
    this.headers = {
      accept: "*/*",
      "accept-language": "id-ID,id;q=0.9",
      "content-type": "application/json",
      origin: "https://dev.screenapp.io",
      priority: "u=1, i",
      referer: "https://dev.screenapp.io/",
      "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
    };
  }
  async getMimeTypeAndBase64(imgUrl) {
    try {
      const response = await axios.get(imgUrl, {
        headers: this.headers,
        responseType: "arraybuffer"
      });
      return {
        mimeType: response.headers["content-type"],
        base64Data: Buffer.from(response.data, "binary").toString("base64")
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  }
  async chat({
    prompt,
    model = "gemini-2.0-flash-lite",
    imgUrl
  }) {
    try {
      const requestData = {
        model: model,
        contents: [{
          parts: [...imgUrl ? [{
            inlineData: await this.getMimeTypeAndBase64(imgUrl)
          }] : [], {
            text: prompt
          }]
        }]
      };
      const response = await axios.post(this.baseUrl, requestData, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error("Error during chat request:", error);
      throw error;
    }
  }
}
export default async function handler(req, res) {
  const {
    prompt,
    ...params
  } = req.method === "GET" ? req.query : req.body;
  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required"
    });
  }
  const geminiApi = new GeminiAPI();
  try {
    const data = await geminiApi.chat({
      prompt: prompt,
      ...params
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error during chat request"
    });
  }
}