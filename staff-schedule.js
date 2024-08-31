document.addEventListener('DOMContentLoaded', () => {
    // Populate date and time slot options
    populateDateOptions();
    populateTimeOptions();

    document.getElementById('schedule-form').addEventListener('submit', handleFormSubmit);
});

function populateDateOptions() {
    const dateSelect = document.getElementById('date');
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the current week

    for (let i = 0; i < 8; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const option = document.createElement('option');
        option.value = formatDate(date);
        option.textContent = formatDate(date);
        dateSelect.appendChild(option);
    }
}

function populateTimeOptions() {
    const timeSelect = document.getElementById('time-slot');
    const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

    hours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        timeSelect.appendChild(option);
    });
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const timeSlot = document.getElementById('time-slot').value;
    const djName = document.getElementById('dj-name').value;

    fetch('/.netlify/functions/update-schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, timeSlot, djName })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('form-response').textContent = 'Schedule updated successfully!';
            } else {
                document.getElementById('form-response').textContent = 'Failed to update schedule.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('form-response').textContent = 'An error occurred.';
        });
}
