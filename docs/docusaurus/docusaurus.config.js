// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'the-world-engine',
    tagline: 'three.js based, unity like game engine for browser',
    url: 'https://the-world-space.github.io/',
    baseUrl: process.env.NODE_ENV === 'production' ? '/the-world-engine.ts/build/' : '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'noname0310',
    projectName: 'the-world-engine.ts',

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/The-World-Space/the-world-engine.ts/tree/main/docs/docusaurus/',
                },
                // blog: {
                //   showReadingTime: true,
                //   editUrl:
                //     ''https://github.com/The-World-Space/the-world-engine.ts/tree/main/docs/docusaurus/',
                // },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
        navbar: {
            title: 'the-world-engine',
            logo: {
                alt: 'the-world logo',
                src: 'img/logo.svg',
            },
            items: [{
                    type: 'doc',
                    docId: 'getting-started/installation',
                    position: 'left',
                    label: 'Docs',
                },
                // { to: '/blog', label: 'Blog', position: 'left' },
                {
                    href: 'https://github.com/The-World-Space/the-world-engine.ts',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                // {
                //     title: 'Docs',
                //     items: [{
                //         label: 'Tutorial',
                //         to: '/docs/intro',
                //     }, ],
                // },
                // {
                //     title: 'Community',
                //     items: [{
                //             label: 'Stack Overflow',
                //             href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                //         },
                //         {
                //             label: 'Discord',
                //             href: 'https://discordapp.com/invite/docusaurus',
                //         },
                //         {
                //             label: 'Twitter',
                //             href: 'https://twitter.com/docusaurus',
                //         },
                //     ],
                // },
                // {
                //     title: 'More',
                //     items: [{
                //             label: 'Blog',
                //             to: '/blog',
                //         },
                //         {
                //             label: 'GitHub',
                //             href: 'https://github.com/facebook/docusaurus',
                //         },
                //     ],
                // },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} the-world, Inc. Built with Docusaurus.`,
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
        },
    }),
};

module.exports = config;
