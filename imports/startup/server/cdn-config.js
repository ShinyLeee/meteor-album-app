
import url from 'url';
import path from 'path';
import { Meteor } from 'meteor/meteor';
import { WebApp, WebAppInternals } from 'meteor/webapp';

// From https://github.com/Nitrolabs/meteor-cdn/blob/master/lib/server.js
// Minimal cdn config which remove blaze and jQuery dependencies

const FONTS = ['.ttf', '.eot', '.otf', '.svg', '.woff', '.woff2'];
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

/* stripSlashes
 *
 * Strip the trailing slash from a url
 */
function stripSlashes(slashUrl) {
  if (slashUrl) {
    return slashUrl.replace(/\/$/, '');
  }
  return slashUrl;
}

function validateSettings(rootUrl, cdnUrl) {
  // Return True if the ROOT_URL and CDN_URL settings are valid
  // Return False if the settings are invalid, but the server can continue
  // Throw an error if the settings are fatally incorrect
  if (!rootUrl) {
    console.warn('ROOT_URL is not set. Using default Meteor behaviour');
    return false;
  } else if (!cdnUrl) {
    console.warn('CDN_URL is not set. Using default Meteor behaviour');
    return false;
  }
  const cdn = url.parse(cdnUrl);
  const root = url.parse(rootUrl);

  if (root.hostname === 'localhost') {
    return false;
  }

  // Make sure that the CDN_URL is different from the ROOT_URL
  // If these are the same, we can't detect requests from the CDN
  if (cdn.host === root.host) {
    console.warn('CDN: CDN HOST === ROOT HOST. Using default Meteor behaviour');
    return false;
  }

  // Ensure that the CDN_URL and ROOT_URL are correctly formed
  if (ALLOWED_PROTOCOLS.indexOf(root.protocol) < 0) {
    throw new Meteor.Error(`ROOT_URL must use http or https protocol, not ${root.protocol}`);
  } else if (ALLOWED_PROTOCOLS.indexOf(cdn.protocol) < 0) {
    throw new Meteor.Error(`CDN_URL must use http or https protocol, not ${cdn.protocol}`);
  }

  // Return true if the settings are valid
  return true;
}


function setClientCdnUrl(cdnUrl) {
  // Make the CDN_URL available on the client
  // console.log("Setting BundledJsCssPrefix to "+cdnUrl);
  const hasQuestionMark = new RegExp('[?]');
  WebAppInternals.setBundledJsCssUrlRewriteHook((bundlePath) => {
    // This code fixes an issue in Galaxy where you can end up getting served
    // stale code after deployments
    const galaxyVersionId = process.env.GALAXY_APP_VERSION_ID;
    let rewrittenUrl = cdnUrl + bundlePath;
    if (galaxyVersionId) {
      const separator = hasQuestionMark.test(bundlePath) ? '&' : '?';
      rewrittenUrl += `${separator}_g_app_v_=${galaxyVersionId}`;
    }
    return rewrittenUrl;
  });
  // WebAppInternals.setBundledJsCssPrefix(cdnUrl);
  // eslint-disable-next-line no-undef
  __meteor_runtime_config__.CDN_URL = cdnUrl;
}

function configureBrowserPolicy(cdnUrl) {
  console.log('Attemping to configure BrowserPolicy');
  if (Package['browser-policy']) { // eslint-disable-line no-undef
    BrowserPolicy.content.allowOriginForAll(cdnUrl); // eslint-disable-line no-undef
    console.log(`Configure BrowserPolicy allowOriginForAll(${cdnUrl})`);
  }
}

function CdnController() {
  const rootUrl = stripSlashes(process.env.ROOT_URL);
  const cdnUrl = stripSlashes(process.env.CDN_URL);

  const CORSconnectHandler = (req, res, next) => {
    // Set CORS headers on webfonts to avoid issue with chrome and firefox
    const ext = path.extname(url.parse(req.url).pathname);
    if (FONTS.indexOf(ext) > -1) {
      res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains'); // 2592000s / 30 days
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    next();
  };

  const static404connectHandler = (req, res, next) => {
    // Return 404 if a non-existent static file is requested
    // If REQUEST_HOST === CDN_URL then a 404 is returned for all non-static files
    const pathname = url.parse(req.url).pathname;
    // const ext = path.extname(pathname);
    const root = url.parse(rootUrl);
    const cdn = url.parse(cdnUrl);

    const isFromCDN = (req.headers.host === cdn.host && req.headers.host !== root.host);

    // Cloudfront removes all headers by default
    // We need the HOST header to determine where this request came from
    if (!req.headers.host) {
      console.warn('HOST header is not set');
      console.warn('Unable to determine if this request came via the CDN');
    } else if (isFromCDN && !(pathname in WebAppInternals.staticFiles)) {
      console.warn(`Static resource not found: ${pathname}`);
      res.writeHead(404);
      res.write('Static File Not Found');
      res.end();
      return res;
    } else if (isFromCDN) {
      console.log(`Serving to CDN: ${pathname}`);
    }
    next();
  };

  // Initialize the CDN
  if (validateSettings(rootUrl, cdnUrl)) {
    setClientCdnUrl(cdnUrl);
    configureBrowserPolicy(cdnUrl);
    WebApp.rawConnectHandlers.use(static404connectHandler);
    WebApp.rawConnectHandlers.use(CORSconnectHandler);
    console.info(`Using CDN: ${cdnUrl}`);
  }
}

Meteor.startup(() => {
  if (process.env.NODE_ENV === 'production') {
    CdnController();
  }
});
