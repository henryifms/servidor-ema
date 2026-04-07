#include <vector>
#include <cmath>
#include <algorithm>
#include <iostream>
#include <unistd.h>

class NeuralNetwork {
public:
    std::vector<double> weights;
    double bias;
    double learning_rate = 0.1;

    NeuralNetwork(int input_size) {
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
};

int main() {
    NeuralNetwork nn(2);
    std::vector<double> input = {1.0, 0.5};

    while (true) {
        std::cout << "Resultado da Predicao: "
                  << nn.predict(input)
                  << std::endl;

        sleep(2); // ⚠️ aqui é em SEGUNDOS, não ms
    }

    return 0;
}
