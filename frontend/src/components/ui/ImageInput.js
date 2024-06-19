import React, { useState } from 'react';

const ImageInput = ({ label, handleFileChange }) => {
    const [fileName, setFileName] = useState('');

    const onFileChange = (e) => {
        handleFileChange(e);
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('');
        }
    };

    return (
        <div className="mt-[2rem]">
            <label className="block font-semibold mb-4">{label}</label>
            <div className="border-dashed border-2 border-gray-400 rounded-lg p-4 text-center">
                <input
                    type="file"
                    id="groupImage"
                    onChange={onFileChange}
                    className="hidden"
                />
                <label
                    htmlFor="groupImage"
                    className="block text-blue-500 cursor-pointer mt-2"
                >
                    <div className="text-center">
                        <p>Sélectionnez le fichier ici</p>
                        <div className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 inline-block">
                            Choisir le fichier
                        </div>
                        {fileName && (
                            <div className="mt-2 text-gray-700">
                                <p>Fichier sélectionné: {fileName}</p>
                            </div>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
}

export default ImageInput;
