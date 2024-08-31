document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('schedule-form');
    const responseMessage = document.getElementById('response-message');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            date: formData.get('date'),
            time: formData.get('time'),
            djName: formData.get('djName'),
        };

        try {
            const response = await fetch('/netlify/functions/update-schedule.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            responseMessage.textContent = result.message;
            responseMessage.style.color = response.ok ? 'green' : 'red';

        } catch (error) {
            responseMessage.textContent = 'An error occurred.';
            responseMessage.style.color = 'red';
        }
    });
});
