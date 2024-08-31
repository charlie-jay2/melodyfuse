document.getElementById('promotion-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const responseMessage = document.getElementById('response-message');
    responseMessage.textContent = 'Submitting...';

    // Prepare form data
    const formContent = {
        content: `Promotion Request:\n\nName of Sender: ${formData.get('sender-name')}\nName of Business: ${formData.get('business-name')}\nDescription of Business: ${formData.get('business-description')}\nPromotion Send Off Text: ${formData.get('promotion-text')}`
    };

    // Convert images to base64 and append to formContent if any
    const files = formData.getAll('image-upload');
    if (files.length > 0) {
        const imagePromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(images => {
            formContent.embeds = images.map(image => ({
                image: {
                    url: image
                }
            }));

            fetch('https://discord.com/api/webhooks/1279275491777450015/gcnxsIThv6RHn48JL2bbBA2ybzDA7VXu-CKe8JNpEBqTL11EtaQ6g-vH9cIxptWOv5vB', {
                method: 'POST',
                body: JSON.stringify(formContent),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        responseMessage.textContent = 'Your promotion request has been submitted successfully!';
                    } else {
                        responseMessage.textContent = 'Failed to submit your request. Please try again later.';
                    }
                })
                .catch(error => {
                    responseMessage.textContent = 'An error occurred. Please try again later.';
                    console.error('Error:', error);
                });
        }).catch(error => {
            responseMessage.textContent = 'An error occurred with image processing. Please try again later.';
            console.error('Image Error:', error);
        });
    } else {
        fetch('https://discord.com/api/webhooks/1279275491777450015/gcnxsIThv6RHn48JL2bbBA2ybzDA7VXu-CKe8JNpEBqTL11EtaQ6g-vH9cIxptWOv5vB', {
            method: 'POST',
            body: JSON.stringify(formContent),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    responseMessage.textContent = 'Your promotion request has been submitted successfully!';
                } else {
                    responseMessage.textContent = 'Failed to submit your request. Please try again later.';
                }
            })
            .catch(error => {
                responseMessage.textContent = 'An error occurred. Please try again later.';
                console.error('Error:', error);
            });
    }
});
