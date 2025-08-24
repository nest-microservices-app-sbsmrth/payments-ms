pipeline {
    agent any
    stages {
        stage('Checkout Github') {
            steps {
                git branch: 'main', credentialsId: 'webhook', url: 'https://github.com/nest-microservices-app-sbsmrth/payments-ms.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
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