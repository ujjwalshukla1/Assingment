import React from "react";
import { Table } from "@mantine/core";
import data from "../Table data/Manufac _ India Agro Dataset.json";

interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string;
  "Area Under Cultivation (UOM:Ha(Hectares))": string;
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

const calculateAverageYield = (
  data: CropData[]
): Record<string, { averageYield: number; averageArea: number }> => {
  const cropYieldSum: Record<string, number> = {};
  const cropAreaSum: Record<string, number> = {};
  const cropCount: Record<string, number> = {};

  data.forEach((item) => {
    const crop = item["Crop Name"];
    const yieldValue = parseFloat(
      item["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]
    );
    const areaValue = parseFloat(
      item["Area Under Cultivation (UOM:Ha(Hectares))"]
    );

    if (!isNaN(yieldValue)) {
      if (!cropYieldSum[crop]) {
        cropYieldSum[crop] = 0;
        cropCount[crop] = 0;
      }
      cropYieldSum[crop] += yieldValue;
      cropCount[crop] += 1;
    }

    if (!isNaN(areaValue)) {
      if (!cropAreaSum[crop]) {
        cropAreaSum[crop] = 0;
      }
      cropAreaSum[crop] += areaValue;
    }
  });

  const averages: Record<
    string,
    { averageYield: number; averageArea: number }
  > = {};
  for (const crop in cropYieldSum) {
    averages[crop] = {
      averageYield: cropYieldSum[crop] / cropCount[crop],
      averageArea: cropAreaSum[crop] / cropCount[crop],
    };
  }

  return averages;
};

// Sanitize data to convert empty strings to zero
const sanitizedData = sanitizeData(data);

// Calculate average yield for each crop
const averageData = calculateAverageYield(sanitizedData);

const headers = ["Crop Name", "Average Yield of the Crop between 1950-2020", "Average Cultivation Area of the Crop between 1950-2020"];

const rows = Object.entries(averageData).map(([crop, averages], index) => (
    <tr key={index}>
      <td>{crop}</td>
      <td>{averages.averageYield.toFixed(2)}</td>
      <td>{averages.averageArea.toFixed(2)}</td>
    </tr>
  ));

const AverageYieldTable: React.FC = () => {
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

export default AverageYieldTable;
