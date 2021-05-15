pipeline {
    environment {
        CI = 'true'
        imageName = 'rmccartney856/bug'
    }
    agent any
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
                    sh "docker build --compress --tag ${imageName}:${env.BUILD_NUMBER} ."
                    sh "docker build --compress --tag ${imageName}:latest ."
                }
            }
        }
        stage('Publish') { 
            steps {
                sh "docker push ${imageName}:${env.BUILD_NUMBER} ."
                sh "docker push ${imageName}:latest ."
            }
        }
        stage('Remove Unused docker image') {
            steps{
                sh "docker rmi ${imageName}:${env.BUILD_NUMBER}"
                sh "docker rmi ${imageName}:latest"
            }
        }
    }
    post {
        success {
            slackSend(color: "#30fc03", channel: "#ci-bug", message: "*Success:* Built, tested and deployed '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
        }
        failure {
            slackSend(color: "#ff6347", channel: "#ci-bug", message: "*Failed:* An error occurred '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
        }
        unstable {
            slackSend(color: "#ffbf00", channel: "#ci-bug", message: "*Unstable:* something went wrong '${env.JOB_NAME}' #${env.BUILD_NUMBER} (${env.BUILD_URL})")
        }
    }
}