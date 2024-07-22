import React from 'react'
import { Table } from "@mantine/core";
import data from "../Table data/Manufac _ India Agro Dataset.json";
import './TableStyles.css';

interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string;
  "Area Under Cultivation (UOM:Ha(Hectares))": string;
}

interface GroupedData {
  year: string;
  maxProductionCrop: string;
  minProductionCrop: string;
}

const sanitizeData = (data: CropData[]): CropData[] => {
  return data.map((item) => ({
    ...item,
    "Crop Production (UOM:t(Tonnes))":
      item["Crop Production (UOM:t(Tonnes))"] === ""
        ? "0"
        : item["Crop Production (UOM:t(Tonnes))"],
    "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))":
      item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] === ""
        ? "0"
        : item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"],
    "Area Under Cultivation (UOM:Ha(Hectares))":
      item["Area Under Cultivation (UOM:Ha(Hectares))"] === ""
        ? "0"
        : item["Area Under Cultivation (UOM:Ha(Hectares))"],
  }));
};

// Helper function to group data by year
const groupByYear = (data: CropData[]): Record<string, GroupedData> => {
  return data.reduce((acc, item) => {
    const year = item.Year.slice(-4);
    const production = item["Crop Production (UOM:t(Tonnes))"];

    if (!acc[year]) {
      acc[year] = {
        year,
        maxProduction: -Infinity,
        maxProductionCrop: "",
        minProduction: Infinity,
        minProductionCrop: "",
      };
    }

    if (production !== "") {
      const productionNum = parseFloat(production);
      if (productionNum > acc[year].maxProduction) {
        acc[year].maxProduction = production;
        acc[year].maxProductionCrop = item["Crop Name"];
      }
      if (productionNum < acc[year].minProduction) {
        acc[year].minProduction = production;
        acc[year].minProductionCrop = item["Crop Name"];
      }
    }

    return acc;
  }, {} as Record<string, GroupedData>);
};

// Group data by year and calculate max and min production
const sanitizedData = sanitizeData(data);
const groupedData = groupByYear(sanitizedData);

const headers = [
  "Year",
  "Crop with Maximum Production in that Year",
  "Crop with Minimum Production in that Year ",
];

const rows = Object.values(groupedData).map((item, index) => (


    <tr key={index}>
      <td>{item.year}</td>
      <td>{item.maxProductionCrop}</td>
      <td>{item.minProductionCrop}</td>
    </tr>
  
));

const CropTable: React.FC = () => {
  

  return (
    <Table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default CropTable