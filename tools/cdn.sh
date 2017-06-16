
CURRENT_VERSION=$(node tools/attribute.js version)

CDN_EXISTS=$(aws s3 ls s3://assets.us.auth0.com/js/analytics/$CURRENT_VERSION/ | grep 'analytics.min.js')

if [ ! -z "$CDN_EXISTS" ]; then
  echo "There is already a version $CURRENT_VERSION in the cdn. Skipping cdn publish…"
else
  aws s3 sync release s3://assets.us.auth0.com/js/analytics/$CURRENT_VERSION --region us-west-1 --quiet --cache-control "max-age=86400" --acl public-read
  echo "$CURRENT_VERSION uploaded to the cdn"
fi