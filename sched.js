document.addEventListener('DOMContentLoaded', function () {
    const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

    // Function to get the next 7 days starting from today
    function getNext7Days() {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            const formattedDate = futureDate.toLocaleDateString('en-GB'); // Format: dd/mm/yyyy
            dates.push(formattedDate);
        }
        return dates;
    }

    const dates = getNext7Days(); // Get the next 7 days

    const scheduleData = dates.reduce((acc, date) => {
        acc[date] = {}; // Initialize empty object for each date
        return acc;
    }, {});

    // Check if the schedule table is present (for schedule.html)
    const headerRow = document.querySelector('#header-row');
    const tableBody = document.querySelector('#schedule-table tbody');

    if (headerRow && tableBody) {
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
    }

    // Determine current date and hour
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-GB'); // Format: dd/mm/yyyy
    const currentHour = now.getHours().toString().padStart(2, '0') + ':00'; // Format: hh:00

    // Find the current DJ or fallback to 'AutoDJ'
    const currentDJ = scheduleData[currentDate] && scheduleData[currentDate][currentHour] || 'AutoDJ';

    // Update the "Currently Hosting:" section (for index.html)
    const currentDjElement = document.getElementById('current-dj');
    if (currentDjElement) {
        currentDjElement.textContent = currentDJ;
    }

    // Populate staff-schedule.html form if present
    const dateSelect = document.getElementById('show-date');
    const timeSelect = document.getElementById('show-time');

    if (dateSelect && timeSelect) {
        // Populate the date dropdown
        dates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateSelect.appendChild(option);
        });

        // Populate the time dropdown
        hours.forEach(hour => {
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = hour;
            timeSelect.appendChild(option);
        });

        // Form submission handler
        document.getElementById('schedule-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const showDate = dateSelect.value;
            const showTime = timeSelect.value;
            const djName = document.getElementById('dj-name').value;

            // Send data to Netlify serverless function
            fetch('/.netlify/functions/add-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ showDate, showTime, djName })
            })
                .then(response => response.json())
                .then(data => {
                    const formStatus = document.getElementById('form-status');
                    if (data.success) {
                        formStatus.textContent = 'Schedule successfully updated!';
                    } else {
                        formStatus.textContent = 'Error updating schedule.';
                    }
                })
                .catch(error => {
                    document.getElementById('form-status').textContent = 'Error submitting form.';
                });
        });
    }
});
