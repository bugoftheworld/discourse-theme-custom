const userLoggedInStatus = (api, defaultHomepage) => {
    fetch('https://account.qnap.com/oauth/login_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            app_id: '668ce78379a25e1282cf47e2'
        }),
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            const CURRENTUSER = api.getCurrentUser();
            const getRouter = () => {
                return api.container.lookup("service:router");
            };

            const isHomepage = () => {
                const router = getRouter();
                if (!router) {
                    console.warn("Discourse router is not available.");
                    return false;
                }

                const { currentRouteName } = router;
                if (!currentRouteName) {
                    console.warn("Router is available but currentRouteName is undefined.");
                    return false;
                }

                const homeRoute =  `discovery.${defaultHomepage()}`;
                console.log("check--", currentRouteName === homeRoute);
                return currentRouteName === homeRoute;
            };

            if (data.status === "connected") {
                // User is logged in
                if (isHomepage() && document.getElementById('adduser')) {
                    document.getElementById('adduser').style.display = 'none';
                }
            } else {
                if (CURRENTUSER && window.location.origin === "https://community.qnap.com") {
                    CURRENTUSER.destroySession();
                }
                if (isHomepage() && document.getElementById('adduser')) {
                    document.getElementById('adduser').style.display = 'block';
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export { userLoggedInStatus };