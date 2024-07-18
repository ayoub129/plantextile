import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";
import { toast, ToastContainer } from "react-toastify";
import Button from "../ui/Button";

const ControlProduction = () => {
  const [models, setModels] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [production, setProduction] = useState(0);
  const [retouch, setRetouch] = useState(0);
  const [entre, setEntre] = useState(0);
  const [encore, setEncore] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.get("/models");
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchModels();
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProductionData = async () => {
      if (selectedModel) {
        try {
          const productionResponse = await api.get(
            `/control_production/${selectedModel}`
          );
          const { value, retouch } = productionResponse.data;
          setProduction(value);
          setRetouch(retouch);
        } catch (error) {
          console.error("Error fetching production data:", error);
        }

        try {
          const repassageResponse = await api.get(
            `/repassage_production/${selectedModel}`
          );
          const { value: entreValue } = repassageResponse.data;
          setEntre(entreValue);
          setEncore(entreValue - production);
        } catch (error) {
          console.error("Error fetching repassage data:", error);
        }
      }
    };

    fetchProductionData();
  }, [selectedModel, production]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handlePostChange = (e) => {
    setSelectedPost(e.target.value);
  };

  const handleChange = async (direction, type) => {
    let newValue;
    if (type === "production") {
      newValue = direction === "next" ? production + 1 : production - 1;
      if (newValue < 0) newValue = 0;
      const newEncore = entre - newValue;
      if (newEncore < 0) {
        toast.error("Encore cannot be less than 0");
        return;
      }
      setProduction(newValue);
      setEncore(newEncore);
      await updateProduction(newValue);
    } else if (type === "retouch") {
      newValue = direction === "next" ? retouch + 1 : retouch - 1;
      if (newValue < 0) newValue = 0;
      setRetouch(newValue);
    }
  };

  const updateProduction = async (newProduction) => {
    setIsButtonDisabled(true);
    try {
      await api.post(`/control_production/${selectedModel}`, {
        value: newProduction,
      });
    } catch (error) {
      console.error("Error updating production data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleRetouchSubmit = async () => {
    if (!selectedPost) {
      toast.error("Please select a post before submitting retouch.");
      return;
    }

    setIsButtonDisabled(true);
    try {
      await api.post(`/retouch`, {
        model_id: selectedModel,
        value: retouch,
        post_id: selectedPost,
      });

      setRetouch(0);
      setSelectedPost("");
    } catch (error) {
      console.error("Error updating retouch data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Control Final</h2>
        <div className="ml-7 mb-4 pr-6 flex items-center justify-between">
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedModel}
            onChange={handleModelChange}
          >
            <option value="">Select model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.modele}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedModelData && (
        <div className="w-full pr-6">
          <div
            key={selectedModelData.id}
            className="flex items-center justify-between"
          >
            <h3 className="font-semibold">{selectedModelData.category}</h3>
            <h3 className="font-semibold">{selectedModelData.client}</h3>
          </div>
        </div>
      )}
      <div className="w-full pr-6">
        {selectedModelData && (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Encore: {encore}</h3>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        {selectedModel && (
          <div className="flex flex-col items-center mx-auto mt-[2rem] mb-4 shadow-md w-fit p-3 rounded border">
            <h3 className="font-semibold">Total Production</h3>
            <div className="flex items-center">
              <button
                className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
                onClick={() => handleChange("prev", "production")}
                disabled={isButtonDisabled}
              >
                -
              </button>
              <Input
                handleChange={() => {}}
                name={"production"}
                disabled
                placeholder="Total Production"
                text={production ? production.toString() : "0"}
              />
              <button
                className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
                onClick={() => handleChange("next", "production")}
                disabled={isButtonDisabled}
              >
                +
              </button>
            </div>
          </div>
        )}
        {selectedModel && (
          <div className="flex flex-col items-center mx-auto mt-[2rem] mb-4 shadow-md w-fit p-3 rounded border">
            <h3 className="font-semibold">Total Retouch</h3>
            <div className="flex items-center">
              <button
                className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
                onClick={() => handleChange("prev", "retouch")}
                disabled={isButtonDisabled}
              >
                -
              </button>
              <Input
                handleChange={() => {}}
                name={"retouch"}
                disabled
                placeholder="Total Retouch"
                text={retouch ? retouch.toString() : "0"}
              />
              <button
                className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
                onClick={() => handleChange("next", "retouch")}
                disabled={isButtonDisabled}
              >
                +
              </button>
              <div>
                <select
                  id="select"
                  className="block w-fit mt-4 mr-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
                  value={selectedPost}
                  onChange={handlePostChange}
                  disabled={retouch === 0}
                >
                  <option value="">Select Post</option>
                  {posts.map((post, index) => (
                    <option key={index} value={post.id}>
                      {post.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                classes={"bg-blue-500 mt-4"}
                handlePress={handleRetouchSubmit}
                disabled={isButtonDisabled}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlProduction;
