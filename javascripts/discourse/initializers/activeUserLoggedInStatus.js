import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utility";

export default {
    name: "activeUserLoggedInStatus",
    initialize() {
        withPluginApi("0.8.7", (api) => {
            api.onPageChange(() => {
                userLoggedInStatus(api);
            });
            api.onAppEvent("post-stream:posted", () => {
                userLoggedInStatus(api);
            });
        });
    },
};
