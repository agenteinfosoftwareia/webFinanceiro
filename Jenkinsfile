pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: default
  containers:
  - name: node
    image: node:20-alpine
    command:
    - cat
    tty: true
'''
        }
    }

    environment {
        REPO = 'https://github.com/agenteinfosoftwareia/webFinanceiro.git'
        APP  = 'webfinanceiro'
        NS   = 'webfinanceiro'
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: "${REPO}"
            }
        }

        stage('Install') {
            steps {
                container('node') {
                    sh 'npm ci --prefer-offline || npm install'
                }
            }
        }

        stage('Build') {
            steps {
                container('node') {
                    sh 'npx ng build --configuration production'
                }
            }
        }

        stage('Deploy K3s') {
            steps {
                container('node') {
                    sh """
                        apk add --no-cache curl
                        KUBECTL_VER=\$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)
                        curl -sLO https://storage.googleapis.com/kubernetes-release/release/\${KUBECTL_VER}/bin/linux/amd64/kubectl
                        chmod +x kubectl && mv kubectl /usr/local/bin/

                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/service.yaml

                        kubectl create configmap ${APP}-dist \\
                            --from-file=dist/webFinanceiro/browser/ \\
                            -n ${NS} \\
                            --dry-run=client -o yaml | kubectl apply -f -

                        kubectl apply -f k8s/deployment.yaml

                        kubectl rollout restart deployment/${APP} -n ${NS}
                        kubectl rollout status  deployment/${APP} -n ${NS} --timeout=120s
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deploy OK: http://76.13.69.127:30082"
        }
        failure {
            echo "Falha no deploy do ${APP}"
        }
    }
}
