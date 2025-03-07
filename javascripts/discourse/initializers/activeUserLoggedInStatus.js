import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utility";
import { defaultHomepage } from "discourse/lib/utilities";

export default {
    name: "activeUserLoggedInStatus",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            const isHomepage = () => {
                const homeRoute = `discovery.${defaultHomepage()}`; // 構造完整路由名稱
                const { currentRouteName } = api.router;
                console.log("Current Route:", currentRouteName, "Expected Home Route:", homeRoute);
                return currentRouteName === homeRoute;
            };

            console.log("Testing activeUserLoggedInStatus--", isHomepage());

            api.onPageChange(() => {
                userLoggedInStatus(api);
            });

            api.onAppEvent("post-stream:posted", () => {
                userLoggedInStatus(api);
            });
        });
    },
};
