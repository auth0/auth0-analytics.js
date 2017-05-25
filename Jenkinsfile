pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'yarn && npm run build'
            }
        }
        stage('Deploy') {
            environment { 
                VERSION_NUMBER = '0.1'
            }
            steps {
                sh 'aws s3 sync release s3://assets.us.auth0.com/js/analytics/$VERSION_NUMBER --region us-west-1 --quiet --cache-control "max-age=86400"'
                sh 'aws s3 sync release s3://assets.us.auth0.com/js/analytics/$VERSION_NUMBER.$BUILD_NUMBER --region us-west-1 --quiet --cache-control "max-age=86400"'
            }
        }
    }
}