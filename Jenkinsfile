pipeline {
    agent {
        docker {
            image 'node:14' 
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
                    sh 'npm install'
                    sh 'npm list'
                }
                dir('src/client') {
                    sh 'npm install'
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
                    node {
                        def customImage = docker.build("my-image:${env.BUILD_ID}")
                    }
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
