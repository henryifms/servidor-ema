#include <vector>
#include <cmath>
#include <algorithm>

class NeuralNetwork {
public:
    std::vector<double> weights;
    double bias;
    double learning_rate = 0.1;

    NeuralNetwork(int input_size) {
        // Inicializa pesos aleatórios simples
        weights.resize(input_size, 0.5);
        bias = 0.1;
    }

    double sigmoid(double x) {
        return 1.0 / (1.0 + exp(-x));
    }

    double predict(std::vector<double> inputs) {
        double sum = bias;
        for (size_t i = 0; i < inputs.size(); ++i) {
            sum += inputs[i] * weights[i];
        }
        return sigmoid(sum);
    }

    // Aqui você adicionaria o método de 'train' (Backpropagation)
};

int main() {
    NeuralNetwork nn(2); // Exemplo: 2 entradas
    std::vector<double> input = {1.0, 0.5};
    
    std::cout << "Resultado da Predicao: " << nn.predict(input) << std::endl;
    
    return 0;
}

