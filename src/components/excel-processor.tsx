/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelProcessor = () => {
  const [file1Data, setFile1Data] = useState<any[]>([]);
  const [file2Data, setFile2Data] = useState<any[]>([]);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setData: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      readExcelFile(file, setData);
    }
  };

  const readExcelFile = (
    file: File,
    setData: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      } catch (error) {
        console.error(error);
        setErrorMessage('Error al leer el archivo Excel.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processFiles = () => {
    try {
      if (file1Data.length === 0 || file2Data.length === 0) {
        setErrorMessage('Por favor, carga ambos archivos Excel.');
        return;
      }

      // Concatenar los datos
      const result = [...file1Data, ...file2Data];
      setCombinedData(result);

      // Generar el archivo Excel para descargar
      const worksheet = XLSX.utils.json_to_sheet(result);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultado');

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al procesar los archivos.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Procesar Archivos Excel con JavaScript
      </h1>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Subir Archivo Excel 1:
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleFileChange(e, setFile1Data)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Subir Archivo Excel 2:
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleFileChange(e, setFile2Data)}
          className="border p-2 w-full"
        />
      </div>
      <button
        onClick={processFiles}
        disabled={file1Data.length === 0 || file2Data.length === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Procesar Archivos
      </button>

      {/* Mostrar mensaje de error */}
      {errorMessage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error:</h2>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Mostrar resultado si no hay error */}
      {combinedData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Resultado:</h2>
          {/* Mostrar la tabla */}
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                {Object.keys(combinedData[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {combinedData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className="px-4 py-2 border">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Enlace de descarga */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="resultado.xlsx"
              className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded"
            >
              Descargar archivo Excel
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelProcessor;
