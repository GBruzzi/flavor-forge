import React from 'react';

interface FilterProps {
  filter: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterSubmit: () => void;
}

const Filter: React.FC<FilterProps> = ({ filter, onFilterChange, onFilterSubmit }) => {
  return (
    <div className="mb-6 flex">
      <input
        type="text"
        placeholder="Filtre a receita pelo nome"
        value={filter}
        onChange={onFilterChange}
        className="border border-gray-300 rounded-l-lg px-4 py-2 flex-grow"
      />
      <button
        onClick={onFilterSubmit}
        className="bg-green-fresh text-white px-4 py-2 rounded-r-lg"
      >
        Filtrar
      </button>
    </div>
  );
};

export default Filter;
