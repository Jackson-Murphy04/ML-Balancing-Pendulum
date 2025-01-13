// neural network class represents all layers
class NeuralNetwork {
    // constructor (neurons for each layer as array)
    constructor(neuronCount) {
        this.levels = [];
        // push neurons to each level
        for (let i = 0; i < neuronCount.length - 1; i++) {
            // create
            this.levels.push(new Level(neuronCount[i], neuronCount[1 + 1]));
        }
    }
    // feed forward (pass outputs between layers)
    static feedForward(inputs, brain) {
        // input to first level
        let output = Level.feedForward(inputs, brain.levels[0]);
        // pass to other levels
        for (let i = 1; i < brain.levels.length; i++) {
            // feed previous out to next in
            output = Level.feedForward(output, brain.levels[i]);
        }
        return output;
    }
    // mutate function 
    static mutate(brain, amount = 1) {
        // for each level
        brain.levels.forEach(level => {
            // mutate each neuron bias
            for (let i = 0; i < levels.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
            }
            // mutate each weight
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    // Apply linear interpolation between the current weight and a random value between -1 and 1
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
                }
            }
        });
    }
}

// class to represent each level
class Level {
    // constructor (take input and output counts)
    constructor(inputcount, outputcount) {
        // store input vals
        this.inputs = new Array(inputcount);
        // store output vals
        this.output = new Array(outputcount);
        // stor bias for each output
        this.biases = new Array(outputcount);
        // 2D store weights between each in and out
        this.weights = [];
        for (let i = 0; i < inputcount; i++) {
            this.weights[i] = new Array(outputcount);
        }
        // randomize weight and bias
        Level.randomize(this);
    }
    // method to randomize weights and biases
    static randomize(level) {
        // randomize weights between -1 and 1
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.output.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        // randomize biases
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }
    // method to perform feed forward
    static feedForward(givenInputs, level) {
        // assign inputs to level input
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        // Calculate outputs based on inputs, weights, and biases
        for (let i = 0; i < level.output.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            // Apply activation function (simple threshold in this case)
            if (sum > level.biases[i]) {
                level.output[i] = 1;
            } else {
                level.output[i] = 0;
            }
        }

        // Return the calculated outputs
        return level.output;
    }
}