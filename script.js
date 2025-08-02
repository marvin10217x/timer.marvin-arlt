// Warten, bis das HTML-Dokument vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {

    // HTML-Elemente abrufen
    const orderInput = document.getElementById('order');
    const minRangeInput = document.getElementById('minimum_range');
    const maxRangeInput = document.getElementById('maximum_range');
    const durationInput = document.getElementById('duration');
    const repetitionsInput = document.getElementById('repetitions');
    const breakInput = document.getElementById('break');
    const startButton = document.getElementById('startButton');
    const statusDisplay = document.getElementById('status');

    let roundTimeout;
    let commandTimeout;
    let isRunning = false;

    // Funktion zur Sprachausgabe
    function speak(text) {
        // Prüfen, ob die Sprachsynthese-API verfügbar ist
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE'; // Sprache auf Deutsch setzen
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Dein Browser unterstützt die Sprachsynthese nicht.");
        }
    }

    // Funktion zum Starten des gesamten Trainings
    startButton.addEventListener('click', () => {
        if (isRunning) return;

        const minRange = parseInt(minRangeInput.value, 10);
        const maxRange = parseInt(maxRangeInput.value, 10);
        const repetitions = parseInt(repetitionsInput.value, 10);

        // Validierung: "mindestens" muss kleiner als "maximal" sein
        if (minRange >= maxRange) {
            alert("Der 'Minimale'-Wert muss kleiner als der 'Maximale'-Wert sein.");
            return;
        }

        isRunning = true;
        startButton.disabled = true;
        statusDisplay.textContent = "Training startet...";

        startRound(1, repetitions);
    });

    // Funktion zum Starten einer Runde
    function startRound(currentRound, totalRounds) {
        if (currentRound > totalRounds) {
            statusDisplay.textContent = "Training beendet!";
            speak("Training beendet.");
            isRunning = false;
            startButton.disabled = false;
            return;
        }

        statusDisplay.textContent = `Runde ${currentRound} von ${totalRounds} beginnt in 10 Sekunden.`;

        // 10 Sekunden Countdown vor der Runde
        setTimeout(() => {
            speak("Start");
            statusDisplay.textContent = `Runde ${currentRound}`;

            const duration = parseInt(durationInput.value, 10) * 1000;

            // Startet die zufälligen Befehle
            scheduleNextCommand();

            // Stoppt die Runde nach der festgelegten Dauer
            roundTimeout = setTimeout(() => {
                clearTimeout(commandTimeout); // Stoppt den nächsten geplanten Befehl
                speak("Stop");
                statusDisplay.textContent = "Pause";

                // Startet die Pause
                const breakTime = parseInt(breakInput.value, 10) * 1000;
                setTimeout(() => {
                    startRound(currentRound + 1, totalRounds);
                }, breakTime);

            }, duration);

        }, 10000); // 10 Sekunden Wartezeit
    }

    // Funktion, die den nächsten zufälligen Befehl plant und ausführt
    function scheduleNextCommand() {
        const commands = orderInput.value.split(',').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
        if (commands.length === 0) return;

        const minSeconds = parseInt(minRangeInput.value, 10);
        const maxSeconds = parseInt(maxRangeInput.value, 10);

        // Zufällige Zeit im Intervall berechnen
        const randomTime = (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;

        commandTimeout = setTimeout(() => {
            // Zufälligen Befehl auswählen
            const randomCommand = commands[Math.floor(Math.random() * commands.length)];
            speak(randomCommand);

            // Den nächsten Befehl planen
            scheduleNextCommand();
        }, randomTime);
    }
});