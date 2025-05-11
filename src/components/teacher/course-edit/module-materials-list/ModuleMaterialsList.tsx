import React from 'react';

export interface Material {
    id: number;
    name: string;
    url: string;
  }
  
interface ModuleMaterialsListProps {
  materials: Material[] | undefined;
}

const ModuleMaterialsList: React.FC<ModuleMaterialsListProps> = ({ materials }) => {
  if (!materials || materials.length === 0) return null;
  
  return (
    <div className="module__section">
      <h4 className="module__section-title">Материалы</h4>
      <ul className="module__list">
        {materials.map(material => (
          <li key={material.id} className="module__list-item module__list-item--material">
            <a href={material.url} className="module__material-link">
              {material.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleMaterialsList;