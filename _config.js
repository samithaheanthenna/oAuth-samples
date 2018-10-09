const APP_ID = "appID";
const SECRECT = "secret";
const REDIRECT_URL = "http://localhost:8050/callback";
const ACCESS_TOKEN_URL = "https://graph.facebook.com/oauth/access_token";
const GRAPH_API = "https://graph.facebook.com/v2.8/me/friends";

let config = {};

config.APP_ID = APP_ID;
config.SECRET = SECRECT;
config.REDIRECT_URL = REDIRECT_URL;
config.ACCESS_TOKEN_URL = ACCESS_TOKEN_URL;
config.GRAPH_API = GRAPH_API;

module.exports = {config: config}

