pipeline {
    agent any
    stages {
        stage('Checkout Github') {
            steps {
                git branch: 'main', 
                credentialsId: 'webhook', 
                url: 'https://github.com/nest-microservices-app-sbsmrth/payments-ms.git'
            }
        }
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