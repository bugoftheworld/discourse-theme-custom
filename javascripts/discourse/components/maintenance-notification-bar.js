import Component from '@ember/component';

export default class MaintenanceNotificationBar extends Component {
    didInsertElement() {
        this._super(...arguments);
        const maintenanceNotificationBar = document.getElementById('maintenanceNotificationBar');
        const endTime = parseInt(maintenanceNotificationBar.getAttribute('data-end-time'), 10);
        const durationTime = parseInt(maintenanceNotificationBar.getAttribute('data-duration-time'), 10);
        const currentTime = new Date().getTime();
        if (currentTime > endTime) {
            maintenanceNotificationBar.style.display = 'none';
        } else {
            console.log('Maintenance Notification Bar is visible',durationTime);
            setTimeout(() => {
                console.log('Maintenance Notification Bar is hidden');
                maintenanceNotificationBar.style.transition = 'opacity .3s';
                maintenanceNotificationBar.style.opacity = '0';
                maintenanceNotificationBar.style.display = 'none';
            }, durationTime );
        }
    }
}