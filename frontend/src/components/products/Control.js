import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Input from "../ui/Input";

const ControlProduction = () => {
  const [models, setModels] = useState([]);
  const [chains, setChains] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedPost, setSelectedPost] = useState("");

  const [production, setProduction] = useState(0);
  const [retouch, setRetouch] = useState(0);

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

    const fetchChains = async () => {
      try {
        const response = await api.get("/chains");
        setChains(response.data);
      } catch (error) {
        console.error("Error fetching chains:", error);
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
    fetchChains();
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProductionData = async () => {
      if (selectedModel && selectedChain) {
        try {
          const response = await api.get(
            `/control_production/${selectedModel}/${selectedChain}`
          );
          const { production, retouch, posts } = response.data;
          setProduction(production);
          setRetouch(retouch);
          setSelectedPost(posts);
        } catch (error) {
          console.error("Error fetching production data:", error);
        }
      }
    };

    fetchProductionData();
  }, [selectedModel, selectedChain]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const handlePostChange = (e) => {
    setSelectedPost(e.target.value);
  };

  const onChange = (name, value) => {
    if (name === "production") setProduction(parseInt(value, 10));
    if (name === "retouch") setRetouch(parseInt(value, 10));
  };

  const handleChange = async (direction, type) => {
    let newValue;
    if (type === "production") {
      newValue = direction === "next" ? production + 1 : production - 1;
      if (newValue < 0) newValue = 0;
      setProduction(newValue);
    } else if (type === "retouch") {
      newValue = direction === "next" ? retouch + 1 : retouch - 1;
      if (newValue < 0) newValue = 0;
      setRetouch(newValue);
    }

    setIsButtonDisabled(true);

    try {
      await api.post(`/control_production/${selectedModel}/${selectedChain}`, {
        value: type === "production" ? newValue : production,
        retouch: type === "retouch" ? newValue : retouch,
        posts: selectedPost,
      });
    } catch (error) {
      console.error("Error updating production data:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const selectedModelData = models.find((model) => model.id == selectedModel);

  return (
    <div className="ml-[19%] pt-[6rem]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Control Final</h2>
        <div className="ml-7 mb-4 pr-6 flex items-center w-[325px] justify-between">
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
          <select
            className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
            value={selectedChain}
            onChange={handleChainChange}
          >
            <option value="">Select Chain</option>
            {chains.map((chain, index) => (
              <option key={index} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedModelData && selectedChain && (
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
      <div className="flex justify-between items-center">
        {selectedModel && selectedChain && (
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
                handleChange={(name, value) => onChange("production", value)}
                name={"production"}
                placeholder="Total Production"
                text={production}
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
        {selectedModel && selectedChain && (
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
                handleChange={(name, value) => onChange("retouch", value)}
                name={"retouch"}
                placeholder="Total Retouch"
                text={retouch}
              />
              <button
                className="font-semibold text-[18px] hover:bg-gray-200 p-2 transition duration-300 rounded"
                onClick={() => handleChange("next", "retouch")}
                disabled={isButtonDisabled}
              >
                +
              </button>
            </div>
            <select
              className="block w-fit mt-4 outline-0 p-[.5rem] border border-[#b3b3b3] focus:border-2 focus:border-[#2684ff] rounded"
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
        )}
      </div>
    </div>
  );
};

export default ControlProduction;
