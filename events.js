document.addEventListener('DOMContentLoaded', function () {
    // Example event data
    const eventsData = {
        '26/08/2024': '',
        '27/08/2024': '',
        '28/08/2024': '',
        '29/08/2024': '',
        '30/08/2024': '',
        '31/08/2024': '',
        '01/09/2024': ''
    };

    const tableBody = document.querySelector('#events-table tbody');

    // Populate the table with event data
    Object.keys(eventsData).forEach(date => {
        const tr = document.createElement('tr');
        const tdDate = document.createElement('td');
        tdDate.textContent = date;
        const tdEvent = document.createElement('td');
        tdEvent.textContent = eventsData[date];
        tdEvent.textContent = eventsData[date] || 'No Event'; // Fallback to AutoDJ
        tr.appendChild(tdDate);
        tr.appendChild(tdEvent);
        tableBody.appendChild(tr);
    });
});
