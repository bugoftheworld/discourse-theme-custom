import Component from '@ember/component';

export default class MaintenanceNotificationBar extends Component {
    didInsertElement() {
        this._super(...arguments);
        const maintenanceNotificationBar = document.getElementById('maintenanceNotificationBar');
        const endTime = parseInt(maintenanceNotificationBar.getAttribute('data-end-time'), 10);
        const durationTime = parseInt(maintenanceNotificationBar.getAttribute('data-duration-time'), 10);
        const currentTime = new Date().getTime();
        if (currentTime > endTime) {
            console.log('Maintenance Notification Bar is inactive');
            maintenanceNotificationBar.style.display = 'none';
        } else {
            console.log('Maintenance Notification Bar is active');
            const fadeOutTime = Math.min(durationTime , 300);
            setTimeout(() => {
                maintenanceNotificationBar.style.transition = 'opacity 1s';
                maintenanceNotificationBar.style.opacity = '0';
            }, durationTime - fadeOutTime);
        }
    }
}