import Component from '@ember/component';

export default class MaintenanceNotificationBar extends Component {
    didInsertElement() {
        this._super(...arguments);
        const maintenanceNotificationBar = document.getElementById('maintenanceNotificationBar');
        const endTime = maintenanceNotificationBar.getAttribute('data-end-time');
        const durationTime = maintenanceNotificationBar.getAttribute('data-duration-time');
        const currentTime = new Date().getTime();
        if (currentTime > endTime) {
            maintenanceNotificationBar.style.display = 'none';
        } else {
            console.log('Maintenance Notification Bar is active');
            setTimeout(() => {
                maintenanceNotificationBar.style.transition = 'opacity .3s';
                maintenanceNotificationBar.style.opacity = '0';
                maintenanceNotificationBar.style.display = 'none';
            }, durationTime );
        }
    }
}