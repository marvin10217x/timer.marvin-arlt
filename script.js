//Warten bis das Dokument vollständig geladen ist
document.addEventListener ( 'DOMContentLoaded', () => {

    //HTML Elemente abrufen
    const orderInput = document.getElementById ( 'order' );
    const minRangeInput = document.getElementById ( 'minimum_range' );
    const maxRangeInput = document.getElementById ( 'maximum_range' )
    const durationInput = document.getElementById ( 'duration' )
    const repetitionInput = document.getElementById ( 'repetitions' )
    const breakInput = document.getElementById ( 'break' )
    const startButton = document.getElementById ( 'startButton' )
    const statusDisplay = document.getElementById ( 'status' );

    let roundTimeout;
    let commandTimeout;
    let isRunning = false;

    //Funktion zur Sprachausgabe
    function speak( text )
    {
        //Check ob API verfügbar ist
        if ( 'speechSynthesis' in window )
        {
            const utterance = new SpeechSynthesisUtterance ( text );
            utterance.lang = "de-DE"; //Sprache auf Deutsch
            window.speechSynthesis.speak ( utterance );
        } else
        {
            console.error ( "Dein Browser unterstützt die Sprachsynthese nicht" );
        }
    }

    //Funktion zum Starten des Trainings
    startButton.addEventListener ( 'click', () => {
        if ( isRunning ) return;

        const minRange = parseInt ( minRangeInput.value, 10 );
        const maxRange = parseInt ( maxRangeInput.value, 10 );
        const repetitions = parseInt ( repetitionInput.value, 10 );

        //Validierung "min" ist kleiner als "max"
        if ( minRange >= maxRange )
        {
            alert ( "Der 'Minimale'-Wert muss kleiner sein als der 'Maximale'-Wert sein." );
            return;
        }

        isRunning = true;
        startButton.disabled = true;
        statusDisplay.textContent = "Training startet.. ";

        startRound ( 1, repetitions );
    });

    //Funktion zum starten der Runde
    function startRound( currentRound, totalRounds )
    {
        if ( currentRound > totalRounds )
        {
            statusDisplay.textContent = "Training beendet!";
            speak ( "Training beendet." );
            isRunning = false;
            startButton.disabled = false;
            return;
        }

        statusDisplay.textContent = `Runde ${ currentRound } von ${ totalRounds } beginnt in 10 Sekunden.`;

        //10 Sekunden Countdown vor der Runde
        setTimeout ( () => {
            speak ( "Start" );
            statusDisplay.textContent = `Runde ${ currentRound }`;

            const duration = parseInt ( durationInput.value, 10 );

            //Start der zufälligen Befehle
            scheduleNextCommand ();

            //Stoppt die Runde nach der festgelegten Dauer
            roundTimeout = setTimeout ( () => {
                clearTimeout ( commandTimeout ); //Stoppt den nächsten Befehl
                speak ( "Stop" );
                statusDisplay.textContent = "Pause";

                //Starte die Pause
                const breakTime = parseInt ( breakInput.value, 10 ) * 1000;
                setTimeout(() => {
                    startRound(currentRound + 1, totalRounds);
                }, breakTime);

            }, duration );

        }, 10000 ); //10 Sekunden Wartezeit
    }

    //Funktion die den nächsten Befehl plant
    function scheduleNextCommand() {
        const command = orderInput.value.split(',').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
        if (command.length === 0) return;

        const minSeconds = parseInt(minRangeInput.value, 10);
        const maxSeconds = parseInt(maxRangeInput.value, 10);

        //Zufällige Zeit im Intervall ermitteln
        const randomTime = (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;

        commandTimeout= setTimeout(() => {
            const randomCommand = commands[Math.floor(Math.random() * commands.length)];
            speak(randomCommand);

            //Nächster Befehl
            scheduleNextCommand();
        }, randomTime);
    }

});