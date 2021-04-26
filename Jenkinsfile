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
            }
        }
        stage('Install') { 
            steps {
                dir('src') {
                    sh 'npm install --also=dev'
                    sh 'npm list'
                }
                dir('src/client') {
                    sh 'npm install --also=dev'
                    sh 'npm list'
                }
            }
        }
        stage('Test') { 
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
        stage('Build') { 
            steps {
                dir('src') {
                    sh 'docker image build --compress --tag rmccartney856/bug-core:latest ./'
                }
                slackSend (color: '#30fc03', message: "*Image:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
        stage('Publish') { 
            steps {
                dir('src') {
                    sh 'docker push rmccartney856/bug-core:latest'
                }
                slackSend (color: '#30fc03', message: "*Image:* Pipeline Job '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
            }
        }
    }
}