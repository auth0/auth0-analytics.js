CURRENT_VERSION=$(node -p "require('./package').version")

NPM_NAME=$(node tools/attribute.js name)
VERSION=$(node tools/attribute.js version)

aws s3 ls s3://assets.us.auth0.com/js/analytics/$CURRENT_VERSION/ | grep 'analytics.min.js'

# aws s3 sync release s3://assets.us.auth0.com/js/analytics/$CURRENT_VERSION --region us-west-1 --quiet --cache-control "max-age=86400" --acl public-read