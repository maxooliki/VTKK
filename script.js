// Подключение к Firebase Realtime Database
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// Получение данных из базы
db.ref('events').on('value', (snapshot) => {
    const events = snapshot.val();
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';
    Object.keys(events).forEach(year => {
        const eventHTML = `
            <div class="event">
                <span>${year}:</span> ${events[year].join(', ')}
            </div>
        `;
        eventsContainer.insertAdjacentHTML('beforeend', eventHTML);
    });
});

// Добавление или обновление данных
const addEventForm = document.getElementById('add-event-form');
addEventForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const year = document.getElementById('year').value;
    const eventsInput = document.getElementById('events').value;
    const eventsList = eventsInput.split(',').map(event => event.trim());

    db.ref('events/' + year).set(eventsList);
    window.location.reload();
});
