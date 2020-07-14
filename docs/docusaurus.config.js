module.exports = {
  title: "swapchain documentation",
  tagline:
    "Swapchain creates a trustless environment for the decentralized exchange of assets using Hashed Time Lock Contracts",
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
          label: "Software Architecture",
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
