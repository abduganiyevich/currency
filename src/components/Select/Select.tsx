

interface Option {
  code: string;
  flag?: string;
  name: string;
}

interface SelectProps {
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({ value, options, onChange }) => {
  return (
    <div>
      <select value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.code} value={option.code}>
            {option.flag && <img src={option.flag} alt={`${option.name} flag`} />} 
            {option.name} ({option.code}) 
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
