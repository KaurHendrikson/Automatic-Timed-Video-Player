const $cd = document.getElementById('countdown');
const $vp = document.getElementById('player');

let mode = -1;
let nextVideo = undefined;
let curVideo = undefined;

function findNextVideo() {
    nextVideo = undefined;
    videos.sort((a, b) => b.time - a.time);

    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        if ((nextVideo == undefined || video.time < nextVideo.time) && video.time > new Date())
            nextVideo = video;
    }

}


const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;
let timer;

function updateCountdown() {
    if (nextVideo == undefined) return;

    var now = new Date();
    var distance = nextVideo.time - now;
    if (distance < 0) {

        playCurrentVideo();

        return;
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    $cd.innerHTML = '';
    if (days) $cd.innerHTML += days + 'p ';
    if (hours) $cd.innerHTML += hours + 'h ';
    $cd.innerHTML += minutes.toString().padStart(2, 0) + 'm ';
    $cd.innerHTML += seconds.toString().padStart(2, 0) + 's';
}

function playCurrentVideo() {
    if (curVideo == nextVideo) return;

    $vp.setAttribute('src', nextVideo.path);

    $vp.load();
    $vp.classList.remove('hidden');

    curVideo = nextVideo;
}

function initNormalLoop() {
    findNextVideo();
    setInterval(updateCountdown, 1000);

    $cd.innerHTML = '';

    $vp.classList.add('hidden');

    $vp.oncanplay = () => {
        $vp.play();
        $cd.innerHTML = '';
    }

    $vp.onended = () => {
        $vp.classList.add('hidden');
        findNextVideo();
    }
}

// Checking videos for errors
let checkErrors = [];
let checkIndex = -1;

$vp.error = () => {
    errors.push(curVideo);
}

$vp.oncanplay = () => {
    checkNextVideo();
}

document.onkeypress = function(e) {
    e = e || window.event;
    if (e.code == 'Space') {
        checkNextVideo();
        $cd.innerHTML = '';
    }
};

function checkNextVideo() {
    checkIndex++;
    if (checkIndex >= videos.length) {
        $cd.innerHTML = `Checking ${checkIndex}/${videos.length}`;
        console.log(`${checkIndex} videos checked, ${checkErrors.length} errors found.`);
        if (checkErrors.length == 0) initNormalLoop();
        else listCheckErrors();
        return;
    }

    $vp.setAttribute('src', videos[checkIndex].path);
    $vp.load();
}

function listCheckErrors() {
    $cd.innerHTML = 'Errors:\n';
    for (let i = 0; i < checkErrors.length; i++) {
        $cd.innerHTML += `${checkErrors[i].path}\n`;

    }
}