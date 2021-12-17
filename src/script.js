async function ready() {
    await init();
    checkLogin();
}

async function init() {
    await refreshToken();
    let query = new URLSearchParams(location.search);
    if (query.has('code')) {
        let code = query.get('code');
        let url = `https://www.strava.com/oauth/token?client_id=73183&client_secret=e62881db35857024ad910817f10103235b46a783&code=${code}&grant_type=authorization_code`; //not secure, this call should happen from the backend but for demonstration purposes.
        let response = await fetch(url, {
            method: 'POST'
        });
        if (response.ok) {
            let result = await response.json();
            localStorage.setItem('authentication', JSON.stringify(result));
        }
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    checkLogin();
    fetchActivities();
}

function checkLogin() {
    let authentication = localStorage.getItem('authentication');
    if (!authentication) {
        let login = document.querySelector('#login')
        if (login) {
            login.classList.remove('hidden');

        }
        let tracks = document.querySelector('#tracks');

        if (tracks) {
            tracks.classList.add('hidden');
        }
    }
}

async function fetchActivities() {
    let authentication = localStorage.getItem('authentication');
    if (authentication) {
        let jAuth = JSON.parse(authentication);
        let url = `https://www.strava.com/api/v3/athlete/activities`
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jAuth.access_token}`
            }
        });
        let result = await response.json();
        app.tracks = result;
        // result.forEach(element => {
        //     app.tracks.push({
        //         name: element.name,
        //         distance: element.distance,
        //         timezone: element.timezone
        //     })
        // });
    }
}

// Generate new access token, if old one is expired (moet normaal via backend)

async function refreshToken() {
    let authentication = localStorage.getItem('authentication');
    if (authentication) {
        let jAuth = JSON.parse(authentication);
        let now = Math.floor(Date.now() / 1000);
        if (jAuth.expires_at <= now) {
            let url = `https://www.strava.com/oauth/token?client_id=73183&client_secret=e62881db35857024ad910817f10103235b46a783&refresh_token=${jAuth.refresh_token}&grant_type=refresh_token`;
            let response = await fetch(url, {
                method: 'POST'
            });
            if (response.ok) {
                let result = await response.json();
                localStorage.setItem('authentication', JSON.stringify(result));
            }
        }

    }

}

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    ready();
} else {
    document.addEventListener("DOMContentLoaded", ready);
}

let app = new Vue({
    el: '#tracks',
    data: {
        tracks: [],
    },
    filters: {
        readableDistance: (value) => {
            return `${(value/1000).toFixed(1)} km`;
        }
    },
    methods: {
        save: (track) => {
            console.log(track);
        }

    }

});