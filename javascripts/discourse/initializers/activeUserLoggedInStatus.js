import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utility";
import { defaultHomepage } from "discourse/lib/utilities";

export default {
    name: "activeUserLoggedInStatus",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            api.onPageChange(() => {
                userLoggedInStatus(api, defaultHomepage);
            });

            api.onAppEvent("post-stream:posted", () => {
                userLoggedInStatus(api, defaultHomepage);
            });
        });
    },
};
