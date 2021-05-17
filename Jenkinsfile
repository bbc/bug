pipeline {
    environment {
        repositoryName = '172.26.108.110:5000'
        imageName = 'bug'
    }
    agent any
    stages {
        stage('Setup') {
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
                    sh "docker build --compress --label maintainer='${env.GIT_AUTHOR_NAME}' --label uk.co.bbc.bug.author.email='${env.GIT_AUTHOR_EMAIL}' --label uk.co.bbc.bug.build.number='${env.BUILD_NUMBER}' --label uk.co.bbc.bug.build.branch='${env.BRANCH_NAME}' --label uk.co.bbc.bug.build.commit='${env.GIT_COMMIT}' --tag ${imageName}:latest ."
                }
            }
        }
        stage('Publish') {
            steps {
                sh "docker tag ${imageName}:latest ${repositoryName}/${imageName}:${env.BUILD_NUMBER}"
                sh "docker push ${repositoryName}/${imageName}:${env.BUILD_NUMBER}"
                sh "docker tag ${imageName}:latest ${repositoryName}/${imageName}:latest"
                sh "docker push ${repositoryName}/${imageName}:latest"
            }
        }
    }
    post {
        always {
            cleanWs()
            sh "docker rmi ${imageName}:latest"
            sh "docker rmi ${repositoryName}/${imageName}:${env.BUILD_NUMBER}"
            sh "docker rmi ${repositoryName}/${imageName}:latest"
        }
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