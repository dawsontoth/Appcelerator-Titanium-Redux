// This is our collection of utilities -- we'll use these everywhere in our app.

/**
 * Checks if we are online, and shows an alert if we are not.
 */
function checkInternet() {
    if (!Ti.Network.online) {
        alert('This tab requires internet connectivity!');
    }
}


/**
 * Formats a date, returning a nice string that can be shown to the user.
 * @param date The date to format; leave blank to use the current time!
 */
function formatDate(date) {
    date = date || new Date();
    var result = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    if (date.getHours() + date.getMinutes() + date.getSeconds() != 0) {
        result += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    return result.replace(/\b(\d)\b/g, '0$1');
}