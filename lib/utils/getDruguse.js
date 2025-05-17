// Helper function to repeat a value n times
const repeat = (value, times) => new Array(times).fill(value);

const RISK_LEVELS = {
    'Muybajo': 2,  
    'Bajo': 2,     
    'Medio': 2,    
    'Alto': 2,     
    'Severo': 2    
};

const DRINK_TYPES = {
    "Cerveza":5, 
    "Vino":2, 
    "Whisky":1, 
    "Coctel":1,
    "Ron":1, 
    "Aguardiente":2
};

const RISK_DATASET = Object.entries(RISK_LEVELS).flatMap(([level, weight]) => 
    repeat(level, weight)
);

const DRINK_TYPES_DATASET = Object.entries(DRINK_TYPES).flatMap(([type, weight]) => 
    repeat(type, weight)
);

function getRandomRiskLevel() {
    // Pick a random item from the dataset
    const randomIndex = Math.floor(Math.random() * RISK_DATASET.length);
    return RISK_DATASET[randomIndex];
}

function getRandomDrinkType(numberOfDrinks) {
    // If numberOfDrinks is 0, return empty array
    if (numberOfDrinks <= 0) return [];
    
    // For larger numbers, avoid duplicates if possible
    if (numberOfDrinks >= DRINK_TYPES_DATASET.length) {
        // If requesting more drinks than available types, return all types
        return [...new Set(DRINK_TYPES_DATASET)];
    }
    
    // Get random unique drink types
    const drinkTypes = [];
    const availableDrinks = [...DRINK_TYPES_DATASET];
    
    for (let i = 0; i < numberOfDrinks; i++) {
        // Select a random drink from the available drinks
        const randomIndex = Math.floor(Math.random() * availableDrinks.length);
        drinkTypes.push(availableDrinks[randomIndex]);
        
        // Remove the selected drink to avoid duplicates
        availableDrinks.splice(randomIndex, 1);
    }
    
    return drinkTypes;
}

function simulateAlcoholUse(nivelDeRiesgo) {
    const responses = {
      vida: "NO",
      ano: "NO",
      tresMeses: "NO",
      mes: "NO"
    };
  
    // Define probabilities based on 'nivelDeRiesgo'
    let probVida = Math.random();
    if (nivelDeRiesgo === "Muybajo") {
      probVida = 0.0;
    } else if (nivelDeRiesgo === "Bajo") {
      probVida = 0.05;
    } else if (nivelDeRiesgo === "Medio") {
      probVida = 0.6;
    } else if (nivelDeRiesgo === "Alto") {
      probVida = 0.9;
    } else if (nivelDeRiesgo === "Severo") {
      probVida = 0.99;
    }
  
    if (Math.random() < probVida) {
      responses.vida = "SI";
  
      if (Math.random() < 0.8) {
        responses.ano = "SI";
  
        if (Math.random() < 0.7) {
          responses.tresMeses = "SI";
  
          if (Math.random() < 0.6) {
            responses.mes = "SI";
          }
        }
      }
    }
  
    return responses;
}

function generateCrafftResponses(alcoholUse) {
    // Default all to "No" with zero probability
    const crafftResponses = {
        crafft_1: "NO",
        crafft_2: "NO",
        crafft_3: "NO",
        crafft_4: "NO",
        crafft_5: "NO",
        crafft_6: "NO"
    };
    
    crafftResponses.crafft_1 = Math.random() < 0.5 ? "SI" : "NO";
    // If lifetime alcohol use is "SI", set probabilities for CRAFFT questions
    if (alcoholUse.vida === "SI") {
        // Car question - has higher probability
        
        // Only if lifetime use is present, all CRAFFT items have a base 10% chance
        crafftResponses.crafft_2 = Math.random() < 0.1 ? "SI" : "NO";
        crafftResponses.crafft_3 = Math.random() < 0.1 ? "SI" : "NO";
        crafftResponses.crafft_4 = Math.random() < 0.1 ? "SI" : "NO";
        crafftResponses.crafft_5 = Math.random() < 0.1 ? "SI" : "NO";
        crafftResponses.crafft_6 = Math.random() < 0.1 ? "SI" : "NO";
    }
    
    return crafftResponses;
}

function simulateCigaretteUse(nivelDeRiesgo) {
    const responses = {
      vida: "NO",
      ano: "NO",
      tresMeses: "NO",
      mes: "NO"
    };
  
    // Define probabilities based on 'nivelDeRiesgo'
    let probVida = Math.random();
    if (nivelDeRiesgo === "Muybajo") {
      probVida = 0.0;
    } else if (nivelDeRiesgo === "Bajo") {
      probVida = 0.05;
    } else if (nivelDeRiesgo === "Medio") {
      probVida = 0.1;
    } else if (nivelDeRiesgo === "Alto") {
      probVida = 0.2;
    } else if (nivelDeRiesgo === "Severo") {
      probVida = 0.4;
    }
  
    if (Math.random() < probVida) {
      responses.vida = "SI";
  
      if (Math.random() < 0.3) {
        responses.ano = "SI";
  
        if (Math.random() < 0.3) {
          responses.tresMeses = "SI";
  
          if (Math.random() < 0.2) {
            responses.mes = "SI";
          }
        }
      }
    }
  
    return responses;
}

function simulateMarijuanaUse(nivelDeRiesgo) {
    const responses = {
      vida: "NO",
      ano: "NO",
      tresMeses: "NO",
      mes: "NO"
    };
  
    // Define probabilities based on 'nivelDeRiesgo'
    let probVida = Math.random();
    if (nivelDeRiesgo === "Muybajo") {
      probVida = 0.0;
    } else if (nivelDeRiesgo === "Bajo") {
      probVida = 0.00;
    } else if (nivelDeRiesgo === "Medio") {
      probVida = 0.05;
    } else if (nivelDeRiesgo === "Alto") {
      probVida = 0.1;
    } else if (nivelDeRiesgo === "Severo") {
      probVida = 0.2;
    }
  
    if (Math.random() < probVida) {
      responses.vida = "SI";
  
      if (Math.random() < 0.3) {
        responses.ano = "SI";
  
        if (Math.random() < 0.3) {
          responses.tresMeses = "SI";
  
          if (Math.random() < 0.2) {
            responses.mes = "SI";
          }
        }
      }
    }
  
    return responses;
}

function simulateOtherSubstancesUse(nivelDeRiesgo) {
  const responses = {
    vida: "NO",
    ano: "NO",
    tresMeses: "NO",
    mes: "NO"
  };

  // Define probabilities based on 'nivelDeRiesgo'
  let probVida = Math.random();
  if (nivelDeRiesgo === "Muybajo") {
    probVida = 0.0;
  } else if (nivelDeRiesgo === "Bajo") {
    probVida = 0.00;
  } else if (nivelDeRiesgo === "Medio") {
    probVida = 0.00;
  } else if (nivelDeRiesgo === "Alto") {
    probVida = 0.05;
  } else if (nivelDeRiesgo === "Severo") {
    probVida = 0.1;
  }

  if (Math.random() < probVida) {
    responses.vida = "SI";

    if (Math.random() < 0.3) {
      responses.ano = "SI";

      if (Math.random() < 0.3) {
        responses.tresMeses = "SI";

        if (Math.random() < 0.2) {
          responses.mes = "SI";
        }
      }
    }
  }

  return responses;
}

function simulateFrequencyOfUseMes(nivelDeRiesgo, alcoholUseMes) {
  const responsesMes = {
      amountConsumed: 0,
      daysConsumed: 0,
      drinkTypesConsumed: [],
      gotDrunk: "No",
      timesDrunk: 0
  };

  if (alcoholUseMes === "SI") {

  const numberOfDrinks = nivelDeRiesgo === "Muybajo" ? 0 : nivelDeRiesgo === "Bajo" ? 1 : nivelDeRiesgo === "Medio" ? 2 : nivelDeRiesgo === "Alto" ? 3 : 4;

  if (nivelDeRiesgo === "Muybajo") {
      responsesMes.amountConsumed = 0;
      responsesMes.daysConsumed = 0;
      responsesMes.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
      responsesMes.gotDrunk = false;
      responsesMes.timesDrunk = 0;
  } else if (nivelDeRiesgo === "Bajo") {
      responsesMes.daysConsumed = Math.floor(1*Math.random() +1);
      responsesMes.amountConsumed = Math.floor(1*Math.random() +1);
      responsesMes.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
      responsesMes.gotDrunk = Math.random() > 0.95 ? "SI" : "NO";
      responsesMes.timesDrunk = Math.floor(1*Math.random() +1);
  } else if (nivelDeRiesgo === "Medio") {
      responsesMes.amountConsumed = Math.floor(2*Math.random() +1);
      responsesMes.daysConsumed = Math.floor(2*Math.random() +1);
      responsesMes.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
      responsesMes.gotDrunk = Math.random() > 0.8 ? "SI" : "NO";
      responsesMes.timesDrunk = Math.floor(2*Math.random() +1);
  } else if (nivelDeRiesgo === "Alto") {
      responsesMes.amountConsumed = Math.floor(3*Math.random() +1);
      responsesMes.daysConsumed = Math.floor(3*Math.random() +1);
      responsesMes.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
      responsesMes.gotDrunk = Math.random() > 0.4 ? "SI" : "NO";
      responsesMes.timesDrunk = Math.floor(3*Math.random() +1);
  } else if (nivelDeRiesgo === "Severo") {
      responsesMes.amountConsumed = Math.floor(4*Math.random() +1 );
      responsesMes.daysConsumed = Math.floor(4*Math.random() +1);
      responsesMes.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
      responsesMes.gotDrunk = Math.random() > 0.2 ? "SI" : "NO";
      responsesMes.timesDrunk = Math.floor(4*Math.random() +1);
  }

  } else {
      responsesMes.amountConsumed = 0;
      responsesMes.daysConsumed = 0;
      responsesMes.drinkTypesConsumed = [];
      responsesMes.gotDrunk = "NO";
      responsesMes.timesDrunk = 0;
  }

  return responsesMes;
}

function simulateFrequencyOfUse3Meses(nivelDeRiesgo, alcoholUse3Meses, alcoholUseMes) {
    // Initialize responses for 3 months period
    const responses3Meses = {
        amountConsumed: 0,
        daysConsumed: 0,
        drinkTypesConsumed: [],
        gotDrunk: "NO",
        timesDrunk: 0
    };

    if (alcoholUse3Meses === "SI") {
        const numberOfDrinks = nivelDeRiesgo === "Muybajo" ? 0 : nivelDeRiesgo === "Bajo" ? 1 : nivelDeRiesgo === "Medio" ? 2 : nivelDeRiesgo === "Alto" ? 3 : 4;

        if (nivelDeRiesgo === "Muybajo") {
            responses3Meses.amountConsumed = 0;
            responses3Meses.daysConsumed = 0;
            responses3Meses.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
            responses3Meses.gotDrunk = false;
            responses3Meses.timesDrunk = 0;
        } else if (nivelDeRiesgo === "Bajo") {
            responses3Meses.daysConsumed = Math.floor(1*Math.random() +1);
            responses3Meses.amountConsumed = Math.floor(1*Math.random() +1);
            responses3Meses.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
            responses3Meses.gotDrunk = Math.random() > 0.95 ? "SI" : "NO";
            responses3Meses.timesDrunk = Math.floor(1*Math.random() +1);
        } else if (nivelDeRiesgo === "Medio") {
            responses3Meses.amountConsumed = Math.floor(2*Math.random() +1);
            responses3Meses.daysConsumed = Math.floor(2*Math.random() +1);
            responses3Meses.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
            responses3Meses.gotDrunk = Math.random() > 0.8 ? "SI" : "NO";
            responses3Meses.timesDrunk = Math.floor(2*Math.random() +1);
        } else if (nivelDeRiesgo === "Alto") {
            responses3Meses.amountConsumed = Math.floor(3*Math.random() +1);
            responses3Meses.daysConsumed = Math.floor(3*Math.random() +1);
            responses3Meses.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
            responses3Meses.gotDrunk = Math.random() > 0.4 ? "SI" : "NO";
            responses3Meses.timesDrunk = Math.floor(3*Math.random() +1);
        } else if (nivelDeRiesgo === "Severo") {
            responses3Meses.amountConsumed = Math.floor(4*Math.random() +1);
            responses3Meses.daysConsumed = Math.floor(4*Math.random() +1);
            responses3Meses.drinkTypesConsumed = getRandomDrinkType(numberOfDrinks);
            responses3Meses.gotDrunk = Math.random() > 0.2 ? "SI" : "NO";
            responses3Meses.timesDrunk = Math.floor(4*Math.random() +1);
        }
    }

    // Add the last month's data to the 3-month data if provided
    if (alcoholUseMes) {
        responses3Meses.amountConsumed += alcoholUseMes.amountConsumed || 0;
        responses3Meses.daysConsumed += alcoholUseMes.daysConsumed || 0;
        
        // Merge drink types consumed
        if (alcoholUseMes.drinkTypesConsumed && alcoholUseMes.drinkTypesConsumed.length > 0) {
            responses3Meses.drinkTypesConsumed = [
                ...responses3Meses.drinkTypesConsumed,
                ...alcoholUseMes.drinkTypesConsumed
            ];
        }
        
        // Update got drunk status if they got drunk in the last month
        if (alcoholUseMes.gotDrunk === "SI") {
            responses3Meses.gotDrunk = "SI";
            responses3Meses.timesDrunk += alcoholUseMes.timesDrunk || 0;
        }
    }

    return responses3Meses;
}

// Export all functions
export {
    getRandomRiskLevel,
    simulateAlcoholUse,
    simulateCigaretteUse,
    simulateMarijuanaUse,
    simulateOtherSubstancesUse,
    simulateFrequencyOfUse3Meses,
    simulateFrequencyOfUseMes,
    generateCrafftResponses
}; 