async function ready() {
    await init();
    checkLogin();
}

async function init() {
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
    }
    checkLogin();
}

function checkLogin() {
    let authentication = localStorage.getItem('authentication');
    if (!authentication) {
        let login = document.querySelector('#login')
        if (login) {
            login.classList.remove('hidden');
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