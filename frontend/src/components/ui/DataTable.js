import React from "react";

const DataTable = ({ data, type }) => {
  const getBackgroundColor = (value) => {
    if (type === "positive") {
      return value >= 0 ? "bg-green-200" : "bg-red-200";
    } else {
      return value >= 0 ? "bg-red-200" : "bg-green-200";
    }
  };

  return (
    <div className="overflow-x-auto mx-[1rem] ml-[3rem]">
      <div className="min-w-full border border-gray-300 text-center">
        {/* Header row with dates */}
        <div className="flex items-center justify-between border-b border-gray-300">
          <div className="p-5 min-w-[150px] border-l border-gray-300 text-center font-bold">
            Date
          </div>
          {data &&
            data.labels &&
            data.labels.map((label, labelIndex) => (
              <div
                key={labelIndex}
                className="p-5 min-w-[150px] border-l border-gray-300 text-center font-bold"
              >
                {label}
              </div>
            ))}
        </div>

        <div>
          {data &&
            data.datasets &&
            data.datasets.map((dataset, datasetIndex) => (
              <div
                key={datasetIndex}
                className="flex items-center justify-between border-b border-gray-300"
              >
                <div className="p-5 min-w-[150px] border-l border-gray-300 text-center font-bold">
                  {dataset.label}
                </div>
                {dataset.data.map((value, valueIndex) => (
                  <div
                    key={valueIndex}
                    className="p-5 min-w-[150px] border-l border-gray-300 text-center"
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}

          {/* Row for differences */}
          <div className="flex items-center justify-between border-b border-gray-300">
            <div className="p-5 min-w-[150px] border-l border-gray-300 text-center font-bold">
              Difference
            </div>
            {data &&
              data.labels &&
              data.labels.map((_, index) => {
                const difference =
                  data.datasets[1].data[index] - data.datasets[0].data[index];
                return (
                  <div
                    key={index}
                    className={`p-5 min-w-[150px] border-l border-gray-300 text-center ${getBackgroundColor(
                      difference
                    )}`}
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
