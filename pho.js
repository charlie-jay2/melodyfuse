document.addEventListener("DOMContentLoaded", () => {
    const promotionForm = document.getElementById('promotion-form');
    const imageUploadInput = document.getElementById('image-upload');
    const responseMessage = document.getElementById('response-message');

    // Add an event listener to check the number of files selected
    imageUploadInput.addEventListener('change', (event) => {
        const files = event.target.files;

        if (files.length > 5) {
            responseMessage.textContent = 'Sorry, you can only upload up to 5 images.';
            imageUploadInput.value = ''; // Reset the input to remove the selected files
        } else {
            responseMessage.textContent = ''; // Clear the message if the file count is valid
        }
    });

    promotionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        responseMessage.textContent = 'Submitting...';

        const formData = new FormData(promotionForm);
        const files = Array.from(imageUploadInput.files).slice(0, 5); // Limit to 5 files

        // Clear the images in formData and re-append the limited number of files
        formData.delete('image-upload');
        files.forEach((file, index) => {
            formData.append(`file${index + 1}`, file); // Add each file with a unique name
        });

        // Construct the embed payload
        const payload = {
            embeds: [
                {
                    title: "Promotion Request",
                    description: `**Name of Sender:** ${formData.get('sender-name')}\n**Name of Business:** ${formData.get('business-name')}\n**Description of Business:** ${formData.get('business-description')}\n**Promotion Send Off Text:** ${formData.get('promotion-text')}`,
                    color: 5814783 // Optional: Change to a color code you like (in decimal)
                }
            ]
        };

        // Append the payload to FormData as a JSON string
        formData.append('payload_json', JSON.stringify(payload));

        try {
            const response = await fetch('https://discord.com/api/webhooks/1279275491777450015/gcnxsIThv6RHn48JL2bbBA2ybzDA7VXu-CKe8JNpEBqTL11EtaQ6g-vH9cIxptWOv5vB', {
                method: 'POST',
                body: formData // Send FormData directly, including files and payload_json
            });

            if (response.ok) {
                responseMessage.textContent = 'Your promotion request has been submitted successfully!';
                promotionForm.reset();
            } else {
                responseMessage.textContent = 'Failed to submit your request. Please try again later.';
            }
        } catch (error) {
            responseMessage.textContent = 'An error occurred. Please try again later.';
            console.error('Error:', error);
        }
    });
});
