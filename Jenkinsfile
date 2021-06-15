def PACKAGE
def VERSION

pipeline {
    environment {
        repositoryName = '172.26.108.110'
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
                    script {
                        PACKAGE = readJSON file: 'package.json'
                        VERSION = PACKAGE.version
                        echo VERSION
                    }
                    sh "docker buildx create --use --name bugBuilder --platform linux/amd64,linux/arm/v7"
                    sh "docker buildx build --builder bugBuilder --compress --label version='${VERSION}' --label maintainer='${env.GIT_COMMITTER_NAME}' --label uk.co.bbc.bug.author.email='${env.GIT_COMMITTER_EMAIL}' --label uk.co.bbc.bug.build.number='${env.BUILD_NUMBER}' --label uk.co.bbc.bug.build.branch='${env.BRANCH_NAME}' --label uk.co.bbc.bug.build.commit='${env.GIT_COMMIT}' --tag ${imageName}:latest --output type=docker ."
                }
            }
        }
        stage('Publish') {
            steps {
                sh "docker tag ${imageName}:latest ${repositoryName}/${imageName}:latest"
                sh "docker tag ${imageName}:latest ${repositoryName}/${imageName}:${VERSION}"
                sh "docker push ${repositoryName}/${imageName}:latest"       
                sh "docker push ${repositoryName}/${imageName}:${VERSION}"       
            }
        }
    }
    post {
        always {
            cleanWs()
            sh "docker buildx rm bugBuilder"
            sh "docker rmi ${imageName}:latest"
            sh "docker rmi ${repositoryName}/${imageName}:${VERSION}"
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