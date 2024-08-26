document.addEventListener('DOMContentLoaded', function () {
    // Example schedule data
    const scheduleData = {
        '26/08/2024': {
            // Example '00:00': 'AutoDJ',
        },
        '27/08/2024': {
            // Example '00:00': 'AutoDJ',
        },
        '28/08/2024': {
            // Example '00:00': 'AutoDJ',
        },
        '29/08/2024': {
            // Example '00:00': 'AutoDJ',
        },
        '20/08/2024': {
            // Example '00:00': 'AutoDJ',
        },
        '31/08/2024': {
            // Example '00:00': 'AutoDJ',
        },
        '01/09/2024': {
            // Example '00:00': 'AutoDJ',
        },
    };

    const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']; // List of hours
    const dates = Object.keys(scheduleData); // List of dates

    const headerRow = document.querySelector('#header-row');
    const tableBody = document.querySelector('#schedule-table tbody');

    // Create header with dates
    dates.forEach(date => {
        const th = document.createElement('th');
        th.textContent = date;
        headerRow.appendChild(th);
    });

    // Create rows for hours and populate with DJs
    hours.forEach(hour => {
        const tr = document.createElement('tr');
        const tdHour = document.createElement('td');
        tdHour.textContent = hour;
        tr.appendChild(tdHour);

        dates.forEach(date => {
            const td = document.createElement('td');
            td.textContent = scheduleData[date][hour] || 'AutoDJ'; // Fallback to AutoDJ
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
});
