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

                const buttonLabel = I18n.t(themePrefix("topic.create_ticket_label"), {
                    defaultValue: 'Create Service Ticket'
                });

                // Create the button content with SVG icon and text
                serviceButton.innerHTML = `
                    <svg class="fa d-icon d-icon-plus svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                        <use href="#plus"></use>
                    </svg>
                    <span class="d-button-label">${buttonLabel}</span>
                `;

                // Add click handler
                serviceButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const topicId = topic.id;
                    
                    let serviceTicketLink = `https://service.qnap.com/go/user/create-ticket/community?topic_id=${topicId}`;

                    if (domain !== "https://community.qnap.com") {
                        serviceTicketLink = `https://stage-service.qnap.com/go/user/create-ticket/community?topic_id=${topicId}`;
                    }

                    window.open(serviceTicketLink, '_blank');
                    console.log('Service ticket button clicked for topic:', topic.title);
                });

                footerButtons.appendChild(serviceButton);
            }
        }, 500);
    }
};

export {userLoggedInStatus, addServiceTicketButtonToTopic};