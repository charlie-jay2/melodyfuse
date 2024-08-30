document.addEventListener('DOMContentLoaded', function () {
    // Function to get the dates for the current week and the first day of the next week
    function getWeekDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const dates = [];

        // Set to Friday (31/08/2024) if today is before that
        const startOfWeek = new Date(today);
        if (dayOfWeek <= 5) {
            startOfWeek.setDate(today.getDate() - dayOfWeek + 5);
        } else {
            startOfWeek.setDate(today.getDate() + (7 - dayOfWeek + 5));
        }

        // Add current week dates (Friday and Saturday)
        for (let i = 0; i < 2; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date.toLocaleDateString('en-GB'));
        }

        // Add the first day of the next week (next Friday)
        const nextWeekStart = new Date(startOfWeek);
        nextWeekStart.setDate(startOfWeek.getDate() + 7);
        dates.push(nextWeekStart.toLocaleDateString('en-GB'));

        return dates;
    }

    const hours = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ]; // List of hours

    let dates = getWeekDates(); // Get the relevant dates for the current and next week

    // Schedule data (initialized to 'AutoDJ')
    const scheduleData = {};
    dates.forEach(date => {
        scheduleData[date] = {};
        hours.forEach(hour => {
            scheduleData[date][hour] = 'AutoDJ';
        });
    });

    // Function to update the staff schedule form
    function updateStaffScheduleForm() {
        const dateSelect = document.getElementById('date');
        dateSelect.innerHTML = ''; // Clear existing options

        dates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateSelect.appendChild(option);
        });
    }

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

    // Determine current date and hour (in UK time)
    const now = new Date();
    const ukTime = new Date(now.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
    const currentDate = ukTime.toLocaleDateString('en-GB'); // Format: dd/mm/yyyy
    const currentHour = ukTime.getHours().toString().padStart(2, '0') + ':00'; // Format: hh:00

    // Find the current DJ or fallback to 'AutoDJ'
    const currentDJ = scheduleData[currentDate] && scheduleData[currentDate][currentHour] || 'AutoDJ';

    // Update the "Currently Hosting:" section (for index.html)
    const currentDjElement = document.getElementById('current-dj');
    if (currentDjElement) {
        currentDjElement.textContent = currentDJ;
    }

    // Update the staff-schedule form with the available dates
    updateStaffScheduleForm();

    // Handle form submission (for staff-schedule.html)
    const staffScheduleForm = document.getElementById('staff-schedule-form');
    if (staffScheduleForm) {
        staffScheduleForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const date = document.getElementById('date').value;
            const djName = document.getElementById('dj-name').value;
            const timeSlot = document.getElementById('time-slot').value;

            // Check if the time slot is already taken
            if (scheduleData[date][timeSlot] === 'AutoDJ') {
                scheduleData[date][timeSlot] = djName;
                document.getElementById('form-response').textContent = `Scheduled ${djName} for ${date} at ${timeSlot}`;
                document.getElementById('form-response').style.color = 'green';
            } else {
                document.getElementById('form-response').textContent = `Time slot already taken by ${scheduleData[date][timeSlot]}`;
                document.getElementById('form-response').style.color = 'red';
            }
        });
    }

    // Remove past dates and reset for the next week
    function resetWeeklySchedule() {
        const today = new Date().toLocaleDateString('en-GB');
        dates = dates.filter(date => date >= today);

        if (dates.length === 0) {
            dates = getWeekDates();
            updateStaffScheduleForm();
        }
    }

    // Run the reset function once on load
    resetWeeklySchedule();
});
