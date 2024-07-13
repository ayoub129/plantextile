// DataTable.js
import React from "react";

const DataTable = ({ data }) => {
  return (
    <div className="overflow-x-auto mx-[1rem] ml-[3rem]">
      <div className="min-w-full border border-gray-300 text-center">
        <div>
          {data &&
            data.datasets &&
            data.datasets.map((dataset, datasetIndex) => (
              <div
                key={datasetIndex}
                className="flex items-center justify-between border-b border-gray-300"
              >
                {/* <td className="py-2 px-4 border-b">{dataset.label}</td> */}
                {dataset.data.map((value, valueIndex) => (
                  <div
                    key={valueIndex}
                    className="py-5 px-4 w-[70px] border-l border-gray-300 text-center"
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          <div className="flex items-center justify-between">
            {/* <td className="py-5 px-4 border-b">Difference</td> */}
            {data &&
              data.labels &&
              data.labels.map((_, index) => {
                const difference =
                  data.datasets[0].data[index] - data.datasets[1].data[index];
                return (
                  <div
                    key={index}
                    className="py-5 w-[70px] px-4 border-l border-gray-300 text-center"
                  >
                    {difference}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
