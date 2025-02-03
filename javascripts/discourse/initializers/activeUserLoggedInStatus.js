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
            api.modifyClass("controller:composer", {
                actions: {
                    send() {
                        this._super(...arguments);
                        userLoggedInStatus(api);
                        console.log("composer:sent");
                    }
                }
            });
        });
    },
};
