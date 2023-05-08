export function trackingEvent(eventName: string, eventParams: object) {
    const firebaseConfig = {
        apiKey: "AIzaSyASHEpnJyE2HpN56UwlkrKsJ_wiYh6_3uc",
        authDomain: "peemaster-42f04.firebaseapp.com",
        projectId: "peemaster-42f04",
        storageBucket: "peemaster-42f04.appspot.com",
        messagingSenderId: "811538994397",
        appId: "1:811538994397:web:6400bdc2c98258febe7734",
        measurementId: "G-WXZ8PEHLBT"
    };

    firebaseLib.trackingEvent(firebaseConfig, eventName, eventParams);
}