import axios from 'axios';
import { URL } from 'url';
import * as cheerio from 'cheerio';

class BingImageGenerator {
  constructor() {
    this.baseURL = 'https://www.bing.com/images/create';
    this.defaultHeaders = {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'id-ID,id;q=0.9',
      'cache-control': 'max-age=0',
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://www.bing.com',
      'referer': 'https://www.bing.com/images/create?&wlexpsignin=1',
      'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
      'sec-ch-ua-mobile': '?1',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-dest': 'document',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Linux; Android 11; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
    };
  }

  async generate({ prompt, cookie = '1vasCP3Xkb2-Cm_flyQc_0-rgishiuZdTX4V5Yp-g7oGjPOKka1XX60Nw6G9yleFn1OHFwQ79scicQRol4tR0h9tZWplyTIPhcIibJ0fEcjzHZFDEcOO62_x4Z-DlFTjxCCteP0t7aY4lhlQjL6F70eIZBS72d7Ey0x1zO0ij09sxX37-eRiHZg6Fffbp_2UyDoEBUr0MGlqMTFNkxgYxUknOIX1gSeEd5b-gBWtifzo' }) {
    if (!prompt) throw new Error('Parameter "prompt" diperlukan');

    try {
      const headers = { ...this.defaultHeaders, cookie: `_U=${cookie}`};
      const response = await axios.post(this.baseURL, new URLSearchParams({ q: prompt, rt: '4', FORM: 'GENCRE' }), {
        headers,
        maxRedirects: 0,
        validateStatus: status => status >= 300 && status < 400
      });

      const redirectUrl = response.headers.location;
      if (!redirectUrl) throw new Error('Gagal mendapatkan redirect URL');

      const urlObj = new URL(redirectUrl, this.baseURL);
      const requestId = urlObj.searchParams.get('id');
      if (!requestId) throw new Error('ID tidak ditemukan dalam URL');

      return this.pollForImages({ requestId, prompt, headers });
    } catch (error) {
      console.error('Error fetching image:', error.message);
      return null;
    }
  }

  async pollForImages({ requestId, prompt, headers }) {
    const pollingUrl = `${this.baseURL}/async/results/${requestId}?q=${encodeURIComponent(prompt)}`;
    let attempts = 0;

    while (attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 3000));

      try {
        const response = await axios.get(pollingUrl, { headers });
        const $ = cheerio.load(response.data);
        const images = [];

        $('.img_cont .mimg').each((_, el) => {
          images.push($(el).attr('src').split('?')[0]);
        });

        if (images.length > 0) return images;
      } catch (error) {
        console.error('Polling error:', error.message);
      }

      attempts++;
    }

    throw new Error('Gagal mendapatkan gambar setelah polling.');
  }
}

export default async function handler(req, res) {
  const params = req.method === "GET" ? req.query : req.body;
  const bingAI = new BingImageGenerator();

  try {
    if (!params.prompt) {
      return res.status(400).json({
        error: "Missing required parameters: prompt"
      });
    }

    const result = await bingAI.generate({ prompt: params.prompt, cookie: params.cookie });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
