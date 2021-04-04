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
        stage('Install Core and Client') { 
            steps {
                dir('src') {
                    sh 'npm install'
                    sh 'npm list'
                }
                dir('src/client') {
                    sh 'npm install'
                    sh 'npm list'
                }
                slackSend (color: '#30fc03', message: "*Install:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
        stage('Test Core and Client') { 
            steps {
                dir('src') {
                    sh 'npm run test'
                }
                dir('src/client') {
                    sh 'npm run test'
                }
                slackSend (color: '#30fc03', message: "*Test:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
        stage('Build Client') { 
            steps {
                dir('src') {
                    sh 'npm run build'
                }
                slackSend (color: '#30fc03', message: "*Build:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
    }
}