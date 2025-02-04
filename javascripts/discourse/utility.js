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
            const CURRENTUSER = api.getCurrentUser();
            console.log(CURRENTUSER);
            if (data.status === "connected") {
                // User is logged in
            } else {

                if (CURRENTUSER) {
                    CURRENTUSER.destroySession();
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export {userLoggedInStatus};