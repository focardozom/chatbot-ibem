// Common first names in Colombia
const FIRST_NAMES_MALE = [
    'Estiven', 'Sebastián', 'Mateo', 'Alejandro', 'Daniel', 
    'Samuel', 'Mateo', 'David', 'Nicolás', 'Juan', 
    'José', 'Miguel', 'Carlos', 'Andrés', 'Fernando',
    'Gabriel', 'Esteban', 'Diego', 'Emmanuel', 'Diego'
];

const FIRST_NAMES_FEMALE = [
    'Sofía', 'Valentina', 'Isabella', 'Camila', 'Mariana', 
    'Gabriela', 'Sara', 'María', 'Luciana', 'Daniela', 
    'Victoria', 'Valeria', 'Emma', 'Catalina', 'Julieta',
    'Natalia', 'Paula', 'Ana', 'Laura', 'Salomé'
];

// Common last names in Colombia
const LAST_NAMES = [
    'Rodríguez', 'Gómez', 'González', 'Fernández', 'López', 
    'Martínez', 'Sánchez', 'Pérez', 'García', 'Moreno', 
    'Díaz', 'Muñoz', 'Torres', 'Rojas', 'Hernández',
    'Jiménez', 'Ortiz', 'Vargas', 'Castro', 'Ramírez'
];

// Function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to generate a random age between 13 and 18
function getRandomAge() {
    return Math.floor(Math.random() * 6) + 11; // Ages 11-16
}

// Function to generate a random name and demographic information
export function getRandomName() {
    // Randomly decide gender
    const isMale = Math.random() < 0.5;
    
    // Generate name based on gender
    const firstName = isMale 
        ? getRandomItem(FIRST_NAMES_MALE) 
        : getRandomItem(FIRST_NAMES_FEMALE);
        
    // Generate last name
    const lastName = getRandomItem(LAST_NAMES);
    
    // Generate age
    const age = getRandomAge();
    
    // Return demographic information
    return {
        firstName,
        lastName,
        gender: isMale ? 'Masculino' : 'Femenino',
        age
    };
} 