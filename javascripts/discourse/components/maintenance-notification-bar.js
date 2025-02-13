import Component from '@ember/component';

export default class MaintenanceNotificationBar extends Component {
    didInsertElement() {
        this._super(...arguments);
        const maintenanceNotificationBar = document.getElementById('maintenanceNotificationBar');
        const endTime = maintenanceNotificationBar.getAttribute('data-end-time');
        const durationTime = maintenanceNotificationBar.getAttribute('data-duration-time');
        const currentTime = new Date().getTime();
        if (currentTime > endTime) {
            console.log('Maintenance Notification Bar is inactive', currentTime, endTime, currentTime > endTime);
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