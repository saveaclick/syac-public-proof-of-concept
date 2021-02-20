import * as snoowrap from "snoowrap"

//Get headline from URL
function getHeadlineAndArchiveUrl(url: string) {
    //This uses a cloudflare worker running https://github.com/Darkseal/CORSflare. Exact implemenation can be found in cloudflare.js
    const UrlObj = new URL(url);
    return Promise.all([fetch(
        `https://little-dream-43b9.roshkins-cloudflare.workers.dev${UrlObj.pathname}?url_for_headline=${encodeURIComponent(UrlObj.hostname)}`, {mode: "cors"}
    ).then(res => res.ok ? res.text() : null).then(body => {
        let el = document.createElement("html");
        el.innerHTML = body;
        return (el.querySelector('h1').innerText);
    }),
    // fetch the saaved archive.org URL after following all redirects. 
    // This can be more robust in production, with fallback to archive.is or querying for the archive.org url
    fetch(`https://little-dream-43b9.roshkins-cloudflare.workers.dev/api/?url=${encodeURIComponent(url)}&url_for_headline=robustlinks.mementoweb.org`).then((resp: Response) => {
        return resp.ok ? resp.json() : 'failed';
    }).then(json => json['data-versionurl'])]);
}

function postAsUser(headline: string, spoiler: string, archivedUrl: string, clientId: string, clientSecret: string, accessToken: string) {
    // Use https://not-an-aardvark.github.io/reddit-oauth-helper/ for refreshToken and accessToken, make sure to have submit permissions
    const r = new snoowrap({
        userAgent: "SYAC proof of concept DEV Build 0.1",
        clientId: clientId,
        clientSecret: clientSecret,
        accessToken: accessToken
    });
    r.submitLink({
        subredditName: "ysac_dev",
        title: `${headline} | ${spoiler}`,
        url: archivedUrl
    }).then(()=>{alert('Posted! UPDATE')});
}

function submitHandler(e: Event) {
    alert("Event! 3");
    e.preventDefault();
    const submitter = (e.target as Element);
    const urlToArchive = (submitter.querySelector("input[name='url_to_archive']") as HTMLInputElement).value;
    const spoiler = (submitter.querySelector("input[name='spoiler']") as HTMLInputElement).value;
    const accessToken =  (submitter.querySelector("input[name='token']") as HTMLInputElement).value;
    const clientId = (submitter.querySelector("input[name='clientId']") as HTMLInputElement).value;
    const clientSecret = (submitter.querySelector("input[name='clientSecret']") as HTMLInputElement).value;
    getHeadlineAndArchiveUrl(urlToArchive).then((([headline, archivedUrl]) => {
        postAsUser(headline, spoiler, archivedUrl, clientId, clientSecret, accessToken);
     }));
}

(globalThis as any).handleSubmit = submitHandler;
