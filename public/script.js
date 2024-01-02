const form = document.getElementById('scoreForm');
const projectScoreElement = document.getElementById('projectScore');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const projectName = document.getElementById('projectName').value;
    const projectCodeCheckedIn = document.getElementById('projectCode').value;
    const projectPurpose = document.getElementById('projectPurpose').value;
    const numberOfSlides = document.getElementById('numberOfSlides').value;
    const numberOfTests = document.getElementById('numberOfTests').value;

    const response = await fetch('/getScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            projectName,
            projectCodeCheckedIn,
            projectPurpose,
            numberOfSlides,
            numberOfTests,
        }),
    });

    const data = await response.json();
    projectScoreElement.textContent = `Project Score: ${data.assistantReply}`;
});
