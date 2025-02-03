const userLoggedInStatus = (api) => {
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
            if (data.status !== "connected") {
                const CURRENTUSER = api.getCurrentUser();
                if (CURRENTUSER) {
                    CURRENTUSER.destroySession();
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export { userLoggedInStatus };