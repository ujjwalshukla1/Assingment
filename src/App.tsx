import React from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import CropTable from './components/CropTable';
import AverageYieldTable from './components/AverageTable';

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <CropTable />
      <AverageYieldTable/>
    </MantineProvider>
  );
};

export default App;

