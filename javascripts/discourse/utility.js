const userLoggedInStatus = (api, isHomepage) => {
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
            if (data.status === "connected") {
                // User is logged in
                if (isHomepage && document.getElementById('adduser')) {
                    document.getElementById('adduser').style.display = 'none';
                }
            } else {
                if (CURRENTUSER && window.location.origin === "https://community.qnap.com") {
                    CURRENTUSER.destroySession();
                }
                if (isHomepage && document.getElementById('adduser')) {
                    document.getElementById('adduser').style.display = 'block';
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export { userLoggedInStatus };