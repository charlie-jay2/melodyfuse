document.addEventListener('DOMContentLoaded', () => {
    // Fetch the schedule on page load
    fetchSchedule();

    // Initialize the date picker with the correct dates
    updateDateOptions();

    document.getElementById('staff-schedule-form').addEventListener('submit', handleFormSubmit);
});

const schedule = {
    "31/08/2024": {
        "00:00": "AUTO DJ",
        "01:00": "AUTO DJ",
        // Add other time slots
    },
    "01/09/2024": {
        "00:00": "AUTO DJ",
        "01:00": "AUTO DJ",
        // Add other time slots
    }
};

// Fetch the schedule from the server
function fetchSchedule() {
    fetch('/api/get-schedule')
        .then(response => response.json())
        .then(data => {
            Object.assign(schedule, data);
            updateScheduleTable();
        })
        .catch(error => console.error('Error fetching schedule:', error));
}

// Update the schedule table in the UI
function updateScheduleTable() {
    const table = document.getElementById('schedule-table');
    if (!table) return;

    let html = '<thead><tr><th>Date</th><th>Time</th><th>DJ</th></tr></thead><tbody>';

    Object.keys(schedule).forEach(date => {
        const times = schedule[date];
        Object.keys(times).forEach(time => {
            html += `<tr>
          <td>${date}</td>
          <td>${time}</td>
          <td>${times[time]}</td>
        </tr>`;
        });
    });

    html += '</tbody>';
    table.innerHTML = html;
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const djName = document.getElementById('dj-name').value;
    const timeSlot = document.getElementById('time-slot').value;

    if (!date || !djName || !timeSlot) {
        document.getElementById('form-response').innerText = 'Please fill out all fields.';
        return;
    }

    // Overwrite or add new slot in the schedule
    if (!schedule[date]) {
        schedule[date] = {};
    }

    schedule[date][timeSlot] = djName;

    updateScheduleTable();

    // Optionally, send the updated schedule to the server
    fetch('/api/update-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('form-response').innerText = 'Schedule updated successfully.';
        })
        .catch(error => {
            document.getElementById('form-response').innerText = 'Error updating schedule.';
            console.error('Error updating schedule:', error);
        });
}

// Filter available dates based on the current week and the next day's availability
function updateDateOptions() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday of the current week

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday of the current week

    const nextWeekStart = new Date(endOfWeek);
    nextWeekStart.setDate(endOfWeek.getDate() + 1); // First day of the next week

    const dateInput = document.getElementById('date');
    const options = [];

    // Collect dates for the current week
    for (let date = new Date(startOfWeek); date <= endOfWeek; date.setDate(date.getDate() + 1)) {
        options.push(formatDate(date));
    }

    // Add the first day of the next week
    options.push(formatDate(nextWeekStart));

    // Set the date options in the form
    dateInput.innerHTML = '';
    options.forEach(date => {
        dateInput.innerHTML += `<option value="${date}">${date}</option>`;
    });
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
