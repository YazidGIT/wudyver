import {
  v4 as uuid
} from "uuid";

export const DashboardMenu = [{
  id: uuid(),
  title: "Dashboard",
  icon: "home",
  link: "/"
}, {
  id: uuid(),
  title: "LAYOUTS & PAGES",
  grouptitle: true
}, {
  id: uuid(),
  title: "Pages",
  icon: "layers",
  children: [{
    id: uuid(),
    link: "/pages/profile",
    name: "Profile"
  }, {
    id: uuid(),
    link: "/pages/settings",
    name: "Settings"
  }, {
    id: uuid(),
    link: "/pages/billing",
    name: "Billing"
  }, {
    id: uuid(),
    link: "/pages/pricing",
    name: "Pricing"
  }, {
    id: uuid(),
    link: "/not-found",
    name: "404 Error"
  }, {
    id: uuid(),
    link: "/pages/al-quran",
    name: "Al-Quran"
  }, {
    id: uuid(),
    link: "/pages/anonymous",
    name: "Anonymous"
  }, {
    id: uuid(),
    link: "/pages/arti-nama",
    name: "Arti Nama"
  }, {
    id: uuid(),
    link: "/pages/arti-nama-v2",
    name: "Arti Nama V2"
  }, {
    id: uuid(),
    link: "/pages/beauty-js",
    name: "Beauty JS"
  }, {
    id: uuid(),
    link: "/pages/cbox",
    name: "Cbox"
  }, {
    id: uuid(),
    link: "/pages/chess",
    name: "Chess"
  }, {
    id: uuid(),
    link: "/pages/comment",
    name: "Comment"
  }, {
    id: uuid(),
    link: "/pages/compiler",
    name: "Compiler"
  }, {
    id: uuid(),
    link: "/pages/cuaca",
    name: "Cuaca"
  }, {
    id: uuid(),
    link: "/pages/deck",
    name: "Deck"
  }, {
    id: uuid(),
    link: "/pages/demo",
    name: "Demo"
  }, {
    id: uuid(),
    link: "/pages/gpt",
    name: "GPT"
  }, {
    id: uuid(),
    link: "/pages/hentai",
    name: "Hentai"
  }, {
    id: uuid(),
    link: "/pages/html",
    name: "HTML"
  }, {
    id: uuid(),
    link: "/pages/mikasa",
    name: "Mikasa"
  }, {
    id: uuid(),
    link: "/pages/mystats",
    name: "My Stats"
  }, {
    id: uuid(),
    link: "/pages/open-source",
    name: "Open Source"
  }, {
    id: uuid(),
    link: "/pages/pairing",
    name: "Pairing"
  }, {
    id: uuid(),
    link: "/pages/paste",
    name: "Paste"
  }, {
    id: uuid(),
    link: "/pages/playwright",
    name: "Playwright"
  }, {
    id: uuid(),
    link: "/pages/posts",
    name: "Posts"
  }, {
 id: uuid(),
    link: "/pages/quotes",
    name: "Quotes"
  }, {
    id: uuid(),
    link: "/pages/room",
    name: "Room"
  }, {
    id: uuid(),
    link: "/pages/savetik",
    name: "Savetik"
  }, {
    id: uuid(),
    link: "/pages/savetube",
    name: "Savetube"
  }, {
    id: uuid(),
    link: "/pages/shortlink",
    name: "Shortlink"
  }, {
    id: uuid(),
    link: "/pages/upload",
    name: "Upload"
  }, {
    id: uuid(),
    link: "/pages/wiki",
    name: "Wiki"
  }, {
    id: uuid(),
    link: "/pages/wordle",
    name: "Wordle"
  }]
}, {
  id: uuid(),
  title: "Authentication",
  icon: "lock",
  children: [{
    id: uuid(),
    link: "/authentication/sign-in",
    name: "Sign In"
  }, {
    id: uuid(),
    link: "/authentication/sign-up",
    name: "Sign Up"
  }, {
    id: uuid(),
    link: "/authentication/forget-password",
    name: "Forget Password"
  }]
}, {
  id: uuid(),
  title: "Layouts",
  icon: "layout",
  link: "/layout-vertical"
}, {
  id: uuid(),
  title: "UI COMPONENTS",
  grouptitle: true
}, {
  id: uuid(),
  title: "Components",
  icon: "monitor",
  children: [{
    id: uuid(),
    link: "/components/accordions",
    name: "Accordions"
  }, {
    id: uuid(),
    link: "/components/alerts",
    name: "Alerts"
  }, {
    id: uuid(),
    link: "/components/badges",
    name: "Badges"
  }, {
    id: uuid(),
    link: "/components/breadcrumbs",
    name: "Breadcrumbs"
  }, {
    id: uuid(),
    link: "/components/buttons",
    name: "Buttons"
  }, {
    id: uuid(),
    link: "/components/button-group",
    name: "ButtonGroup"
  }, {
    id: uuid(),
    link: "/components/cards",
    name: "Cards"
  }, {
    id: uuid(),
    link: "/components/carousels",
    name: "Carousel"
  }, {
    id: uuid(),
    link: "/components/close-button",
    name: "Close Button"
  }, {
    id: uuid(),
    link: "/components/collapse",
    name: "Collapse"
  }, {
    id: uuid(),
    link: "/components/dropdowns",
    name: "Dropdowns"
  }, {
    id: uuid(),
    link: "/components/list-group",
    name: "Listgroup"
  }, {
    id: uuid(),
    link: "/components/modal",
    name: "Modal"
  }, {
    id: uuid(),
    link: "/components/navs",
    name: "Navs"
  }, {
    id: uuid(),
    link: "/components/navbar",
    name: "Navbar"
  }, {
    id: uuid(),
    link: "/components/offcanvas",
    name: "Offcanvas"
  }, {
    id: uuid(),
    link: "/components/overlays",
    name: "Overlays"
  }, {
    id: uuid(),
    link: "/components/pagination",
    name: "Pagination"
  }, {
    id: uuid(),
    link: "/components/popovers",
    name: "Popovers"
  }, {
    id: uuid(),
    link: "/components/progress",
    name: "Progress"
  }, {
    id: uuid(),
    link: "/components/spinners",
    name: "Spinners"
  }, {
    id: uuid(),
    link: "/components/tables",
    name: "Tables"
  }, {
    id: uuid(),
    link: "/components/toasts",
    name: "Toasts"
  }, {
    id: uuid(),
    link: "/components/tooltips",
    name: "Tooltips"
  }]
}, {
  id: uuid(),
  title: "Menu Level",
  icon: "corner-left-down",
  children: [{
    id: uuid(),
    link: "#",
    title: "Two Level",
    children: [{
      id: uuid(),
      link: "#",
      name: "NavItem 1"
    }, {
      id: uuid(),
      link: "#",
      name: "NavItem 2"
    }]
  }, {
    id: uuid(),
    link: "#",
    title: "Three Level",
    children: [{
      id: uuid(),
      link: "#",
      title: "NavItem 1",
      children: [{
        id: uuid(),
        link: "#",
        name: "NavChildItem 1"
      }, {
        id: uuid(),
        link: "#",
        name: "NavChildItem 2"
      }]
    }, {
      id: uuid(),
      link: "#",
      name: "NavItem 2"
    }]
  }]
}, {
  id: uuid(),
  title: "Documentation",
  grouptitle: true
}, {
  id: uuid(),
  title: "Docs",
  icon: "clipboard",
  link: "/documentation"
}, {
  id: uuid(),
  title: "Changelog",
  icon: "git-pull-request",
  link: "/changelog"
}, {
  id: uuid(),
  title: "Download",
  icon: "download",
  link: "https://codescandy.gumroad.com/l/dashui-nextjs"
}, {
  id: uuid(),
  title: "API Routes",
  icon: "api",
  link: "/api-route"
}, {
  id: uuid(),
  title: "Endpoints",
  icon: "endpoint",
  link: "/endpoint"
}, {
  id: uuid(),
  title: "Playground",
  icon: "playground",
  link: "/playground"
}, {
  id: uuid(),
  title: "Stats",
  icon: "stats",
  link: "/stats"
}];

export default DashboardMenu;