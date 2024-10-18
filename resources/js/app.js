import "./bootstrap";
import "../css/app.css";

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/dist/vue.m";
import RegisterComponents from "./register-components";
import RegisterPlugins from "./register-plugins";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";
import BugsnagPerformance from "@bugsnag/browser-performance";

Bugsnag.start({
    appVersion: import.meta.env.VITE_APP_BUGSNAG_APP_VERSION,
    apiKey: '6aaf2c6db43423b12a5c89005815b73b',
    releaseStage: import.meta.env.VITE_APP_BUGSNAG_RELEASE_VERSION,
    plugins: [new BugsnagPluginVue()]
});

BugsnagPerformance.start({
    apiKey: '6aaf2c6db43423b12a5c89005815b73b',
});

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
const bugsnagVue = Bugsnag.getPlugin("vue");

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob("./pages/**/*.vue")),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(bugsnagVue)
            .use({
                install(app) {
                    app.config.globalProperties.$bugsnag = Bugsnag;
                }
            })
            .use(RegisterComponents)
            .use(RegisterPlugins)
            .mount(el);

        return app;
    },
    progress: {
        color: "#004E89",
    },
});
