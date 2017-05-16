# Auth0 Analytics (Web)
This library adds Facebook and Google analytics integrations to Lock. 


# Usage

```html
<script src="https://cdn.auth0.com/js/lock/10.x/lock.min.js"></script>
<script src="https://cdn.auth0.com/js/analytics/1.x/analytics.min.js"></script>
```

**Optional Configuration**
If you want to disable either the Facbeook or Google Analytics integrations you can do so with the optional configuration. 

> Note: This must be placed on the page before the analytics script is loaded.

```html
<script>
  window.auth0AnalyticsOptions = {
    enable_facebook: false,  // Defaults to true
    enable_google: false     // Defaults to true
  }
</script>
```