module.exports = {
  title: "swapchain documentation",
  tagline:
    "Swapchain is an application for performing ACCS (atomic cross chain swaps) via HTLCs (hash-time-locked contracts",
  url: "https://chronark.github.io/swapchain",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "chronark",
  projectName: "swapchain",
  themeConfig: {
    navbar: {
      title: "Home",
      logo: {
        alt: "My Site Logo",
        src: "img/Logo_Swapchain_Bold_Subline.svg",
      },
      links: [
        {
          to: "docs/architecture",
          activeBasePath: "docs",
          label: "SW Architecture",
          position: "left",
        },
        {
          to: "docs/product-documentation",
          activeBasePath: "docs",
          label: "Product Documentation",
          position: "left",
        },
        { to: "docs/typedoc/globals", label: "Modules", position: "left" },
        {
          href: "https://github.com/chronark/swapchain",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [  
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/chronark/swapchain",
            },
          ],
        },
      ],
      copyright: "", //`Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/chronark/swapchain/edit/master/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/chronark/swapchain/edit/master/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
}
