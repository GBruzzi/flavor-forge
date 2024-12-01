import React from 'react';

interface TituloProps {
  text: string;
  fontSize?: string; 
  color?: string;    
  marginBottom?: string; 
  textAlign?: string;
}

const Titulo: React.FC<TituloProps> = ({
  text,
  fontSize = 'text-3xl',
  color = '#f8b400',
  marginBottom = 'mb-6',
  textAlign = 'text-center',
}) => {
  return (
    <h1 className={`${fontSize} font-bold text-[${color}] ${marginBottom} ${textAlign}`}>
      {text}
    </h1>
  );
};

export default Titulo;
