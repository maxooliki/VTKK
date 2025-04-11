document.addEventListener('DOMContentLoaded', function() {
    fetch('getEvents.php')
        .then(response => response.json())
        .then(events => {
            const eventsContainer = document.getElementById('events-container');
            Object.keys(events).forEach(year => {
                const eventHTML = `
                    <div class="event">
                        <span>${year}:</span> ${events[year].join(', ')}
                    </div>
                `;
                eventsContainer.insertAdjacentHTML('beforeend', eventHTML);
            });
        });

    const addEventForm = document.getElementById('add-event-form');
    addEventForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const year = document.getElementById('year').value;
        const eventsInput = document.getElementById('events').value;
        const eventsList = eventsInput.split(',').map(event => event.trim());

        fetch('updateEvent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ year, events: eventsList })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        });
    });
});
