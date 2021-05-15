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
                    sh 'docker image build --compress --tag rmccartney856/bug-core:latest ./'
                }
            }
        }
        stage('Publish') { 
            steps {
                dir('src') {
                    sh 'docker push rmccartney856/bug-core:latest'
                }
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