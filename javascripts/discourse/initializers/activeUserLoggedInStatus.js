import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utility";
import { defaultHomepage } from "discourse/lib/utilities";

export default {
    name: "activeUserLoggedInStatus",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            if (!api.router) {
                console.warn("Discourse router is not available yet.");
                return;
            }

            const isHomepage = () => {
                if (!api.router.currentRouteName) {
                    console.warn("Router is available but currentRouteName is undefined.");
                    return false;
                }

                const homeRoute = `discovery.${defaultHomepage()}`; // 確保完整路由名稱
                const { currentRouteName } = api.router;

                console.log("Current Route:", currentRouteName, "Expected Home Route:", homeRoute);
                return currentRouteName === homeRoute;
            };

            console.log("Testing activeUserLoggedInStatus--", isHomepage());

            api.onPageChange(() => {
                userLoggedInStatus(api, isHomepage());
            });

            api.onAppEvent("post-stream:posted", () => {
                userLoggedInStatus(api, isHomepage());
            });
        });
    },
};
