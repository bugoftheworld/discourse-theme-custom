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

const addServiceTicketButtons = (topics) => {
    setTimeout(() => {
        document.querySelectorAll('.feature-list-latest--all tr').forEach((row, index) => {
            if (topics[index] && topics[index].tags && topics[index].tags.includes('service-ticket')) {
                // Check if button already exists to avoid duplicates
                if (!row.querySelector('.service-ticket-button')) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'service-ticket-button-container';
                    buttonContainer.style.cssText = 'margin-top: 8px;';
                    const serviceButton = document.createElement('a');
                    serviceButton.className = 'service-ticket-button btn btn-primary btn-small';
                    serviceButton.href = '#'; // Replace with your desired link
                    serviceButton.target = '_blank';
                    serviceButton.textContent = 'Create Service Ticket';
                    serviceButton.style.cssText = 'font-size: 12px; padding: 4px 8px; margin-left: 8px;';

                    // Add click handler
                    serviceButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Replace with your desired action
                        window.open('https://example.com/service-ticket', '_blank');
                        console.log('Service ticket button clicked for topic:', topics[index].title);
                    });

                    buttonContainer.appendChild(serviceButton);

                    // Find the best place to insert the button (after title or in a cell)
                    const titleCell = row.querySelector('.main-link');
                    if (titleCell) {
                        titleCell.appendChild(buttonContainer);
                    }
                }
            }
        });
    }, 500); // Wait for DOM to be fully rendered
}

export {userLoggedInStatus, addServiceTicketButtons};