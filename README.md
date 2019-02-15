[![Build status][circleci-image]][circleci-url]
[![License][license-image]][license-url]

# Auth0 Analytics (Web)

This library adds Facebook and Google analytics integrations to Lock.

## Usage

```html
<script src="https://cdn.auth0.com/js/lock/11.0.0/lock.min.js"></script>
<script src="https://cdn.auth0.com/js/analytics/X.Y.Z/analytics.min.js"></script>
```

> Notice: The script version above uses a placeholder version `X.Y.Z`. In order to determine the latest release view the [releases](https://github.com/auth0/auth0-analytics.js/releases/). For example, to reference release `1.2.0` use `https://cdn.auth0.com/js/analytics/1.2.0/analytics.min.js`

### Optional Configuration

If you want to enable either the Facebook or Google Analytics integrations you can do so with the optional configuration.

> Note: This must be placed on the page before the analytics script is loaded.

```html
<script>
  window.auth0AnalyticsOptions = {
    'facebook-analytics': {
      id: 'YOUR_FACEBOOK_APP_ID'
    }
  }
</script>
```

If you already have the Facebook JS SDK on your page you can set the script to use that.

```html
<script>
  window.auth0AnalyticsOptions = {
    'facebook-analytics': {
      preloaded: true
    }
  }
</script>
```

[circleci-image]: https://img.shields.io/circleci/project/github/auth0/auth0-analytics.js.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/auth0/auth0-analytics.js/tree/master
[license-image]: http://img.shields.io/npm/l/auth0-lock.svg?style=flat-square
[license-url]: #license
