document.addEventListener("DOMContentLoaded", () => {
    const jobs = [
        {
            title: "Radio Presenter",
            description: "We are looking for an energetic and creative Radio Presenter to join our team.",
            deadline: "2024-09-20T13:00:00",
            webhook: "https://discord.com/api/webhooks/1278494253437419570/0DvmJcOfaqqNUP-PQus0IXWtaCYpBD2iTGjXiq6f2QzI9L_GD_4-zPQuVf1vYY59hzSm"
        },
        {
            title: "Technician",
            description: "Join our technical team to ensure our broadcasts run smoothly.",
            deadline: "2024-9-20T13:00:00",
            webhook: "https://discord.com/api/webhooks/1278494253437419570/0DvmJcOfaqqNUP-PQus0IXWtaCYpBD2iTGjXiq6f2QzI9L_GD_4-zPQuVf1vYY59hzSm"
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
    let currentJobTitle = "";

    closeFormBtn.addEventListener("click", () => {
        popupOverlay.style.display = "none";
        formResponse.textContent = "";
    });

    applicationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(applicationForm);
        const webhookUrl = formData.get("webhook-url");
        const payload = {
            embeds: [
                {
                    title: `New Application for ${currentJobTitle}`,
                    description: `**Name:** ${formData.get("name")}\n**Email:** ${formData.get("email")}\n**Message:** ${formData.get("message")}`,
                    color: 5814783 // Optional: Change to a color code you like (in decimal)
                }
            ]
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
        currentJobTitle = job.title;
        popupOverlay.style.display = "flex";
    }
});
