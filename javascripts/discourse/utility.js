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
            if (data.status === "connected") {
                // User is logged in
            } else {
                if (CURRENTUSER && window.location.origin === "https://community.qnap.com") {
                    CURRENTUSER.destroySession();
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

const addServiceTicketButtonToTopic = (api) => {
    // Check if we're on a topic page
    const currentRoute = api.container.lookup("router:main").currentRouteName;
    if (!currentRoute || !currentRoute.includes('topic')) {
        return;
    }

    // Get current user and topic information
    const currentUser = api.getCurrentUser();
    const topicController = api.container.lookup("controller:topic");

    if (!currentUser || !topicController || !topicController.model) {
        return;
    }

    const topic = topicController.model;
    const isAuthor = currentUser.id === topic.user_id;

    // Only show button if current user is the topic author and topic has 'service-ticket' tag
    if (isAuthor && topic.tags && topic.tags.includes('service-ticket')) {
        setTimeout(() => {
            const footerButtons = document.querySelector('.topic-footer-main-buttons');

            if (footerButtons && !footerButtons.querySelector('.service-ticket-button')) {
                const serviceButton = document.createElement('button');
                serviceButton.className = 'service-ticket-button btn btn-primary';
                serviceButton.title = 'Create a service ticket for this topic';

                // Create icon element using Discourse's icon system
                const icon = document.createElement('svg');
                icon.className = 'fa d-icon d-icon-plus svg-icon svg-string';
                icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                const use = document.createElement('use');
                use.setAttribute('href', '#plus');
                icon.appendChild(use);

                // Create text span for responsive design
                const textSpan = document.createElement('span');
                textSpan.className = 'service-ticket-text';
                textSpan.textContent = 'Create Service Ticket';

                // Append icon and text to button
                serviceButton.appendChild(icon);
                serviceButton.appendChild(textSpan);

                // Add click handler
                serviceButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Replace with your desired action
                    window.open('https://example.com/service-ticket', '_blank');
                    console.log('Service ticket button clicked for topic:', topic.title);
                });

                footerButtons.appendChild(serviceButton);
            }
        }, 500);
    }
};

export {userLoggedInStatus, addServiceTicketButtonToTopic};