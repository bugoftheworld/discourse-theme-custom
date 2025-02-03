import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "../utilis";

export default {
    name: "activeUserLoggedInStatus",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            api.onPageChange(() => {
                userLoggedInStatus(api);
                console.log("open Page changed");
            });
            api.onAppEvent("postComposer:replied", (post) => {
                userLoggedInStatus(api);
                console.log("User replied to a post:", post);
            });
        });
    },
};
