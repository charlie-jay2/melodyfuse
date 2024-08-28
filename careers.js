document.addEventListener("DOMContentLoaded", () => {
    const jobs = [
        {
            title: "Radio Presenter",
            description: "We are looking for an energetic and creative Radio Presenter to join our team.",
            deadline: "2024-08-29T23:59:59",
            webhook: "https://discord.com/api/webhooks/your_webhook_url_1"
        },
        {
            title: "Technician",
            description: "Join our technical team to ensure our broadcasts run smoothly.",
            deadline: "2024-10-15T23:59:59",
            webhook: "https://discord.com/api/webhooks/your_webhook_url_2"
        }
    ];

    const jobListingsContainer = document.getElementById("job-listings");

    jobs.forEach((job, index) => {
        const jobElement = document.createElement("div");
        jobElement.className = "job-listing";

        const jobTitle = document.createElement("h3");
        jobTitle.textContent = job.title;

        const jobDescription = document.createElement("p");
        jobDescription.textContent = job.description;

        const applyButton = document.createElement("button");
        applyButton.className = "apply-btn";
        applyButton.textContent = "Apply Now";
        applyButton.dataset.index = index;

        const deadlineDate = new Date(job.deadline);
        const now = new Date();

        if (now > deadlineDate) {
            applyButton.textContent = "Deadline Passed";
            applyButton.disabled = true;
        }

        applyButton.addEventListener("click", () => openForm(job));

        jobElement.appendChild(jobTitle);
        jobElement.appendChild(jobDescription);
        jobElement.appendChild(applyButton);
        jobListingsContainer.appendChild(jobElement);
    });

    const popupOverlay = document.getElementById("popup-overlay");
    const closeFormBtn = document.getElementById("close-form-btn");
    const applicationForm = document.getElementById("application-form");
    const webhookUrlInput = document.getElementById("webhook-url");
    const formResponse = document.getElementById("form-response");

    closeFormBtn.addEventListener("click", () => {
        popupOverlay.style.display = "none";
        formResponse.textContent = "";
    });

    applicationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(applicationForm);
        const webhookUrl = formData.get("webhook-url");
        const payload = {
            content: `**New Application Submitted**\n**Name:** ${formData.get("name")}\n**Email:** ${formData.get("email")}\n**Message:** ${formData.get("message")}`
        };

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                formResponse.textContent = "Application submitted successfully!";
                applicationForm.reset();
            } else {
                formResponse.textContent = "There was an error submitting your application.";
            }
        } catch (error) {
            formResponse.textContent = "There was an error submitting your application.";
        }
    });

    function openForm(job) {
        document.getElementById("form-title").textContent = `Apply for ${job.title}`;
        webhookUrlInput.value = job.webhook;
        popupOverlay.style.display = "flex";
    }
});
