import { withPluginApi } from "discourse/lib/plugin-api";
import { userLoggedInStatus } from "discourse/utilis";

export default {
    name: "active-account",
    initialize() {
        withPluginApi("0.8.18", (api) => {
            api.onPageChange(() => {
                userLoggedInStatus();
                console.log("open Page changed");
            });
            api.onAppEvent("composer:opened", () => {
                userLoggedInStatus();
                console.log("Composer opened");
            });
        });
    },
};
