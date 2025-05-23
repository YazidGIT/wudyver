import {
  NextResponse
} from "next/server";
import apiConfig from "@/configs/apiConfig";
import axios from "axios";
import {
  RateLimiterMemory
} from "rate-limiter-flexible";

const DOMAIN_URL = apiConfig.DOMAIN_URL || "localhost";
const DEFAULT_PROTOCOL = "https://";

// Inisialisasi RateLimiterMemory
const rateLimiter = new RateLimiterMemory({
  points: apiConfig.LIMIT_POINTS,
  duration: apiConfig.LIMIT_DURATION,
});

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: ["/", "/login", "/register", "/api/:path*"],
};

// Fungsi pembantu untuk memastikan protokol di URL
function ensureProtocol(url, defaultProtocol) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return defaultProtocol + url;
  }
  return url;
}

// Fungsi pembantu untuk memeriksa otentikasi
function isAuthenticated(token) {
  return Boolean(token);
}

export async function middleware(req) {
  try {
    const url = new URL(req.url);
    const {
      pathname
    } = url;
    const isApi = pathname.startsWith("/api");
    const isAuthPage = ["/login", "/register"].includes(pathname);
    const authToken = req.cookies.get("auth_token")?.value;
    const requestStartTime = Date.now();
    // Gunakan req.ip untuk mendapatkan IP Address, jika tidak tersedia, fallback ke 'unknown' atau IP dari header 'x-forwarded-for'
    const ipAddress = req.ip || req.headers.get('x-forwarded-for') || "unknown";

    const response = NextResponse.next();
    console.log(`[Middleware] ${req.method} ${req.url} - Start`);

    // Set header CORS
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // Logika Rate Limiting untuk API endpoint (kecuali /api/visitor)
    if (isApi && !pathname.includes("/api/visitor")) {
      try {
        const rateLimiterRes = await rateLimiter.consume(ipAddress, 1);

        // Set header X-RateLimit sesuai dokumentasi rate-limiter-flexible
        response.headers.set("X-RateLimit-Limit", apiConfig.LIMIT_POINTS);
        response.headers.set("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
        response.headers.set(
          "X-RateLimit-Reset",
          Math.ceil((Date.now() + rateLimiterRes.msBeforeNext) / 1000)
        );

      } catch (rateLimiterError) {
        // Ketika terjadi rate limit
        const retryAfterSeconds = Math.ceil(rateLimiterError.msBeforeNext / 1000);
        const totalLimit = apiConfig.LIMIT_POINTS;

        return new NextResponse(
          JSON.stringify({
            status: "error",
            code: 429,
            message: `Terlalu banyak permintaan. Anda telah melampaui batas ${totalLimit} permintaan per ${apiConfig.LIMIT_DURATION} detik. Silakan coba lagi dalam ${retryAfterSeconds} detik.`,
            limit: totalLimit,
            remaining: 0,
            retryAfter: retryAfterSeconds,
          }), {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": retryAfterSeconds,
              "X-RateLimit-Limit": totalLimit,
              "X-RateLimit-Remaining": 0,
              // X-RateLimit-Reset pada error berarti kapan limit akan direset
              "X-RateLimit-Reset": Math.ceil((Date.now() + rateLimiterError.msBeforeNext) / 1000),
            },
          }
        );
      }
    }

    // Logika pengalihan untuk halaman yang membutuhkan otentikasi
    if (!isApi && !isAuthPage && !isAuthenticated(authToken)) {
      console.warn(`[Middleware] Tidak terautentikasi. Mengarahkan ke login.`);
      const redirectUrlWithProtocol = ensureProtocol(DOMAIN_URL, DEFAULT_PROTOCOL);
      return NextResponse.redirect(`${redirectUrlWithProtocol}/login`);
    }

    const responseTime = Date.now() - requestStartTime;
    console.log(`[Middleware] ${req.method} ${req.url} - ${response.status} (${responseTime}ms)`);

    // Logika pencatatan pengunjung (visitor logging)
    try {
      const baseURL = ensureProtocol(DOMAIN_URL, DEFAULT_PROTOCOL);
      if (isApi) {
        await axios.get(`${baseURL}/api/visitor/req`, {
          headers: {
            "Content-Type": "application/json"
          },
        });
      } else {
        await axios.get(`${baseURL}/api/visitor/visit`, {
          headers: {
            "Content-Type": "application/json"
          },
        });
        await axios.post(
          `${baseURL}/api/visitor/info`, {
            route: pathname,
            time: new Date().toISOString(),
            hit: 1,
          }, {
            headers: {
              "Content-Type": "application/json"
            },
          }
        );
      }
    } catch (err) {
      console.error(`[Middleware] Pencatatan pengunjung gagal:`, err.message);
    }

    return response;
  } catch (error) {
    console.error("[Middleware] Kesalahan yang tidak tertangani:", error);
    return new NextResponse(
      JSON.stringify({
        status: "error",
        code: 500,
        message: "Kesalahan Server Internal",
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
  }
}