pipeline {
    agent any
    tools { nodejs 'node-8.1.0' }
    stages {
        stage('Checkout') {
          steps {
            checkout scm
          }
        }

        stage('Installing dependencies') {
            steps {
                sh 'yarn'
            }
        }

        // stage('Running tests') {
        //   steps {
        //     sh "npm run test:ci"
        //   }
        // }

        stage('Build') { 
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            environment { 
                VERSION_NUMBER = '0.2'
            }
            steps {
                sh 'aws s3 sync release s3://assets.us.auth0.com/js/analytics/$VERSION_NUMBER --region us-west-1 --quiet --cache-control "max-age=86400" --acl public-read --content-type "application/json"'
                sh 'aws s3 sync release s3://assets.us.auth0.com/js/analytics/$VERSION_NUMBER.$BUILD_NUMBER --region us-west-1 --quiet --cache-control "max-age=86400" --acl public-read --content-type "application/json"'
            }
        }    
    }

    post {
      // Always runs. And it runs before any of the other post conditions.
      always {
        // Let's wipe out the workspace before we finish!        
        deleteDir()
      }
      
      success {
        slackSend channel: '#crew-solutions-build',
                  color: 'good',
                  message: "The pipeline ${currentBuild.fullDisplayName} completed successfully."
      }

      failure {
        slackSend channel: '#crew-solutions-build',
                  color: 'error',
                  message: "The pipeline ${currentBuild.fullDisplayName} has failed."

      }
    }

    // The options directive is for configuration that applies to the whole job.
    options {
      // For example, we'd like to make sure we only keep 10 builds at a time, so
      // we don't fill up our storage!
      buildDiscarder(logRotator(numToKeepStr:'10'))
      
      // And we'd really like to be sure that this build doesn't hang forever, so
      // let's time it out after an hour.
      timeout(time: 30, unit: 'MINUTES')
    }
}