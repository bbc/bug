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
            }
        }
        stage('Build') {
            steps {
                dir('src') {
                    sh 'docker build --compress --tag rmccartney856/bug:latest .'
                }
            }
        }
        stage('Publish') {
            steps {
                dir('src') {
                    sh 'docker push rmccartney856/bug:latest'
                }
            }
        }
    }
    post {
        success {
            slackSend
                channel: '#ci-bug',
                color: '#30fc03',
                message: "*BUG:* Completed succesfully, '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})"
        }
        failure {
            slackSend
                channel: '#ci-bug',
                color: '#ff6347',
                message: "*BUG:* Failed, '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})"
        }
        unstable {
            slackSend
                channel: '#ci-bug',
                color: '#ff7f50',
                message: "*BUG:* Completed succesfully, '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})"
        }
    }
}
