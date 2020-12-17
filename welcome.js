function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
redirURL = getParameterByName('url')
var myHeaders = new Headers();
userID = myHeaders.get('X-Replit-User-Id');
userNAME = myHeaders.get('X-Replit-User-Name');
userROLES = myHeaders.get('X-Replit-User-Roles');
window.location.assign(redirURL+'?id='+userID+'&name='+userNAME+'&roles='+userROLES)