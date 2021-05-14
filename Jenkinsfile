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
}