import React from 'react';

interface DrugUseData {
  alcoholUse: {
    vida: string;
    ano: string;
    tresMeses: string;
    mes: string;
  };
  frequencyOfUseMes: {
    amountConsumed: number;
    daysConsumed: number;
    drinkTypesConsumed: string[];
    gotDrunk: string;
    timesDrunk: number;
  };
  frequencyOfUse3Meses: {
    amountConsumed: number;
    daysConsumed: number;
    drinkTypesConsumed: string[];
    gotDrunk: string;
    timesDrunk: number;
  };
  cigaretteUse: {
    vida: string;
    ano: string;
    tresMeses: string;
    mes: string;
  };
  marijuanaUse: {
    vida: string;
    ano: string;
    tresMeses: string;
    mes: string;
  };
  otherSubstancesUse: {
    vida: string;
    ano: string;
    tresMeses: string;
    mes: string;
  };
  crafftResponses: {
    crafft_1: string;
    crafft_2: string;
    crafft_3: string;
    crafft_4: string;
    crafft_5: string;
    crafft_6: string;
  };
}

interface DrugUseSidebarProps {
  drugUseData: DrugUseData;
}

const DrugUseSidebar: React.FC<DrugUseSidebarProps> = ({ drugUseData }) => {
  const {
    alcoholUse,
    frequencyOfUseMes,
    frequencyOfUse3Meses,
    cigaretteUse,
    marijuanaUse,
    otherSubstancesUse,
    crafftResponses
  } = drugUseData;

  return (
    <div className="w-80 h-full overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Formulario de Consumo</h2>
      
      {/* Lifetime Use Section */}
      <section className="mb-6">
        <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">Consumo en la Vida</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Alcohol</span>
            <span className={`text-sm font-medium ${alcoholUse.vida === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {alcoholUse.vida}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cigarrillo</span>
            <span className={`text-sm font-medium ${cigaretteUse.vida === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {cigaretteUse.vida}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Marihuana</span>
            <span className={`text-sm font-medium ${marijuanaUse.vida === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {marijuanaUse.vida}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Otras Sustancias</span>
            <span className={`text-sm font-medium ${otherSubstancesUse.vida === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {otherSubstancesUse.vida}
            </span>
          </div>
        </div>
      </section>

      {/* Last 3 Months Section */}
      <section className="mb-6">
        <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">Últimos 3 Meses</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Días de Consumo</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {frequencyOfUse3Meses.daysConsumed} días
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cantidad de Bebidas</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {frequencyOfUse3Meses.amountConsumed}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Veces Emborrachado</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {frequencyOfUse3Meses.timesDrunk}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tipos de Bebidas:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {frequencyOfUse3Meses.drinkTypesConsumed.map((drink, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {drink}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Last 30 Days Section */}
      <section className="mb-6">
        <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">Últimos 30 Días</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Días de Consumo</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {frequencyOfUseMes.daysConsumed} días
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cantidad de Bebidas</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {frequencyOfUseMes.amountConsumed}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Veces Emborrachado</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {frequencyOfUseMes.timesDrunk}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tipos de Bebidas:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {frequencyOfUseMes.drinkTypesConsumed.map((drink, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {drink}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CRAFFT Section */}
      <section>
        <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">Cuestionario CRAFFT</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Carro con conductor ebrio</span>
            <span className={`text-sm font-medium ${crafftResponses.crafft_1 === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {crafftResponses.crafft_1}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Alcohol para relajarse</span>
            <span className={`text-sm font-medium ${crafftResponses.crafft_2 === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {crafftResponses.crafft_2}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Consumo en soledad</span>
            <span className={`text-sm font-medium ${crafftResponses.crafft_3 === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {crafftResponses.crafft_3}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Olvidos por alcohol</span>
            <span className={`text-sm font-medium ${crafftResponses.crafft_4 === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {crafftResponses.crafft_4}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Familia sugiere reducir</span>
            <span className={`text-sm font-medium ${crafftResponses.crafft_5 === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {crafftResponses.crafft_5}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Problemas por alcohol</span>
            <span className={`text-sm font-medium ${crafftResponses.crafft_6 === 'SI' ? 'text-red-600' : 'text-green-600'}`}>
              {crafftResponses.crafft_6}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DrugUseSidebar; 