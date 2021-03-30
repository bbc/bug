pipeline {
    agent {
        docker {
            image 'node:14-alpine' 
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('Setup Environment') {
            steps {
                sh 'node --version'
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