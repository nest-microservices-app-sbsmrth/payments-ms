pipeline {
    agent any
    stages {
        stage('Docker Build') {
            steps {
                script {
                    dockerImage = docker.build(
                        "sbsmrth/payments-ms-app:latest", 
                        "-f Dockerfile.prod ."
                    )
                }
            }
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing image to Dockerhub..'
            }
        }
    }
    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}