pipeline {
    agent {
        docker {
            image 'node:14-alpine' 
        }
    }
    environment {
        CI = 'true'
        NPM_CERT_FILE = credentials('ryan-npm-cert-file')
        NPM_KEY_FILE = credentials('ryan-npm-key-file')
    }
    stages {
        stage('Setup Environment') {
            steps {
                sh 'node --version'
                sh 'npm config set cert -- "$( cat $NPM_CERT_FILE )"'
                sh 'npm config set key -- "$( cat $NPM_KEY_FILE )"'
                sh 'npm config set @bbc:registry https://artifactory.virt.ch.bbc.co.uk/artifactory/api/npm/npmjs-private-bbc/'
                slackSend (color: '#30fc03', message: "*Environment:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
        stage('Build') { 
            steps {
                dir('src') {
                    sh 'ls'
                    sh 'npm install' 
                }
                slackSend (color: '#30fc03', message: "*Build:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
         stage('Test') { 
            steps {
                dir('src') {
                    sh 'npm test'
                }
                slackSend (color: '#30fc03', message: "*Test:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
    }
}