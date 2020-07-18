module.exports = {
  title: "swapchain documentation",
  tagline:
    "Swapchain is an application that enables users to perform atomic cross-chain swaps (ACCS) between BTS and BTS and vice versa.",
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
          to: "docs/product-documentation",
          label: "Product Documentation",
          position: "left",
        },
        {
          to: "docs/architecture",
          label: "Software Architecture",
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
