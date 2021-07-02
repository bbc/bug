def PACKAGE
def VERSION

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
                    script {
                        PACKAGE = readJSON file: 'package.json'
                        VERSION = PACKAGE.version
                        echo VERSION
                    }
                    sh "docker buildx create --use --append --name builder.${env.BUILD_NUMBER} --platform linux/amd64,linux/arm64"
                    sh "docker buildx inspect --bootstrap"
                    sh "docker buildx build --platform linux/amd64,linux/arm64 --compress --label version='${VERSION}' --label maintainer='${env.GIT_COMMITTER_NAME}' --label uk.co.bbc.bug.author.email='${env.GIT_COMMITTER_EMAIL}' --label uk.co.bbc.bug.build.number='${env.BUILD_NUMBER}' --label uk.co.bbc.bug.build.branch='${env.BRANCH_NAME}' --label uk.co.bbc.bug.build.commit='${env.GIT_COMMIT}' --tag ${repositoryName}/${imageName}:${VERSION} --output=type=registry,registry.insecure=true ."
                    sh "docker buildx build --platform linux/amd64,linux/arm64 --compress --label version='${VERSION}' --label maintainer='${env.GIT_COMMITTER_NAME}' --label uk.co.bbc.bug.author.email='${env.GIT_COMMITTER_EMAIL}' --label uk.co.bbc.bug.build.number='${env.BUILD_NUMBER}' --label uk.co.bbc.bug.build.branch='${env.BRANCH_NAME}' --label uk.co.bbc.bug.build.commit='${env.GIT_COMMIT}' --tag ${repositoryName}/${imageName}:latest --output=type=registry,registry.insecure=true ."
                }
            }
        }
    }
    post {
        always {
            cleanWs()
            sh "docker buildx rm builder.${env.BUILD_NUMBER}"
        }
        success {
            slackSend(color: "#30fc03", channel: "#ci-bug", message: "*#${env.BUILD_NUMBER} Success:* Built, tested and deployed '${env.JOB_NAME}' ${VERSION} (${env.BUILD_URL})")
        }
        failure {
            slackSend(color: "#ff6347", channel: "#ci-bug", message: "*#${env.BUILD_NUMBER} Failed:* An error occurred '${env.JOB_NAME}' ${VERSION} (${env.BUILD_URL})")
        }
        unstable {
            slackSend(color: "#ffbf00", channel: "#ci-bug", message: "*#${env.BUILD_NUMBER} Unstable:* something went wrong '${env.JOB_NAME}' ${VERSION} (${env.BUILD_URL})")
        }
    }
}
