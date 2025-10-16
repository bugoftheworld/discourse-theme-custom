import Component from '@ember/component';

export default class MaintenanceNotificationBar extends Component {
    didInsertElement() {
        this._super(...arguments);
        const maintenanceNotificationBar = document.getElementById('maintenanceNotificationBar');
        const endTime = parseInt(maintenanceNotificationBar.getAttribute('data-end-time'), 10);
        const durationTime = parseInt(maintenanceNotificationBar.getAttribute('data-duration-time'), 10);
        const currentTime = new Date().getTime();
        console.log('Current Time:', currentTime);
        if (currentTime > endTime) {
            console.log('Maintenance period has ended. Hiding notification bar.');
            maintenanceNotificationBar.style.display = 'none';
        } else {
            console.log('Maintenance period is ongoing. Showing notification bar.');
            setTimeout(() => {
                maintenanceNotificationBar.style.transition = 'opacity .3s';
                maintenanceNotificationBar.style.opacity = '0';
                setTimeout(() => {
                    maintenanceNotificationBar.style.display = 'none';
                }, 300);
            }, durationTime);
        }
    }
}